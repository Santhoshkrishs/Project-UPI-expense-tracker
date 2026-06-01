// ─────────────────────────────────────────────────────────────
//  UPI Parser → Google Sheets Bridge
//  Paste this entire file into Google Apps Script, then deploy
//  as a Web App (see setup guide).
// ─────────────────────────────────────────────────────────────

const SHEET_NAME   = "Transaction Log";
const BUDGET_SHEET = "Budget";
const SUMMARY_SHEET = "Dashboard";

// ── Entry point: receives POST from the web app ───────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action  = payload.action || "append";

    if (action === "append")  return respond(appendTransactions(payload.rows));
    if (action === "replace") return respond(replaceTransactions(payload.rows));
    if (action === "ping")    return respond({ ok: true, message: "Connected!" });

    return respond({ ok: false, message: "Unknown action" });
  } catch (err) {
    return respond({ ok: false, message: err.toString() });
  }
}

// Allow the web app to check connectivity with a GET ping
function doGet(e) {
  return respond({ ok: true, message: "UPI Parser bridge is live!" });
}

// ── Append rows (skip duplicates by date+desc+amount) ─────────
function appendTransactions(rows) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_NAME);

  ensureHeaders(sheet);

  const existing = getExistingKeys(sheet);
  let added = 0, skipped = 0;

  rows.forEach(r => {
    const key = `${r.date}|${r.desc}|${r.amount}`;
    if (existing.has(key)) { skipped++; return; }
    sheet.appendRow([r.date, r.desc, Number(r.amount), r.category, r.month, r.mode || "UPI", ""]);
    existing.add(key);
    added++;
  });

  updateSummary(ss);
  return { ok: true, added, skipped, total: added + skipped };
}

// ── Replace all rows for the months present in new data ───────
function replaceTransactions(rows) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_NAME);

  ensureHeaders(sheet);

  // Find which months are in the new data
  const incomingMonths = new Set(rows.map(r => r.month));

  // Delete existing rows for those months
  const data = sheet.getDataRange().getValues();
  // Walk backwards so row deletion doesn't shift indices
  for (let i = data.length - 1; i >= 1; i--) {
    if (incomingMonths.has(data[i][4])) sheet.deleteRow(i + 1);
  }

  // Append fresh data
  rows.forEach(r => {
    sheet.appendRow([r.date, r.desc, Number(r.amount), r.category, r.month, r.mode || "UPI", ""]);
  });

  updateSummary(ss);
  return { ok: true, replaced: rows.length, months: [...incomingMonths] };
}

// ── Rebuild the Dashboard summary sheet ───────────────────────
function updateSummary(ss) {
  const logSheet = ss.getSheetByName(SHEET_NAME);
  if (!logSheet) return;

  const dash = getOrCreateSheet(ss, SUMMARY_SHEET);

  // Gather data
  const data = logSheet.getDataRange().getValues().slice(1); // skip header
  const catTotals = {};
  const monthTotals = {};

  data.forEach(row => {
    const amt  = Number(row[2]) || 0;
    const cat  = row[3] || "Miscellaneous";
    const mon  = row[4] || "—";
    catTotals[cat]   = (catTotals[cat]   || 0) + amt;
    monthTotals[mon] = (monthTotals[mon] || 0) + amt;
  });

  // Write category summary
  dash.clearContents();
  dash.appendRow(["Category", "Total Spent (₹)"]);
  Object.entries(catTotals).sort((a,b) => b[1]-a[1]).forEach(([cat, amt]) => {
    dash.appendRow([cat, amt]);
  });

  dash.appendRow([]);
  dash.appendRow(["Month", "Total Spent (₹)"]);
  const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  MONTH_ORDER.forEach(m => {
    if (monthTotals[m]) dash.appendRow([m, monthTotals[m]]);
  });

  // Style header rows
  const headerRanges = ["A1:B1"];
  headerRanges.forEach(r => {
    dash.getRange(r).setFontWeight("bold").setBackground("#1a1d27").setFontColor("#ffffff");
  });
}

// ── Helpers ───────────────────────────────────────────────────
function ensureHeaders(sheet) {
  const first = sheet.getRange(1, 1).getValue();
  if (!first || first === "") {
    sheet.getRange(1, 1, 1, 7).setValues([["Date","Description","Amount (₹)","Category","Month","Payment Mode","Notes"]]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#2563eb").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function getExistingKeys(sheet) {
  const keys = new Set();
  const data = sheet.getDataRange().getValues().slice(1);
  data.forEach(row => keys.add(`${row[0]}|${row[1]}|${row[2]}`));
  return keys;
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
