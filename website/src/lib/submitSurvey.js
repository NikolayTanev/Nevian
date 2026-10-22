const ENDPOINT = import.meta.env.VITE_SURVEY_ENDPOINT || '';

// Posts an anonymous survey answer to the Apps Script web app in google/survey.
// text/plain keeps it a "simple" request, so the browser skips the CORS
// preflight that Apps Script can't answer.
export async function submitSurvey(answer) {
  if (answer.website) return { ok: true };

  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      console.info('[survey] VITE_SURVEY_ENDPOINT not set, answer not stored:', answer);
      return { ok: true };
    }
    throw new Error('missing-endpoint');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(answer),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok || body.error) {
    throw new Error(body.error || `HTTP ${response.status}`);
  }
  return { ok: true };
}
