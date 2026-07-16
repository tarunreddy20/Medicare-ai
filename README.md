# Virtual Health Assistant — Frontend

Simple React frontend for a Virtual Health Assistant chat UI.

Quick start

1. Install dependencies

```bash
cd health-assistant-frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

Backend configuration

1. Create a `.env` file in the project root.
2. Set your running LLM backend URL:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

If your backend runs from your home folder on a different port, set that URL instead.

Notes
- The frontend sends POST requests to `${VITE_API_BASE_URL}/api/chat`.
- Request payload: `{ message, specialty }`.
- Expected response: `{ reply: "..." }`.
- Uses Vite + React 18 + Axios. No CSS frameworks.
