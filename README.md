# USNA Plebe Summer Prep Tracker

A Progressive Web App for the official USNA 14-Week Plebe Summer Physical Preparation Plan. Mobile-first, works fully offline after first load. No account or backend required — all data lives in your browser.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview   # preview the built app locally
```

---

## Deploying to Netlify

### Option A — Netlify CLI (one command)

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option B — Drag and drop

1. Run `npm run build`
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `/dist` folder onto the deploy zone

### Option C — Git integration

Connect your repo to Netlify and set:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

---

## Installing to iPhone (Add to Home Screen)

1. Open the deployed URL in **Safari** on your iPhone
2. Tap the **Share** button (box with arrow at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

The app will install like a native app — full screen, no browser chrome, with a custom icon. Works offline after the first load.

> **Note:** For iOS, always use Safari. Chrome/Firefox on iOS do not support PWA installation.

---

## Exporting & Importing Data

Your data is stored in `localStorage` under the key `usna_tracker_v1`.

### Export (backup)
1. Open the **OVERVIEW** tab
2. Tap **↓ EXPORT BACKUP (.json)**
3. A `.json` file will download to your device

### Import (restore or transfer to another device)
1. On the new device, open the app and complete onboarding
2. Open the **OVERVIEW** tab
3. Tap **↑ IMPORT BACKUP (.json)**
4. Select the previously exported `.json` file

---

## Features

| Feature | Description |
|---|---|
| **TODAY tab** | Auto-detects your current week/day and shows that workout full-screen |
| **WEEKS tab** | Browse all 14 weeks, drill into any day |
| **OVERVIEW tab** | Stats, streak counter, training heatmap, PRT standards |
| **Inline timers** | Tap the clock icon on any timed step for a countdown timer |
| **Step checkboxes** | Check off individual workout steps as you go |
| **Notes** | Log reps, times, and how you felt on each session |
| **Streak counter** | Tracks consecutive days of completed workouts |
| **PWA / Offline** | Installs to home screen, runs fully offline |
| **Daily reminders** | Optional notification at a time you set |

---

## Workout Plan

The 14-week program is organized into 6 phases:

| Weeks | Phase |
|---|---|
| 1–2 | Foundation |
| 3–4 | Intervals |
| 5–6 | Volume Build |
| 7–9 | Consolidation |
| 10–12 | Intensity Build |
| 13–14 | Peak |

Daily schedule: Mon (Intervals), Tue (Cardio + Strength), Wed (Circuit / Rest), Thu (Threshold Intervals / Sprints), Fri (Cardio + Strength), Sat (Cardio + Sprints / Rest), Sun (Rest).

---

## Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** — utility styling
- **vite-plugin-pwa** — service worker, manifest, offline cache
- **localStorage** — all persistence, no backend

---

*Plan content from the official USNA PE Department 14-Week Plebe Summer Preparation Guide. Do not modify workout data.*
