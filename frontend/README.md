# ResumeIQ — Frontend

React + Vite + Tailwind CSS v4

## Setup

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**

## Features

- **Auth** — Register / Login / Logout with persistent token
- **Drag & Drop** — Drop a PDF directly onto the upload zone
- **Analysis Dashboard** — Side-by-side input + results layout
- **Score Rings** — Animated SVG rings for ATS, Skill Match, Text Similarity
- **Tabbed Results** — Overview | Skills | Gaps | Tips
- **History** — View and delete past analyses
- **Responsive** — Works on mobile, tablet, and desktop

## Project Structure

```
frontend/src/
├── App.jsx                    # Root with auth gating
├── index.css                  # Global styles + Tailwind
├── main.jsx                   # Entry point
├── context/
│   └── AuthContext.jsx        # Global auth state + authFetch()
├── pages/
│   ├── AuthPage.jsx           # Login / Register
│   └── Dashboard.jsx          # Main app page
└── components/
    ├── Navbar.jsx             # Sticky nav with user menu
    ├── UploadSection.jsx      # File + JD input
    ├── ResultsPanel.jsx       # Tabbed analysis results
    └── HistoryPanel.jsx       # Past analyses list
```

## Environment

The API base URL is `http://127.0.0.1:5000/api` — set in `AuthContext.jsx`.
For production, change `const API = "..."` to your deployed backend URL.
