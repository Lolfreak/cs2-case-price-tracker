// ============================================================
// CS2 Case Price Tracker — Google Apps Script
// Fetches lowest CSFloat listings every 6 hours
// Prices displayed in SGD
// ============================================================

const CSFLOAT_API_KEY = "YOUR_API_KEY_HERE"; // ← Paste your API key
const SHEET_NAME = "CS2 Case Price Tracker";

// All CS2 cases grouped by category (exact Steam market_hash_name)
const CASES = [
  "Sealed Dead Hand Terminal",
  "Sealed Genesis Terminal",
  "Fever Case",
  "Gallery Case",
  "Kilowatt Case",
  "Revolution Case",
  "Recoil Case",
  "Dreams & Nightmares Case",
  "Operation Riptide Case",
  "Snakebite Case",
  "Operation Broken Fang Case",
  "Fracture Case",
  "Prisma 2 Case",
  "Shattered Web Case",
  "CS20 Case",
  "Prisma Case",
  "Danger Zone Case",
  "Horizon Case",
  "Clutch Case",
  "Spectrum 2 Case",
  "Operation Hydra Case",
  "Spectrum Case",
  "Glove Case",
  "Gamma 2 Case",
  "Gamma Case",
  "Chroma 3 Case",
  "Operation Wildfire Case",
  "Revolver Case",
  "Shadow Case",
  "Falchion Case",
  "Chroma 2 Case",
  "Chroma Case",
  "Operation Vanguard Weapon Case",
  "Huntsman Weapon Case",
  "eSports 2014 Summer Case",
  "Operation Breakout Weapon Case",
  "Operation Phoenix Weapon Case",
  "CS:GO Weapon Case 3",
  "eSports 2013 Winter Case",
  "Winter Offensive Weapon Case",
  "CS:GO Weapon Case 2",
  "Operation Bravo Case",
  "eSports 2013 Case",
  "CS:GO Weapon Case",
];

// ─────────────────────────────────────────────
// SETUP: Run this ONCE to build the sheet
// ─────────────────────────────────────────────
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (sheet) {
    sheet.clearContents();
    sheet.clearFormats();
  } else {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 200);

  // Title row
  sheet.getRange("A1:F1").merge();
  sheet.getRange("A1").setValue("📦 CS2 Case Price Tracker")
    .setFontSize(16).setFontWeight("bold")
    .setBackground("#1a1a2e").setFontColor("#e0e0e0")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(1, 40);

  // Exchange rate row
  sheet.getRange("A2").setValue("USD → SGD Rate:").setFontWeight("bold").setFontColor("#555555");
  sheet.getRange("B2").setValue("(run refresh to update)").setFontColor("#888888").setFontStyle("italic");
  sheet.getRange("D2").setValue("Last Full Refresh:").setFontWeight("bold").setFontColor("#555555");
  sheet.getRange("E2:F2").merge();
  sheet.getRange("E2").setValue("Never").setFontColor("#888888");

  // Column headers
  const headers = ["Case Name", "Qty", "Price (USD)", "Price (SGD)", "Total (SGD)", "Status"];
  sheet.getRange(3, 1, 1, 6).setValues([headers])
    .setFontWeight("bold")
    .setBackground("#16213e")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(3, 30);

  // Case rows
  let currentRow = 4;
  for (const caseName of CASES) {
    sheet.getRange(currentRow, 1).setValue(caseName);
    sheet.getRange(currentRow, 2).setValue(0).setHorizontalAlignment("center").setNumberFormat("0");
    sheet.getRange(currentRow, 3).setValue("—").setHorizontalAlignment("center");
    sheet.getRange(currentRow, 4).setValue("—").setHorizontalAlignment("center");
    sheet.getRange(currentRow, 5).setFormula(
      `=IF(AND(ISNUMBER(B${currentRow}),ISNUMBER(D${currentRow})),B${currentRow}*D${currentRow},"—")`
    ).setHorizontalAlignment("center").setNumberFormat("$#,##0.00");
    sheet.getRange(currentRow, 6).setValue("Pending").setHorizontalAlignment("center").setFontColor("#aaaaaa");

    if ((currentRow % 2) === 0) {
      sheet.getRange(currentRow, 1, 1, 6).setBackground("#f8f9fa");
    } else {
      sheet.getRange(currentRow, 1, 1, 6).setBackground("#ffffff");
    }
    currentRow++;
  }

  // Grand Total row
  currentRow++;
  sheet.getRange(currentRow, 1, 1, 4).merge();
  sheet.getRange(currentRow, 1).setValue("💰 TOTAL PORTFOLIO VALUE")
    .setFontWeight("bold").setFontSize(12)
    .setBackground("#1a1a2e").setFontColor("#f0f0f0")
    .setHorizontalAlignment("right");
  sheet.getRange(currentRow, 5).setFormula(`=SUMIF(E4:E${currentRow-2},"<>—")`)
    .setFontWeight("bold").setFontSize(12)
    .setBackground("#1a1a2e").setFontColor("#4ecca3")
    .setNumberFormat("$#,##0.00").setHorizontalAlignment("center");
  sheet.getRange(currentRow, 2).setFormula(`=SUMIF(B4:B${currentRow-2},"<>0")`)
    .setFontWeight("bold").setFontSize(12)
    .setBackground("#1a1a2e").setFontColor("#f0f0f0")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(currentRow, 35);
  sheet.setFrozenRows(3);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Sheet rebuilt! Run 'Refresh All Prices' to fetch live prices.",
    "✅ Setup Complete", 5
  );
}

// ─────────────────────────────────────────────
// FETCH EXCHANGE RATE (USD → SGD)
// ─────────────────────────────────────────────
function getUsdToSgd() {
  try {
    const response = UrlFetchApp.fetch("https://open.er-api.com/v6/latest/USD");
    const data = JSON.parse(response.getContentText());
    return data.rates.SGD;
  } catch (e) {
    Logger.log("Exchange rate fetch failed: " + e.message);
    return 1.35; // Fallback rate (update manually if needed)
  }
}
// ─────────────────────────────────────────────
// TEST FUNCTIONS
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// FETCH LOWEST PRICE FROM CSFLOAT
// ─────────────────────────────────────────────
function getCasePrice(marketHashName, usdToSgd) {
  const encodedName = encodeURIComponent(marketHashName);
  const url = `https://csfloat.com/api/v1/listings?market_hash_name=${encodedName}&sort_by=lowest_price&limit=1&type=buy_now`; //specify to use lowest buy now prices rather than auction prices
  const options = {
    method: "GET",
    headers: { "Authorization": CSFLOAT_API_KEY },
    muteHttpExceptions: true,
  };

  // Retry up to 3 times on rate limit
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      const body = response.getContentText();

      if (code === 429) {
        Logger.log(`Rate limited on ${marketHashName}, attempt ${attempt}. Waiting 10s...`);
        Utilities.sleep(10000); // wait 10 seconds before retry
        continue;
      }

      if (code !== 200) {
        return { usd: null, sgd: null, status: `Error ${code}` };
      }

      const data = JSON.parse(body);
      return parsePriceResponse(data, usdToSgd);

    } catch (e) {
      return { usd: null, sgd: null, status: "Fetch error" };
    }
  }

  return { usd: null, sgd: null, status: "Rate limited" };
}

function parsePriceResponse(data, usdToSgd) {
  if (!data || !data.data || data.data.length === 0) {
    return { usd: null, sgd: null, status: "No listings" };
  }
  const priceUsd = data.data[0].price / 100;
  const priceSgd = priceUsd * usdToSgd;
  return { usd: priceUsd, sgd: priceSgd, status: "✅ OK" };
}

// ─────────────────────────────────────────────
// MAIN REFRESH — Updates all prices in sheet
// ─────────────────────────────────────────────
function refreshAllPrices() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet not found. Please run Setup first.');
    return;
  }

  // Get exchange rate first
  const usdToSgd = getUsdToSgd();
  sheet.getRange("B2").setValue(usdToSgd.toFixed(4)).setFontColor("#333333").setFontWeight("normal");

  const lastRow = sheet.getLastRow();
  const nameCol = sheet.getRange(4, 1, lastRow - 3, 1).getValues();

  let currentRow = 4;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < nameCol.length; i++) {
    const cellValue = nameCol[i][0];
    currentRow = i + 4;

    // Skip category header rows (they contain emoji or are empty)
    if (!cellValue || cellValue.toString().startsWith("💰")) {
  continue;
}

    const caseName = cellValue.toString().trim();
    if (!caseName) continue;

    // Fetch price
    const result = getCasePrice(caseName, usdToSgd);

    if (result.usd !== null) {
      sheet.getRange(currentRow, 3).setValue(result.usd).setNumberFormat("$#,##0.00").setHorizontalAlignment("center");
      sheet.getRange(currentRow, 4).setValue(result.sgd).setNumberFormat("$#,##0.00").setHorizontalAlignment("center");
      sheet.getRange(currentRow, 6).setValue(result.status).setFontColor("#2e7d32");
      updated++;
    } else {
      sheet.getRange(currentRow, 3).setValue("N/A").setHorizontalAlignment("center");
      sheet.getRange(currentRow, 4).setValue("N/A").setHorizontalAlignment("center");
      sheet.getRange(currentRow, 6).setValue(result.status).setFontColor("#c62828");
      errors++;
    }

    // Small delay between requests to avoid rate limiting
    Utilities.sleep(5000);
  }

  // Update last refresh timestamp (Singapore time)
  const sgtOffset = 8 * 60 * 60 * 1000;
  const sgtNow = new Date(new Date().getTime() + sgtOffset);
  const timestamp = Utilities.formatDate(sgtNow, "UTC", "dd MMM yyyy, HH:mm") + " SGT";
  sheet.getRange("E2").setValue(timestamp).setFontColor("#333333").setFontWeight("normal");

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Updated ${updated} cases. ${errors > 0 ? errors + " errors (check Status column)." : "All good!"}`,
    "✅ Refresh Complete", 5
  );
}

// ─────────────────────────────────────────────
// TRIGGER SETUP — Run once to schedule daily refresh
// ─────────────────────────────────────────────
function createMidnightSgtTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "refreshAllPrices") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  ScriptApp.newTrigger("refreshAllPrices")
    .timeBased()
    .everyHours(6)
    .create();

  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Price refresh scheduled every 6 hours.",
    "⏰ Trigger Set", 5
  );
}

// ─────────────────────────────────────────────
// MENU — Adds custom menu to the spreadsheet
// ─────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📦 CS2 Tracker")
    .addItem("🔄 Refresh All Prices Now", "refreshAllPrices")
    .addSeparator()
    .addItem("⚙️ Setup Sheet (first time only)", "setupSheet")
    .addItem("⏰ Schedule Daily 6 Hours Refresh", "createMidnightSgtTrigger")
    .addToUi();
}
