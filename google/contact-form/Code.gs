// Nevian contact form → Google Workspace mailbox.
// Deploy this as a Web App (Execute as: Me, Who has access: Anyone)
// from the contact@nevian.info Google account, then put the /exec URL in
// VITE_CONTACT_ENDPOINT on the website.

var RECIPIENT_EMAIL = 'contact@nevian.info';
var SENDER_NAME = 'Nevian website';

function doGet() {
  return json_({ ok: true, service: 'nevian-contact' });
}

function doPost(event) {
  var payload = parsePayload_(event);

  if (payload.website) {
    return json_({ ok: true });
  }

  var firstName = String(payload.firstName || '').trim();
  var lastName = String(payload.lastName || '').trim();
  var email = String(payload.email || '').trim();
  var company = String(payload.company || '').trim();
  var companySize = String(payload.companySize || '').trim();
  var devices = String(payload.devices || '').trim();
  var lookingFor = String(payload.goal || payload.improve || '').trim();
  var message = String(payload.message || '').trim();

  if (!firstName || !lastName || !isValidEmail_(email)) {
    return json_({ error: 'First name, last name, and a valid email are required.' });
  }
  if (message.length > 4000 || company.length > 200) {
    return json_({ error: 'Message too long.' });
  }

  var fullName = (firstName + ' ' + lastName).trim();
  var subject = 'Nevian contact form: ' + (company || fullName);

  var textBody = [
    'New Nevian contact form submission',
    '------------------------',
    'Name:          ' + fullName,
    'Email:         ' + email,
    'Company:       ' + (company || '(not provided)'),
    'Company size:  ' + (companySize || '(not provided)'),
    'Devices:       ' + (devices || '(not provided)'),
    'Looking for:   ' + (lookingFor || '(not provided)'),
    '',
    'Message:',
    message || '(none)',
  ].join('\n');

  var rows = [
    ['Name', escapeHtml_(fullName)],
    ['Email', '<a href="mailto:' + escapeHtml_(email) + '">' + escapeHtml_(email) + '</a>'],
    ['Company', escapeHtml_(company) || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Company size', escapeHtml_(companySize) || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Devices', escapeHtml_(devices) || '<em style="color:#9ca3af;">(not provided)</em>'],
    ['Looking for', escapeHtml_(lookingFor) || '<em style="color:#9ca3af;">(not provided)</em>'],
  ].map(function (row) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#6b7280;vertical-align:top;">' + row[0] +
      '</td><td style="padding:6px 0;">' + row[1] + '</td></tr>';
  }).join('');

  var htmlBody = '<!doctype html><html><body style="margin:0;padding:24px;background:#f6f8fa;font-family:Inter,Arial,sans-serif;color:#0a0d0c;">' +
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;">' +
    '<h2 style="margin:0 0 6px;color:#15a06b;font-size:20px;">New contact form submission</h2>' +
    '<p style="margin:0 0 20px;color:#6b7280;font-size:13px;">Submitted from the nevian.info contact form.</p>' +
    '<table style="border-collapse:collapse;font-size:14px;line-height:1.55;width:100%;">' + rows + '</table>' +
    (message
      ? '<h3 style="margin:24px 0 8px;font-size:15px;">Message</h3><p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.55;">' + escapeHtml_(message) + '</p>'
      : '') +
    '</div></body></html>';

  GmailApp.sendEmail(RECIPIENT_EMAIL, subject, textBody, {
    htmlBody: htmlBody,
    replyTo: email,
    name: SENDER_NAME,
  });

  return json_({ ok: true });
}

function parsePayload_(event) {
  try {
    var raw = event && event.postData && event.postData.contents;
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function isValidEmail_(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character];
  });
}

function json_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
