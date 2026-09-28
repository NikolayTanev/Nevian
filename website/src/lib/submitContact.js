const EMAIL = 'contact@nevian.info';
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

export { EMAIL };

function mailtoFallback(data, subjectPrefix) {
  const subject = `${subjectPrefix}: ${data.company || data.firstName || 'New request'}`;
  const body = [
    `Name: ${data.firstName || ''} ${data.lastName || ''}`.trim(),
    `Work email: ${data.email || ''}`,
    `Company: ${data.company || ''}`,
    `Company size: ${data.companySize || ''}`,
    `Number of devices: ${data.devices || ''}`,
    `Looking to improve: ${data.goal || data.improve || ''}`,
    '',
    data.message || '',
  ].join('\n');

  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function submitContact(data, { subjectPrefix = 'Nevian contact form' } = {}) {
  if (data.website) {
    return { ok: true };
  }

  if (!ENDPOINT) {
    mailtoFallback(data, subjectPrefix);
    return { ok: true, openedMail: true };
  }

  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    company: data.company,
    companySize: data.companySize,
    devices: data.devices,
    goal: data.goal || data.improve,
    improve: data.goal || data.improve,
    message: data.message,
    website: data.website || '',
  };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok || body.error) {
    throw new Error(body.error || `We could not send your request. Email ${EMAIL} instead.`);
  }

  return { ok: true };
}
