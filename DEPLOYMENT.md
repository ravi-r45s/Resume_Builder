# ResumeForge production deployment

## Architecture
- Frontend: Vercel (Vite/React)
- Backend: Render (Node/Express)
- Database: MongoDB Atlas

## 1. MongoDB Atlas
Create a database user and allow the deployed backend to connect. Put the Atlas connection string in Render as `MONGO_URI`. Do not commit it.

## 2. Backend on Render
Create a Web Service from this repository, with root directory `server`, build command `npm install`, and start command `npm start`. Render supplies `PORT`; the server binds to `0.0.0.0`.

Set these environment variables in Render:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URLS=https://YOUR-FRONTEND-DOMAIN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## 3. Frontend on Vercel
Import the repository and set the project root to `client`. Build command: `npm run build`. Output directory: `dist`. Add:
- `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

The included `vercel.json` keeps React Router routes working on refresh.

## 4. Production checklist
- Use a long random `JWT_SECRET`.
- Use a strong unique admin password.
- Never upload `server/.env`.
- Set `CLIENT_URLS` to the real frontend URL; do not use `*`.
- In MongoDB Atlas, create a least-privilege database user and configure network access for the backend.
- After deployment, verify `/api/health`, register a test user, approve it from the admin panel, create a resume, and download a PDF.
