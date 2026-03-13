# 📦 CS2 Case Price Tracker

A Google Sheets + Google Apps Script tool that automatically tracks CS2 case prices from CSFloat, displays your portfolio value in SGD, and sends Discord alerts when prices spike or drop.

![CS2 Case Price Tracker](https://github.com/Lolfreak/cs2-case-price-tracker/blob/fefa02b4e90d3727e839184207725289cc2a7bad/readmepictures/cs2casetrackergooglesheetview.png)

---

## Features

- **Live price tracking** - fetches the lowest buy-now listing for every CS2 case from the CSFloat API
- **SGD conversion** - automatically converts USD prices to SGD using a live exchange rate
- **Portfolio calculator** - enter your quantities and see your total portfolio value instantly
- **Discord price alerts** - pings your Discord role when any case moves 10%+ up or down
- **Scheduled auto-refresh** - prices update automatically every 6 hours
- **44 cases tracked** - covers all active, armory and discontinued cases sorted from newest to oldest

---

## Prerequisites

- A Google account (for Google Sheets + Apps Script)
- A [CSFloat](https://csfloat.com) account with an API key (free)
- A Discord server with a webhook set up

---

## Setup Guide

### Step 1 - Get your CSFloat API Key
1. Log in to [csfloat.com](https://csfloat.com)
2. Go to your **Profile → Developer** tab
3. Generate a new API key and copy it
![csfloatapikey](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/developersettings.png)

### Step 2 - Set up the Google Sheet
1. Create a new **Google Sheet**
2. Click **Extensions → Apps Script**
![AppScripts](https://github.com/Lolfreak/cs2-case-price-tracker/blob/46374d9e40c9abc1b7d4c8e77ed3bd3f5888bb3f/readmepictures/appscripts.png)
4. Delete the default code and paste the entire contents of `Code.gs`
5. On line 7, replace `"YOUR_API_KEY_HERE"` with your CSFloat API key:
   ```js
   const CSFLOAT_API_KEY = "your-api-key-here";
   ```
   ![CSFLOATAPIKEY](https://github.com/Lolfreak/cs2-case-price-tracker/blob/46374d9e40c9abc1b7d4c8e77ed3bd3f5888bb3f/readmepictures/csfloatapikey.png)
6. Click **Save** (💾)

### Step 3 - Set up Discord Webhook
1. In your Discord server, right-click the channel you want alerts in
2. Go to **Edit Channel → Integrations → Webhooks → New Webhook**
4. Give it a name and profile picture, then click **Copy Webhook URL**
![DiscordWebHook](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/discordwebhookcreation.png)
5. In the script, replace `"YOUR_WEBHOOK_URL_HERE"`:
   ```js
   const DISCORD_WEBHOOK_URL = "your-webhook-url-here";
   ```
   ![WebhookURL](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/discordwebhookurl.png)

### Step 4 - Set up Discord Role Ping
1. In Discord, go to **Server Settings → Roles**
2. Right-click your role → **Copy Role ID** (requires Developer Mode)
3. In the script, update the content field in `sendDiscordAlert`:
   ```js
   content: "<@YOUR_ROLE_ID_HERE>",
   ```
   ![RoleID](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/discordrole.png)
### Step 5 - Build the Sheet
1. Go back to your Google Sheet and **refresh the page**
2. A **📦 CS2 Tracker** menu will appear in the top bar
![CS2TrackerExtension](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/cs2casetrackerextension.png)
4. Click **📦 CS2 Tracker → ⚙️ Setup Sheet (first time only)**
5. Approve the permissions popup when prompted

### Step 6 - Fetch Live Prices
1. Click **📦 CS2 Tracker → 🔄 Refresh All Prices Now**
2. Wait ~5 minutes for all 44 cases to populate

### Step 7 - Schedule Automatic Refresh
1. Click **📦 CS2 Tracker → ⏰ Schedule Daily Midnight Refresh**
   - This schedules a refresh every 6 hours automatically

### Step 8 — Set Up Price Alerts
1. Click **📦 CS2 Tracker → 📸 Save Price Snapshot** — saves today's prices as the baseline
2. Click **📦 CS2 Tracker → ⏰ Schedule Automatic Alert Checks** — checks every 2 hours
3. Optionally click **📦 CS2 Tracker → 🔔 Check Price Alerts Now** to test immediately
![FirstSetup](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/cs2casetrackeroptions.png)

---

## How to Use

- **Enter your quantities** in **Column B** next to each case
- **Column C** shows the latest price in USD
- **Column D** shows the latest price in SGD
- **Column E** auto-calculates your total value per case (Qty × SGD Price)
- The **Grand Total** row at the bottom shows your full portfolio value

---

## How Price Alerts Work

1. When you click **Save Price Snapshot**, the current prices are saved as a baseline
2. Every 2 hours, the script fetches fresh prices and compares them to the baseline
3. If any case moves **10% or more** up or down, a Discord alert is sent
4. The snapshot is updated after every check so alerts reflect recent changes

## Example Discord Alert

![DiscordAlert](https://github.com/Lolfreak/cs2-case-price-tracker/blob/06af6a428ba7ab901011739b84bc1f71e7713b2f/readmepictures/discordalert.png)

---

## Configuration

You can adjust these constants at the top of `cs2casetracker.gs`:

| Constant | Default | Description |
|---|---|---|
| `CSFLOAT_API_KEY` | `"YOUR_API_KEY_HERE"` | Your CSFloat API key |
| `DISCORD_WEBHOOK_URL` | `"YOUR_WEBHOOK_URL_HERE"` | Your Discord webhook URL |
| `ROLE_ID` | `<@YOUR_ROLE_ID_HERE>` | Your Discord Role ID |
| `ALERT_THRESHOLD` | `0.10` | Price change % to trigger alert (0.10 = 10%) |
| `SHEET_NAME` | `"CS2 Case Price Tracker"` | Name of the Google Sheet tab |

---

## Cases Tracked

All 44 CS2 cases sorted from newest to oldest:

| # | Case |
|---|---|
| 1 | Sealed Dead Hand Terminal |
| 2 | Sealed Genesis Terminal |
| 3 | Fever Case |
| 4 | Gallery Case |
| 5 | Kilowatt Case |
| 6 | Revolution Case |
| 7 | Recoil Case |
| 8 | Dreams & Nightmares Case |
| 9 | Operation Riptide Case |
| 10 | Snakebite Case |
| 11 | Operation Broken Fang Case |
| 12 | Fracture Case |
| 13 | Prisma 2 Case |
| 14 | Shattered Web Case |
| 15 | CS20 Case |
| 16 | Prisma Case |
| 17 | Danger Zone Case |
| 18 | Horizon Case |
| 19 | Clutch Case |
| 20 | Spectrum 2 Case |
| 21 | Operation Hydra Case |
| 22 | Spectrum Case |
| 23 | Glove Case |
| 24 | Gamma 2 Case |
| 25 | Gamma Case |
| 26 | Chroma 3 Case |
| 27 | Operation Wildfire Case |
| 28 | Revolver Case |
| 29 | Shadow Case |
| 30 | Falchion Case |
| 31 | Chroma 2 Case |
| 32 | Chroma Case |
| 33 | Operation Vanguard Weapon Case |
| 34 | Huntsman Weapon Case |
| 35 | eSports 2014 Summer Case |
| 36 | Operation Breakout Weapon Case |
| 37 | Operation Phoenix Weapon Case |
| 38 | CS:GO Weapon Case 3 |
| 39 | eSports 2013 Winter Case |
| 40 | Winter Offensive Weapon Case |
| 41 | CS:GO Weapon Case 2 |
| 42 | Operation Bravo Case |
| 43 | eSports 2013 Case |
| 44 | CS:GO Weapon Case |

---

## Important Notes

- **Prices are in USD on CSFloat** - the script converts to SGD automatically using a live exchange rate
- **Rate limiting** - the script adds a 5 second delay between API calls to avoid hitting CSFloat's rate limit
- **API key security** - never share your CSFloat API key or Discord webhook URL publicly
- **Apps Script quotas** - the free Google Apps Script tier allows up to 6 minutes of execution per day, which is sufficient for this project

---

## Tech Stack

- **Google Sheets** - data display and portfolio tracking
- **Google Apps Script** - backend logic, API calls, scheduling
- **CSFloat API** - live CS2 case price data
- **open.er-api.com** - live USD to SGD exchange rate
- **Discord Webhooks** - price spike notifications

---

## License

MIT License - feel free to fork and modify for your own use.
