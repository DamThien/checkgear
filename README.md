# CheckGearVN

CheckGearVN is a **monorepo project** that contains both a **backend (Node.js / Express)** and a **frontend (React + Vite)**.
The project is managed using **pnpm workspaces**, allowing both applications to be developed and run independently or together with a single command.

---

## 📁 Project Structure

```
checkgearvn/
│
├── backend/                # Backend service (Node.js / Express)
│   ├── src/
│   │   ├── crawlers/       # Crawling jobs / scripts
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Controllers / business logic
│   │   ├── jobs/           # Background jobs / schedulers
│   │   └── app.js          # Backend entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # Frontend app (React + Vite)
│   ├── src/
│   │   ├── pages/          # Pages / views
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── package.json             # Root scripts (run backend + frontend)
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* dotenv
* cors
* nodemon (development)

### Frontend

* React
* Vite
* JavaScript (ES6+)

### Tooling

* pnpm (workspaces)
* concurrently

---

## 🚀 Prerequisites

Make sure you have the following installed:

* **Node.js** >= 18
* **pnpm** (recommended)

Install pnpm globally if needed:

```bash
npm install -g pnpm
```

---

## 📦 Installation

From the **project root**:

```bash
pnpm install
```

This will install dependencies for both `backend` and `frontend` using pnpm workspaces.

---

## ▶️ Running the Project

### Run both backend & frontend together

```bash
pnpm dev
```

This will start:

* Backend: `http://localhost:3001`
* Frontend: `http://localhost:5173`

---

### Run backend only

```bash
cd backend
pnpm dev
```

---

### Run frontend only

```bash
cd frontend
pnpm dev
```

---

## 🔗 API Communication

The frontend communicates with the backend via REST APIs.

Example API base URL:

```js
http://localhost:3001/api
```

You can configure this inside `frontend/src/services`.

---

## 🔐 Environment Variables

Backend environment variables are defined in:

```
backend/.env
```

Example:

```env
PORT=3001
DATABASE_URL=your_database_url
```

⚠️ Do not commit `.env` files. Use `.env.example` as a reference.

---

## 🧹 Git Ignore

The following files and folders are ignored:

```gitignore
**/node_modules
**/.env
pnpm-lock.yaml
```

---

## 🧠 Notes

* Backend and frontend are **completely independent modules**.
* Each app has its own `package.json` and `node_modules`.
* The root project only orchestrates development scripts.

---

## 📌 Future Improvements

* Docker & docker-compose support
* Shared types / utilities package
* CI/CD pipeline
* Production build & deployment setup

---

## 👨‍💻 Author

Developed by **Thien Dam**.

---

Happy coding 🚀
