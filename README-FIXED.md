# ResumeForge MERN — Fixed

This version keeps the original UI/design and fixes the authentication race condition that could send the user back to the empty Login page immediately after clicking Log in.

## Run

### Server
cd server
npm install
npm run dev

### Client
cd client
npm install
npm run dev

Open http://localhost:5173

The server `.env` is retained from the supplied project. If MongoDB is not running locally, start MongoDB first or change `MONGO_URI` in `server/.env`.


## 20 Resume Templates
The editor now includes 20 selectable resume templates: Classic, Modern, Minimal, Executive, Elegant, Creative, Tech, ATS Pro, Academic, Compact, Bold, Corporate, Swiss, Editorial, Startup, Timeline, Profile, Mono, Fresh, and Luxe. All templates use the same resume data and save through the existing resume API.

- Certificate entries now support a clickable verification/link URL; the certificate name and “View certificate” open the link in a new tab.
