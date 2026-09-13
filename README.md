# Difaac (Cybersecurity & Threat Defense Platform)

Difaac is a modern cybersecurity and digital threat protection platform featuring automated threat intelligence, attack surface management, digital risk protection, email security, and fraud prevention.

## 🚀 Architecture

- **Frontend**: Built with [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS v4](https://tailwindcss.com/).
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) REST API with JWT authentication and tenant isolation.
- **Database**: PostgreSQL with Row-Level Security (RLS).

---

## 🌐 Deploying Frontend on Netlify (Free Hosting)

The frontend is ready for 1-click deployment on [Netlify](https://www.netlify.com/):

### Option 1: Git-Connected Deploy (Continuous Deployment)
1. In Netlify Dashboard, click **Add new site** → **Import an existing project** → **GitHub**.
2. Select repository `farahabdishakur/Difaac`.
3. Netlify automatically detects `netlify.toml` with:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy Difaac**.

### Option 2: Netlify Drag & Drop
1. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag & drop the `frontend/dist` directory.

---

## 🛠 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
See [DEPLOY.md](./DEPLOY.md) and [RENDER.md](./RENDER.md) for full server and database setup.
