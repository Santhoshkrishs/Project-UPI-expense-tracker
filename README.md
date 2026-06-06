# 💰 UPI Expense Tracker

> Parse Indian bank statements (PDF/CSV), auto-categorise transactions, and sync to Google Sheets — entirely in your browser.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://santhoshkrishs.github.io/Project-UPI-expense-tracker/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/deployed%20via-GitHub%20Pages-orange?style=flat-square)](https://pages.github.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Banks](#supported-banks)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Google Sheets Integration](#google-sheets-integration)
- [Local Development](#local-development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

UPI Expense Tracker is a **zero-backend, privacy-first** web application that helps you make sense of your UPI spending. Upload your bank statement, and the app extracts every transaction, classifies it into one of 12 expense categories, and pushes the result straight into your own Google Sheet — no servers, no data storage, no ads.

**Why this project?**
Most expense-tracking apps either require connecting your bank account (privacy risk) or charge a subscription. This tool does the heavy lifting client-side: your data never leaves your device except to your own Google Sheet.

---

## Features

| Feature | Details |
|---|---|
| 📂 **Multi-format upload** | Accepts PDF and CSV bank statements from any major Indian bank |
| 🤖 **Auto-categorisation** | Classifies transactions into 12 categories (Housing, Food, Transport, Utilities, Health, and more) |
| 📊 **Google Sheets sync** | One-click push with built-in deduplication — re-syncing never creates duplicates |
| ⬇️ **Export** | Download filtered transactions as CSV or copy directly into any spreadsheet |
| 🔒 **100% private** | All parsing runs in-browser via JavaScript; only your Google Sheet receives data |
| 🌙 **Responsive UI** | Dark mode, mobile-friendly layout |

---

## Supported Banks

| Bank | Format |
|---|---|
| State Bank of India (SBI) | PDF, CSV |
| HDFC Bank | PDF, CSV |
| ICICI Bank | CSV |
| Axis Bank | CSV |
| Kotak Mahindra Bank | CSV |
| Canara Bank | CSV |
| Bank of Baroda | CSV |
| BHIM / Generic UPI | Standard CSV export |

> **Don't see your bank?** If it exports a standard CSV with date, description, and amount columns, it will work. Open an issue to request a specific parser.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                  │
│                                                     │
│  ┌────────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  index.html │──▶│ PDF / CSV    │──▶│ Category  │  │
│  │  (UI layer)│   │ Parser (JS)  │   │ Engine    │  │
│  └────────────┘   └──────────────┘   └─────┬─────┘  │
│                                            │        │
└────────────────────────────────────────────┼────────┘
                                             │ HTTPS POST
                                             ▼
                              ┌──────────────────────────┐
                              │   Google Apps Script     │
                              │   (Code.gs — Web App)    │
                              └────────────┬─────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────┐
                              │       Google Sheets      │
                              │  Transaction Log │ Dashboard │ Budget │
                              └──────────────────────────┘
```

**Key design decisions:**
- **No backend server** — eliminates hosting costs, attack surface, and data-breach risk.
- **Google Apps Script as a lightweight API** — users deploy their own instance, so they own the endpoint and the data.
- **Single HTML file** — works offline after first load; no build step needed for end users.

---

## Project Structure

```
upi-expense-tracker/
├── index.html              # Entire web app — UI, parser, sync logic
├── scripts/
│   └── Code.gs             # Google Apps Script — paste into your Sheet
├── docs/
│   └── setup-guide.md      # Step-by-step Google Sheets setup
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD — auto-deploys to GitHub Pages on push to main
├── LICENSE
└── README.md
```

---

## Quick Start

### Prerequisites

- A Google account (for the Sheets integration)
- A bank statement in PDF or CSV format

### 1. Deploy Your Own Instance (Recommended)

Fork the repo and enable GitHub Pages so you have a personal, always-on URL:

1. Click **Fork** (top-right of this page)
2. In your fork → **Settings → Pages**
3. Set Source to **Deploy from a branch** → `main` → `/ (root)` → **Save**
4. Your instance is live at `https://<your-username>.github.io/Project-UPI-expense-tracker/`

### 2. Or Just Use the Live Demo

[https://santhoshkrishs.github.io/Project-UPI-expense-tracker/](https://santhoshkrishs.github.io/Project-UPI-expense-tracker/)

No setup required to try the parser and CSV export. Google Sheets sync requires Step 3 below.

---

## Google Sheets Integration

This is a one-time, ~5-minute setup. Full walkthrough in [docs/setup-guide.md](docs/setup-guide.md).

**Short version:**

1. Create a new Google Sheet
2. Open **Extensions → Apps Script**
3. Paste the contents of [`scripts/Code.gs`](scripts/Code.gs) and save
4. Click **Deploy → New deployment** → type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorise and copy the generated **Web App URL**
6. Paste the URL into the **"Connect Google Sheets"** field on the site

### Google Sheet Layout

After syncing, your sheet will have three tabs:

| Tab | Contents |
|---|---|
| **Transaction Log** | Every transaction — date, description, amount, category, month |
| **Dashboard** | Auto-updated category totals and month-wise spend summary |
| **Budget** | (Optional) Add monthly budget targets for comparison |

---

## Getting Your Bank Statement

| Bank | Path |
|---|---|
| **SBI** | NetBanking → My Accounts → Account Statement → Download CSV |
| **HDFC** | NetBanking → Accounts → Account Statement → Download |
| **ICICI** | iMobile / NetBanking → Statements → Download CSV |
| **Axis** | NetBanking → Accounts → e-Statement → CSV |
| **Kotak** | NetBanking → Account → Statement → Download |
| **BHIM / UPI apps** | App → Passbook or Transaction History → Download / Export |

---

## Local Development

No build tools or package manager required — the app is a single HTML file.

```bash
# Clone the repo
git clone https://github.com/Santhoshkrishs/Project-UPI-expense-tracker.git
cd Project-UPI-expense-tracker

# Serve locally (pick any option)
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser. Changes to `index.html` are reflected on refresh.

**To modify the Apps Script backend**, edit `scripts/Code.gs`, then re-deploy from the Apps Script editor.

---

## Roadmap

| Status | Item |
|---|---|
| 🔜 | Additional bank parsers (Yes Bank, IndusInd, Federal Bank) |
| 🔜 | Budget vs actuals comparison chart in Google Sheets |
| 🔜 | SMS / bank alert transaction parser |
| 🔜 | Sub-category support (e.g. Food → Groceries, Dining Out) |
| 🔜 | Dark / light mode toggle in-app |
| 💡 | Multi-account aggregation |
| 💡 | Monthly spend summary via email (Apps Script trigger) |

---

## Contributing

Contributions are welcome. Here's the fastest path:

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/Project-UPI-expense-tracker.git

# 2. Create a branch
git checkout -b feat/your-feature-name

# 3. Make changes and test locally

# 4. Push and open a PR against main
```

**Good first issues:** bank parser support, UI improvements, CSV edge cases.

Please open an issue before starting significant work so we can align on approach.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.
