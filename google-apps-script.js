/**
 * ═══════════════════════════════════════════════════════════════
 *  Mayna Diamonds — Google Apps Script for Feedback Collection
 * ═══════════════════════════════════════════════════════════════
 *
 *  HOW TO USE:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Replace the default Code.gs content with this entire file
 *  3. Click "Deploy" → "New deployment"
 *  4. Select type: "Web app"
 *  5. Set "Execute as": Me (your Google account)
 *  6. Set "Who has access": Anyone
 *  7. Click "Deploy" and authorize when prompted
 *  8. Copy the Web App URL — this goes into your Vercel
 *     environment variable as GOOGLE_SCRIPT_URL
 *
 *  SHEET SETUP:
 *  Make sure Row 1 of your sheet has these headers:
 *    A1: Timestamp
 *    B1: Rating
 *    C1: Name
 *    D1: Phone
 *    E1: Staff Experience
 *    F1: Comments
 */

function doPost(e) {
  try {
    // Parse the incoming JSON
    var data = JSON.parse(e.postData.contents);

    // Open the active spreadsheet and get the first sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Append a new row with the feedback data
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // Timestamp (IST)
      data.rating || "",
      data.name || "",
      data.phone || "",
      data.staffExperience || "",
      data.comments || ""
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Feedback recorded" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: handle GET requests with a simple status page
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Mayna Diamonds Feedback API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
