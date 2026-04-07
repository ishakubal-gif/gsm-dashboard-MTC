# GSM Network Performance Dashboard

> **Real-time campus GSM signal analytics, infrastructure recommendation, and data management — built with Node.js, Express, Chart.js, and a futuristic dark SaaS UI.**

---

## 📌 Project Overview

This application collects GSM signal readings from campus field observations, stores them in JSON file storage, analyses signal quality with statistical methods, and provides actionable infrastructure recommendations. It is designed as an academic mini-project demonstrating MTC (Mathematics & Telecom Concepts) in a practical, visually impressive web dashboard.

### Key Features

| Feature | Description |
|---------|-------------|
| **Live Dashboard** | Real-time KPIs, 5 analytics charts, intelligent insights |
| **Collection Node** | Mobile-friendly field data entry with RSSI slider, signal meter, and beginner guide |
| **Decision Engine** | Infrastructure recommendation with priority scoring, weak zone ranking, and MTC mapping |
| **Data Terminal** | Admin console with search, filter, select, delete, and multi-format export |
| **Export** | JSON, CSV, and XLSX export of all observations |
| **Storage** | JSON file-based, modular, ready for database upgrade |

---

## 📂 Folder Structure

```
MTC final wala pakka/
├── server.js                 # Express backend (API + static files)
├── package.json              # Dependencies & scripts
├── README.md                 # This file
├── data/
│   └── observations.json     # JSON file storage (auto-created)
├── src/
│   └── storage.js            # Data storage module (CRUD, export, validation)
└── public/
    ├── index.html            # Dashboard (Page 1)
    ├── mobile.html           # Collection Node (Page 2)
    ├── installation.html     # Decision Engine (Page 3)
    ├── admin.html            # Data Terminal (Page 4)
    ├── style.css             # Complete design system
    └── script.js             # Shared utilities (toast, animations, API)
```

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js** 16+ installed
- **npm** (comes with Node)

### Steps

```bash
# 1. Navigate to the project folder
cd "MTC final wala pakka"

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
#    Dashboard:        http://localhost:3000
#    Collection Node:  http://localhost:3000/mobile.html
#    Decision Engine:  http://localhost:3000/installation.html
#    Data Terminal:    http://localhost:3000/admin.html
```

### Same-WiFi Access

Other devices on the same WiFi network can access the dashboard using your machine's local IP:

```
http://<your-local-ip>:3000
```

Find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).

---

## 💾 How JSON Storage Works

All readings are stored in `data/observations.json`:

- On server start, existing data is loaded from this file.
- Every new reading is appended and immediately saved.
- All users share the same data store — readings are visible to everyone.
- The storage module (`src/storage.js`) is designed with a clean interface so it can be swapped for MongoDB, PostgreSQL, etc. without changing the API routes.

### Data Model

Each observation contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `time` | String | Human-readable time (HH:MM) |
| `location` | String | Campus zone name |
| `rssi` | Number | Signal strength (-125 to -40 dBm) |
| `call_success` | String | "Connected" or "Dropped" |
| `quality` | String | "Strong", "Medium", or "Weak" |
| `timestamp` | ISO String | Full ISO 8601 timestamp |

### Signal Quality Thresholds

| Quality | RSSI Range |
|---------|------------|
| **Strong** | ≥ -65 dBm |
| **Medium** | -85 to -65 dBm |
| **Weak** | < -85 dBm |

---

## 📄 How to Use Each Page

### 1. Dashboard (`/`)
- View real-time KPIs and analytics
- See intelligent insights about signal patterns
- Access quick actions (export, delete, navigate)
- Auto-refreshes every 8 seconds

### 2. Collection Node (`/mobile.html`)
- Use the RSSI slider to set signal strength
- Select call result (Connected / Dropped)
- Enter campus location
- Submit reading
- View recent submissions

### 3. Decision Engine (`/installation.html`)
- View the top recommended zone for signal improvement
- See all locations ranked by priority score
- Read the "Why This Location?" explanation
- Study the MTC Concept Mapping section

### 4. Data Terminal (`/admin.html`)
- Search readings by location
- Filter by quality or call result
- Select individual rows or select all
- Delete selected or delete all
- Export data as JSON, CSV, or XLSX

---

## 📤 How to Export Data

Three export formats are available from the Dashboard and Data Terminal:

| Format | URL | Description |
|--------|-----|-------------|
| JSON | `/api/export/json` | Raw JSON array |
| CSV | `/api/export/csv` | Comma-separated values |
| XLSX | `/api/export/xlsx` | Excel workbook |

Click the export buttons or navigate to the URLs directly.

---

## 🗑️ How to Delete Data

- **Delete Selected**: Select rows in the Data Terminal, then click "Delete Selected"
- **Delete All**: Click "Delete All" from the Dashboard or Data Terminal (requires confirmation)

---

## 🌐 Deployment (Render / Railway)

### Steps for Render

1. Push this project to a GitHub repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Deploy

### ⚠️ Known Limitation: File-Based JSON on Free Hosts

> **Important**: Free-tier hosts like Render use **ephemeral file systems**. The `data/observations.json` file will be **reset on every deploy or restart**. For persistent data in production, upgrade to a real database (MongoDB Atlas, PostgreSQL, etc.).
>
> The storage module is designed to make this migration straightforward — just replace `src/storage.js` with a database adapter, keeping the same function signatures.

---

## 🔮 Future Scope

- [ ] **Database integration** — MongoDB Atlas or PostgreSQL for persistent storage
- [ ] **User authentication** — Login system for admins and field operators
- [ ] **Real-time WebSocket** — Live push updates instead of polling
- [ ] **GPS auto-detection** — Automatic location capture from mobile devices
- [ ] **Heat map visualization** — Geographic overlay of signal strength
- [ ] **Historical trend analysis** — Time-series comparison across dates
- [ ] **Multi-campus support** — Separate data stores per campus
- [ ] **PDF report generation** — Downloadable analysis reports

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Frontend | HTML + CSS + Vanilla JavaScript |
| Charts | Chart.js 4.x |
| Storage | JSON file (modular, upgradable) |
| Export | CSV (native) + XLSX (via `xlsx` package) |
| IDs | UUID v4 |

---

## 📝 License

MIT License — Academic research project.
