// Nevian pain-point survey → Google Sheet (one row per answer).
//
// Create a Google Sheet, then Extensions → Apps Script, paste this file and
// Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
// Put the /exec URL in VITE_SURVEY_ENDPOINT on the website.
//
// Anonymous by design: no names, emails or IPs are stored (Apps Script never
// sees the visitor's IP). Download the data any time via File → Download → CSV.

var SHEET_NAME = 'Responses';

// Must match the option codes in website/src/components/SurveyPage.jsx.
var PAINS = ['repeat', 'patching', 'remote', 'compliance', 'other'];
var TEAM_SIZES = ['1', '2-3', '4-10', '10+'];
var LANGS = ['de', 'en'];

var HEADERS = ['timestamp', 'lang', 'team_size'].concat(PAINS).concat(['other_text', 'wish']);

function doGet() {
  return json_({ ok: true, service: 'nevian-survey' });
}

function doPost(event) {
  var payload = parsePayload_(event);

  // Honeypot: bots fill hidden inputs. Pretend success, store nothing.
  if (payload.website) {
    return json_({ ok: true });
  }

  var pains = Array.isArray(payload.pains) ? payload.pains : [];
  pains = pains
    .map(function (p) { return String(p); })
    .filter(function (p, i, all) { return PAINS.indexOf(p) !== -1 && all.indexOf(p) === i; });

  var teamSize = String(payload.teamSize || '');
  var lang = LANGS.indexOf(payload.lang) !== -1 ? payload.lang : 'de';

  if (pains.length !== 1) {
    return json_({ error: 'Pick one answer for question 1.' });
  }
  if (TEAM_SIZES.indexOf(teamSize) === -1) {
    return json_({ error: 'Pick a team size.' });
  }

  var otherText = pains.indexOf('other') !== -1 ? clean_(payload.otherText, 200) : '';
  var wish = clean_(payload.wish, 1000);

  var row = [new Date(), lang, teamSize]
    .concat(PAINS.map(function (p) { return pains.indexOf(p) !== -1 ? 1 : 0; }))
    .concat([otherText, wish]);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow(row);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

// Optional: run once from the editor to add a "Summary" tab with live counts
// and percentages for the results post ("63% of you said...").
function setupSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getSheet_();
  var summary = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  summary.clear();

  var rows = [['Answer', 'Count', 'Share of respondents']];
  rows.push(['Total responses', "=COUNTA(Responses!A2:A)", '']);

  PAINS.forEach(function (pain, i) {
    var col = columnLetter_(4 + i); // timestamp, lang, team_size come first
    rows.push([
      'Pain: ' + pain,
      '=SUM(Responses!' + col + '2:' + col + ')',
      '=IFERROR(B' + (rows.length + 1) + '/$B$2, 0)',
    ]);
  });

  TEAM_SIZES.forEach(function (size) {
    rows.push([
      'Team: ' + size,
      '=COUNTIF(Responses!C2:C, "' + size + '")',
      '=IFERROR(B' + (rows.length + 1) + '/$B$2, 0)',
    ]);
  });

  summary.getRange(1, 1, rows.length, 3).setValues(rows);
  summary.getRange(2, 3, rows.length - 1, 1).setNumberFormat('0%');
  summary.getRange(1, 1, 1, 3).setFontWeight('bold');
  summary.autoResizeColumns(1, 3);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Trim, cap length, and neutralise spreadsheet formulas: Sheets would
// otherwise evaluate free text that starts with = + - or @.
function clean_(value, max) {
  var text = String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (text.length > max) text = text.slice(0, max);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return text;
}

function columnLetter_(index) {
  var letters = '';
  while (index > 0) {
    var mod = (index - 1) % 26;
    letters = String.fromCharCode(65 + mod) + letters;
    index = Math.floor((index - 1) / 26);
  }
  return letters;
}

function parsePayload_(event) {
  try {
    var raw = event && event.postData && event.postData.contents;
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function json_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
