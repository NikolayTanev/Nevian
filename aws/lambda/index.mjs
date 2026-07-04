// Nevian contact form Lambda.
// Receives a JSON payload from the website contact form (POST /contact),
// validates it, and emails the submission to RECIPIENT_EMAIL via SES.
//
// Env vars (set by the SAM template):
//   RECIPIENT_EMAIL   inbox that receives submissions
//   SENDER_EMAIL      SES-verified From address
//   ALLOWED_ORIGIN    origin allowed by CORS

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});

const {
  RECIPIENT_EMAIL,
  SENDER_EMAIL,
  ALLOWED_ORIGIN = '*',
} = process.env;

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
  'Content-Type': 'application/json',
};

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function isValidEmail(e) {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}

function respond(statusCode, body) {
  return { statusCode, headers: corsHeaders, body: JSON.stringify(body) };
}

export const handler = async (event) => {
  // CORS preflight. HTTP API also handles this at the platform layer once
  // CORS is configured, but returning here keeps things resilient.
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders };
  }

  // Parse body. HTTP API can base64-encode when Content-Type is binary.
  let payload;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : (event.body || '');
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    return respond(400, { error: 'Invalid JSON body.' });
  }

  // Honeypot. Bots often fill hidden inputs. If the honeypot field has
  // a value, pretend success and drop the message silently.
  if (payload.website) {
    return respond(200, { ok: true });
  }

  const firstName   = String(payload.firstName   || '').trim();
  const lastName    = String(payload.lastName    || '').trim();
  const email       = String(payload.email       || '').trim();
  const company     = String(payload.company     || '').trim();
  const companySize = String(payload.companySize || '').trim();
  const devices     = String(payload.devices     || '').trim();
  const improve     = String(payload.improve     || '').trim();
  const message     = String(payload.message     || '').trim();

  if (!firstName || !lastName || !isValidEmail(email)) {
    return respond(400, {
      error: 'First name, last name, and a valid email are required.',
    });
  }
  if (message.length > 4000 || company.length > 200) {
    return respond(400, { error: 'Message too long.' });
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const subject = `Nevian demo request: ${company || fullName}`;

  const textBody = [
    'New Nevian demo request',
    '------------------------',
    `Name:          ${fullName}`,
    `Email:         ${email}`,
    `Company:       ${company     || '(not provided)'}`,
    `Company size:  ${companySize || '(not provided)'}`,
    `Devices:       ${devices     || '(not provided)'}`,
    `Looking for:   ${improve     || '(not provided)'}`,
    '',
    'Message:',
    message || '(none)',
  ].join('\n');

  const rows = [
    ['Name',         escapeHtml(fullName)],
    ['Email',        `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`],
    ['Company',      escapeHtml(company)     || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Company size', escapeHtml(companySize) || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Devices',      escapeHtml(devices)     || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Looking for',  escapeHtml(improve)     || '<em style="color:#9ca3af;">(not provided)</em>'],
  ]
    .map(([k, v]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;vertical-align:top;">${k}</td><td style="padding:6px 0;">${v}</td></tr>`
    )
    .join('');

  const htmlBody = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f8fa;font-family:Inter,Arial,sans-serif;color:#0a0d0c;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;">
    <h2 style="margin:0 0 6px;color:#15a06b;font-size:20px;">New Nevian demo request</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">Submitted from the nevian.info contact form.</p>
    <table style="border-collapse:collapse;font-size:14px;line-height:1.5;width:100%;">${rows}</table>
    ${message ? `<h3 style="margin:24px 0 8px;font-size:15px;">Message</h3><p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.55;">${escapeHtml(message)}</p>` : ''}
  </div>
</body></html>`;

  try {
    await ses.send(new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: { ToAddresses: [RECIPIENT_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: subject,  Charset: 'UTF-8' },
        Body: {
          Text: { Data: textBody, Charset: 'UTF-8' },
          Html: { Data: htmlBody, Charset: 'UTF-8' },
        },
      },
    }));
  } catch (err) {
    console.error('SES SendEmail failed:', err);
    return respond(502, {
      error: 'We could not deliver your message. Please email hello@nevian.info directly.',
    });
  }

  return respond(200, { ok: true });
};
