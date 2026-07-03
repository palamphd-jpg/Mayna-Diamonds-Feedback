# 💎 Mayna Diamonds — Feedback Collection Form

A modern, elegant feedback collection form for **Mayna Diamonds**, a premium jewelry store in Salem, Tamil Nadu.

Built with **Next.js 15** (App Router), **Tailwind CSS v4**, and **Google Sheets** as the backend database via Google Apps Script.

---

## 🏗️ Architecture

```
Browser (Customer)
    │
    ▼
┌──────────────────────┐
│   Next.js Frontend   │  ← Hosted on Vercel
│   /api/feedback      │  ← Vercel Serverless Function
└──────────┬───────────┘
           │  POST (JSON)
           ▼
┌──────────────────────┐
│  Google Apps Script   │  ← Web App (doPost)
│  (Web App URL)       │
└──────────┬───────────┘
           │  appendRow()
           ▼
┌──────────────────────┐
│    Google Sheet       │  ← Your "database"
│  (Feedback entries)   │
└──────────────────────┘
```

- The **frontend** never sees the Google Script URL — it only talks to `/api/feedback`.
- The **API route** validates input and proxies the request to Google Apps Script.
- The **Apps Script** appends a row to your Google Sheet.

---

## 📋 Setup Guide

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **"Mayna Diamonds Feedback"**.
3. In **Row 1**, add these headers:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Timestamp | Name | Phone | Category | Rating | Comments |

4. Save the sheet. Keep it open — you'll need it for the next step.

---

### Step 2: Deploy the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. Delete any existing code in the editor.
3. Copy the entire contents of [`google-apps-script.js`](./google-apps-script.js) and paste it into the editor.
4. Click **💾 Save** (or Ctrl+S).
5. Click **Deploy → New deployment**.
6. Click the ⚙️ gear icon next to "Select type" and choose **Web app**.
7. Configure:
   - **Description**: `Mayna Feedback API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
8. Click **Deploy**.
9. If prompted, click **Authorize access** and follow the Google OAuth flow.
10. **Copy the Web App URL** — it will look like:
    ```
    https://script.google.com/macros/s/AKfycb.../exec
    ```

> ⚠️ **Important**: Every time you update the script, you must create a **New deployment** (not just save) for changes to take effect.

---

### Step 3: Set Up Environment Variables

#### For Local Development

Create a `.env.local` file in the `mayna-feedback/` directory:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace the URL with the one you copied in Step 2.

#### For Vercel Deployment

1. Go to your Vercel project dashboard.
2. Navigate to **Settings → Environment Variables**.
3. Add a new variable:
   - **Key**: `GOOGLE_SCRIPT_URL`
   - **Value**: Your Google Apps Script Web App URL
   - **Environments**: Select `Production`, `Preview`, and `Development`
4. Click **Save**.

---

### Step 4: Run Locally

```bash
cd mayna-feedback
npm install    # if not already done
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the form.

---

### Step 5: Deploy to Vercel

#### Option A: Git-based Deploy (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import your repository.
4. Set the **Root Directory** to `mayna-feedback` (if it's in a subdirectory).
5. Vercel will auto-detect Next.js — no build settings needed.
6. Make sure your environment variable (`GOOGLE_SCRIPT_URL`) is set (Step 3).
7. Click **Deploy**.

#### Option B: CLI Deploy

```bash
npm i -g vercel
cd mayna-feedback
vercel --prod
```

---

## 🎨 Features

- ✅ Responsive, mobile-first design
- ✅ Interactive 5-star rating with hover effects
- ✅ Client-side form validation
- ✅ Server-side validation in API route
- ✅ Loading spinner on submit
- ✅ Success animation after submission
- ✅ Google Sheets as a simple, free database
- ✅ Environment variable security (Script URL hidden from client)

---

## 📁 Project Structure

```
mayna-feedback/
├── src/
│   └── app/
│       ├── api/
│       │   └── feedback/
│       │       └── route.ts        # Vercel serverless API
│       ├── globals.css             # Tailwind + brand styles
│       ├── layout.tsx              # Root layout with fonts & SEO
│       └── page.tsx                # Feedback form UI
├── google-apps-script.js           # Paste into Google Apps Script
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|---|---|
| Form submits but no data in Sheet | Check that `GOOGLE_SCRIPT_URL` is set correctly in `.env.local` or Vercel |
| Google Script returns 401/403 | Re-deploy the script with "Who has access: Anyone" |
| CORS errors in browser | This shouldn't happen — the API route proxies the request server-side |
| "Server configuration error" | The `GOOGLE_SCRIPT_URL` env var is missing |

---

## 📄 License

Private — Mayna Diamonds © 2026
