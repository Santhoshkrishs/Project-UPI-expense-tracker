# Setup Guide — UPI Expense Tracker

Complete step-by-step instructions to get the tracker running with live Google Sheets sync.

---

## Prerequisites

- A Google account (for Google Sheets + Apps Script)
- A GitHub account (to host the web app for free)
- Your bank statement downloaded as PDF or CSV

---

## Part 1 — Host the Web App on GitHub Pages

### Step 1: Fork the repository

1. Go to `https://github.com/YOUR-USERNAME/upi-expense-tracker`
2. Click **Fork** in the top-right corner
3. Leave all settings as default → click **Create fork**

### Step 2: Enable GitHub Pages

1. In your forked repo, click **Settings** (top menu)
2. In the left sidebar, click **Pages**
3. Under "Source", select **Deploy from a branch**
4. Branch: `main` · Folder: `/ (root)` → click **Save**
5. Wait ~60 seconds, then visit: `https://YOUR-USERNAME.github.io/upi-expense-tracker`

Your web app is now live! 🎉

---

## Part 2 — Set Up Google Sheets

### Step 3: Create a new Google Sheet

1. Go to [sheets.new](https://sheets.new) — this creates a blank sheet
2. Name it something like **"UPI Expense Tracker"** (click the title at the top)

### Step 4: Open Apps Script

1. In your Google Sheet, click **Extensions** in the menu bar
2. Click **Apps Script**
3. A new browser tab opens with the script editor

### Step 5: Add the bridge script

1. In the Apps Script editor, you'll see a default function — **select all and delete it**
2. Open the file `scripts/Code.gs` from this repository
3. Copy the entire contents
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) or press `Ctrl+S`

### Step 6: Deploy as a Web App

1. Click **Deploy** (top-right) → **New deployment**
2. Click the **gear icon ⚙️** next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description:** `UPI Parser Bridge` (or anything you like)
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. A popup asks you to **Authorize access** → click **Authorize**
7. Choose your Google account → click **Allow**
8. You'll see a **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
9. **Copy this URL** — you'll need it in the next step

> ⚠️ Keep this URL private — anyone with it can write to your sheet. Treat it like a password.

---

## Part 3 — Connect the Web App to Google Sheets

### Step 7: Paste the URL in the web app

1. Open your GitHub Pages site
2. Find the **"Connect Google Sheets"** box at the top
3. Paste the Web App URL you copied in Step 6
4. Click **Test**
5. You should see: ✅ **"Connected — UPI Parser bridge is live!"**

The URL is saved in your browser automatically — you only need to do this once.

---

## Part 4 — Using the Tracker

### Step 8: Download your bank statement

Download your statement as **CSV** if possible (easier than PDF):

| Bank | Where to download |
|------|------------------|
| SBI | NetBanking → My Accounts → Account Statement → CSV |
| HDFC | NetBanking → Accounts → Account Statement → Download |
| ICICI | iMobile or NetBanking → Statements → CSV |
| Axis | NetBanking → Accounts → e-Statement → CSV |
| Kotak | NetBanking → Account → Statement → Download |

### Step 9: Parse your statement

1. Drag and drop the file onto the upload zone, or click to browse
2. Transactions appear in the table automatically
3. Review the **Category** column — change any incorrect ones using the dropdown
4. Check the **category breakdown** at the bottom for a summary

### Step 10: Sync to Google Sheets

1. Click **Sync to Google Sheets**
2. Choose a sync mode:
   - **Append** (recommended): adds new rows, skips duplicates
   - **Replace**: deletes existing rows for these months, then inserts fresh data
3. Click **Sync now**
4. Open your Google Sheet — transactions appear instantly in the **Transaction Log** tab

---

## Re-deploying After Code Changes

If you ever edit `Code.gs`, you must create a **new deployment** (not edit the existing one):

1. Apps Script → **Deploy → New deployment**
2. Use the same settings as before
3. Copy the new URL and update it in the web app

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Could not reach script" | Make sure "Who has access" is set to **Anyone** in deployment settings |
| No transactions detected | Try downloading as CSV instead of PDF |
| Wrong categories | Edit the category dropdown per row before syncing |
| Duplicate rows in sheet | Use **Append** mode — it deduplicates automatically |
| PDF not parsing | Some bank PDFs have scanned images instead of text — use CSV export instead |

---

## Updating the App

When this repository gets updates:

1. Go to your fork on GitHub
2. Click **Sync fork** → **Update branch**
3. GitHub Pages redeploys automatically within ~60 seconds
