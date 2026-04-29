# Aura Intelligence Suite

**Aura Intelligence** is a high-leverage executive decision-support system designed for strategic analysis, market monitoring, and automated insight generation. Built for leaders who require data-driven clarity at scale.

---

## Core Strategic Modules

- **Executive Overview**: A high-density dashboard featuring real-time KPIs, market trends, and asset tracking.
- **Aura AI Intelligence**: A strategic chat interface powered by Gemini 1.5 Flash for deep financial and operational analysis.
- **Strategic Scan (Smart Alerts)**: Proactive monitoring system that identifies risks (like churn or revenue dips) and generates mitigation strategies.
- **What-If Simulator**: Scenario planning tool for forecasting the impact of macro and micro economic shifts.
- **Aura Voice**: Hands-free intelligence access for real-time strategic updates via voice commands.
- **The War Room**: Real-time collaborative environment for synchronized executive decision-making.

 <img width="1363" height="675" alt="Screenshot 2026-04-29 151601" src="https://github.com/user-attachments/assets/cb663868-1ecb-4898-ba0b-027c44ffff44" />

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4.0
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts & D3

### Backend (The Kernel)
- **Runtime**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3`) for persistent, low-latency relational storage.
- **Real-time**: WebSockets (`ws`) for collaborative state synchronization.
- **AI Engine**: Google Gemini API (`@google/generative-ai`).

---

## Security & Production Integrity

Aura is built with a "Production-First" mindset, including:
- **Rate Limiting**: Protection against API abuse via `express-rate-limit`.
- **Security Headers**: Hardened with `helmet` for CSP and header protection.
- **Input Validation**: Strict schema enforcement using `zod` for all intelligence and strategic endpoints.
- **File Ingestion**: Memorystream-based file processing with MIME-type filtering and size limits.
- **Graceful Shutdown**: SIGTERM/SIGINT listeners ensure database and socket closures without data corruption.

---

## API Specification

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System integrity check |
| `/api/intelligence/chat` | `POST` | AI reasoning and insight generation |
| `/api/alerts/generate` | `POST` | Trigger strategic risk scan |
| `/api/ingest` | `POST` | Secure document knowledge ingestion |
| `/api/market/data` | `GET` | Real-time asset performance metrics |

---

## License

Proprietary Intelligence Platform. All Rights Reserved.

## 👨‍💻 Author
OLADEINDE FRANKLYN OLUWAKOMIYO
