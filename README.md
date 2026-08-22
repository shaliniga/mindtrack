# MindTrack — Mental Wellness & Burnout Analytics Platform

MindTrack is a comprehensive mental wellness tracking platform designed to help organizations monitor employee wellness, identify early burnout trends, and manage team wellness metrics. By providing role-based portals for Employees, Managers, and HR Admins, the platform balances individual confidentiality with organizational oversight.

<img width="1366" height="698" alt="image" src="https://github.com/user-attachments/assets/eabb1922-5d7d-46f0-b7be-b68fde170f32" />

# Live demo
https://mindtrack-03h8.onrender.com

---

## 🚀 Portals & Features

### 👤 1. Employee Portal
* **Daily Wellness Check-in:** Log overall mood score, stress level, energy rating, sleep hours, sleep quality, and private reflection notes.
* **Smart Pre-filling:** Form automatically pre-populates today's entries if updating check-ins.
* **History Dashboard:** Interactively filter logs by 7-day and 30-day aggregates alongside Recharts trend indexes.
* **Personal Profile:** Edit personal info and update passwords.

<img width="1343" height="685" alt="image" src="https://github.com/user-attachments/assets/9fe8a0be-52c9-49b6-9705-3ce1aa6012d7" />
<img width="1366" height="672" alt="image" src="https://github.com/user-attachments/assets/f2807af1-9f00-4338-9b0c-350875fbab41" />
<img width="1366" height="677" alt="image" src="https://github.com/user-attachments/assets/ea224d2e-83ff-4ad6-8603-ebd55904243b" />
<img width="1366" height="685" alt="image" src="https://github.com/user-attachments/assets/471e4070-4072-4b60-8e6a-792b19438207" />

### 👥 2. Manager Portal
* **Team Roster:** List direct reports linked during employee registration.
* **Real-time Team KPIs:** Average team mood, distinct check-in percentages, and active team alert counts.
* **Automated Alerting Engine:** Real-time alert feed tracking critical mood drops or acute stress spikes with "Mark as Resolved" and "Dismiss" actions.
* **Direct Report Deep-Dive:** Click into any employee profile to examine their metrics graph and historical logs.
<img width="1366" height="684" alt="image" src="https://github.com/user-attachments/assets/56512907-fcc8-457e-8c75-110d84f612e6" />
<img width="1366" height="669" alt="image" src="https://github.com/user-attachments/assets/cbae2f3d-e5b5-4e9d-ad34-20fbcbe25141" />

### 🔑 3. HR Admin Portal
* **Organization Analytics:** Comparative line and bar charts tracking check-in rate participation percentages, reported stress, and department breakdowns.
* **User Account Directory:** Complete control over provisioning new users, deactivating/activating accounts, and updating user roles.
* **Audit Logging:** System-wide logs tracking critical user account mutations and credential events.
<img width="1366" height="678" alt="image" src="https://github.com/user-attachments/assets/dba3a873-0a1d-4a63-9f0e-ae654bb823da" />
<img width="1364" height="671" alt="image" src="https://github.com/user-attachments/assets/7a253e4f-2204-4b58-b4db-ec8ff74dc36e" />
<img width="1366" height="683" alt="image" src="https://github.com/user-attachments/assets/c7f921c0-2053-4db2-badd-b96d3d639cf0" />
<img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/a0375cce-d3b6-4c7d-9241-31e6b1f1fc34" />

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, TypeScript, Vite
* **State & Query Management:** `@tanstack/react-query` (React Query), Zustand (with session persistence)
* **Styling:** TailwindCSS (Light theme layout)
* **Forms & Validation:** `react-hook-form` + `@hookform/resolvers` + Zod
* **Charts:** Recharts (Area, Line, and Bar charts)

### Backend
* **Core:** Node.js, Express, TypeScript, `tsx` (development execution)
* **Database & ORM:** PostgreSQL (hosted via Supabase) + Drizzle ORM
* **Authentication:** JWT (JSON Web Tokens) with role-based middleware guards
* **Validation:** Zod schemas
* **Documentation:** Swagger/OpenAPI documentation (`/docs`)

---
## ⚙️ Environment Variables Reference

### Backend (`/backend/.env`)
Create a `.env` file inside the `backend` folder with the following variables:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db_name>?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

> [!NOTE]
> If your Postgres server uses self-signed SSL certificates (e.g. Supabase connection under local Windows node environments), you can run the backend server with `NODE_TLS_REJECT_UNAUTHORIZED="0"` to bypass certificate check warnings.

---

## 💻 Local Setup Steps

### 1. Clone and Navigate
Clone the repository and open the project in your workspace.

### 2. Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (refer to the Env Var Reference above).
4. Run Drizzle migrations to push schemas to the database:
   ```bash
   # Use SSL bypass if your db environment demands it
   $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run db:migrate
   ```
5. Start the backend developer server:
   ```bash
   $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run dev
   ```
   * *Backend server will run at: http://localhost:3000*
   * *Swagger API Docs will be available at: http://localhost:3000/docs*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * *Frontend application will run at: http://localhost:5173*

---

## 🔒 Security & RBAC Specs
* Roles: `employee`, `manager`, `admin`
* Private logs: reflection text notes are kept confidential on the database layer and are strictly never shown to managers or HR admins. Only aggregated numbers are exposed for organizational analytics.
