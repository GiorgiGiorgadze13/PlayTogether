# PlayTogether

**PlayTogether** is a full-stack web application for discovering and booking sports venues in Tbilisi, Georgia. It lets registered users find football pitches, basketball courts, tennis courts, padel arenas, and more; book time slots; join open games; manage subscriptions (PlayPass); and organise tournaments — all in English or Georgian.

🔗 **GitHub Repository:** https://github.com/GiorgiGiorgadze13/PlayTogether

---

## ✨ Main Features

| Feature | Description |
|---|---|
| 🏟️ Stadium Booking | Browse 13+ venues, filter by sport, and book time slots |
| 🎮 Find a Game | Discover and join upcoming open games |
| 👥 Find Players | Connect with other athletes by sport and skill level |
| 🏆 Tournaments | Browse and register for local tournaments |
| 🥊 Learn | Sports learning cards and certified instructor profiles |
| 🎫 PlayPass | Monthly subscription plans (Silver / Gold / Unlimited) |
| 🔐 Auth | JWT-based registration, login, and protected routes |
| 🌐 Bilingual | Full English / Georgian (ქართული) language switching |
| 🛡️ Admin Panel | Manage stadiums, games, and users |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| React Router | 7 |
| Vanilla CSS | — |

### Backend
| Technology | Version |
|---|---|
| Node.js | 18+ |
| Express | 4 |
| Prisma ORM | 6 |
| SQLite | (dev database) |
| JSON Web Tokens | 9 |
| bcryptjs | 3 |
| Zod | 3 |
| TypeScript | 5 |

---

## 📁 Project Structure

```
PlayTogether/
├── index.html              # HTML entry point (SEO meta, OG tags)
├── vite.config.ts          # Vite build config (code splitting)
├── src/
│   ├── App.tsx             # Root component — routing + providers
│   ├── index.css           # Global styles / design system
│   ├── Components/         # Shared UI components
│   ├── pages/              # Route-level page components
│   ├── context/            # React context (Auth, Language, Subscription)
│   ├── constants/          # Static data (instructors, sports, translations)
│   ├── services/           # API client (api.ts)
│   └── types/              # Shared TypeScript types
└── backend/
    ├── src/
    │   ├── server.ts       # Entry point
    │   ├── app.ts          # Express app setup
    │   ├── routes/         # API routes
    │   ├── controllers/    # Request handlers
    │   ├── services/       # Business logic
    │   ├── middleware/     # Auth middleware, error handling
    │   └── lib/            # Prisma client singleton
    └── prisma/
        ├── schema.prisma   # Database schema
        └── seed.ts         # Database seed script
```

---

## ⚙️ Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/GiorgiGiorgadze13/PlayTogether.git
cd PlayTogether
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

---

## 🔧 Environment Variables

### Frontend (root `.env`)

Copy the example file and adjust if needed:

```bash
copy .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

### Backend (`backend/.env`)

```bash
copy backend\.env.example backend\.env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | SQLite path, e.g. `file:./dev.db` |
| `PORT` | ✅ | Port for the API server (default `5000`) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `JWT_SECRET` | ✅ | **Long, random secret string — change this!** |
| `JWT_EXPIRES_IN` | ✅ | Token lifetime, e.g. `7d` |
| `CORS_ORIGIN` | ✅ | Frontend URL, e.g. `http://localhost:5173` |
| `GOOGLE_PLACES_API_KEY` | optional | Enables real venue photos from Google Places |

> ⚠️ **Never commit real values** to Git. Both `.env` files are listed in `.gitignore`.

---

## 🗄️ Database Setup

```bash
cd backend

# Run migrations on a fresh SQLite database
npm run prisma:migrate

# (Optional) Seed the database with sample stadiums and a demo admin user
npm run prisma:seed
```

Prisma stores the database at `backend/prisma/dev.db` (ignored by Git).  
The schema lives at `backend/prisma/schema.prisma` and is always tracked.

---

## ▶️ Running Locally

Open **two terminals**:

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend**

```bash
npm run dev
# App running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Production Build

```bash
# Build the frontend
npm run build

# Preview the production build locally
npm run preview
```

The optimised output is written to `dist/`. The project is configured for Vercel deployment with `vercel.json` (SPA rewrites).

---

## 🧹 Lint

```bash
npm run lint
```

The project uses [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (configured in `.oxlintrc.json`).

---

## 👥 Team

<!-- Add team member names here -->
_Team members TBD — update this section with actual names._

---

## 📄 License

This project was created as an academic assignment. All rights reserved.
