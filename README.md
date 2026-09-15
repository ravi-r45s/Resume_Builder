# ResumeForge — MERN Resume Builder

A complete MERN-stack resume builder: register/login, create multiple resumes, fill them in with a live preview, switch between three templates, see a resume-completeness score, and export a print-ready PDF.

## Project structure

```
ResumeForge-MERN/
├── server/     Express + MongoDB API (JWT auth, resume CRUD)
└── client/     React (Vite) frontend
```

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env      # then edit .env with your own values
npm run dev                # starts on http://localhost:5000
```

`.env` values:

| Key | Description |
|---|---|
| `PORT` | Port the API runs on (default 5000) |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Any long random string, used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, for CORS (default `http://localhost:5173`) |

You need a running MongoDB instance — either install MongoDB locally, run it via Docker (`docker run -d -p 27017:27017 mongo`), or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGO_URI`.

### API endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account |
| POST | `/api/auth/login` | – | Log in |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/resumes` | ✓ | List your resumes |
| POST | `/api/resumes` | ✓ | Create a resume |
| GET | `/api/resumes/:id` | ✓ | Get one resume |
| PUT | `/api/resumes/:id` | ✓ | Update a resume |
| DELETE | `/api/resumes/:id` | ✓ | Delete a resume |
| POST | `/api/resumes/:id/duplicate` | ✓ | Duplicate a resume |

## 2. Frontend setup

```bash
cd client
npm install
npm run dev                # starts on http://localhost:5173
```

Optional: create `client/.env` with `VITE_API_URL=http://localhost:5000/api` if your API runs somewhere other than the default.

## 3. Using the app

1. Open `http://localhost:5173`, create an account.
2. From the dashboard, create a new resume (or duplicate/delete existing ones).
3. In the editor, fill in personal details, summary, education, experience, projects, skills and certifications — the panel on the right updates live.
4. Switch between the Classic, Modern and Minimal templates.
5. Watch the resume score in the top of the form — it reflects how complete the resume is.
6. Click **Download PDF** — this opens the browser's print dialog with only the resume sheet visible; choose "Save as PDF" as the destination.

Everything autosaves ~0.7s after you stop typing (you'll see "Saving…" then "All changes saved" in the editor bar).

## Notes for going to production

- Set a strong, random `JWT_SECRET`.
- Point `MONGO_URI` at a managed database (e.g. MongoDB Atlas) rather than a local instance.
- Set `CLIENT_URL` to your deployed frontend's URL so CORS allows it.
- Set `VITE_API_URL` in the client build to your deployed API URL.
- Consider adding rate limiting on `/api/auth/*` before exposing this publicly.

## Admin access control

ResumeForge now supports admin-controlled builder access.

### Default local admin

The server creates/updates the configured admin account when it starts. The included local `.env` uses:

- Email: `admin@resumeforge.local`
- Password: `ChangeMe_Admin_123!`

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` in `server/.env` before using this outside local development.

### How it works

1. A new user can register normally, but their builder access starts as **Pending**.
2. The user can log in and will see a waiting-for-approval screen.
3. The admin logs in through the normal login page using the admin credentials.
4. The admin is taken to **Admin panel**.
5. The admin can **Grant access** or **Revoke access** for each registered user.
6. Once access is granted, that user can use the normal dashboard, create/edit/duplicate/delete resumes, and download PDFs.
7. Builder API routes are protected on the server, so changing the frontend alone cannot bypass approval.
