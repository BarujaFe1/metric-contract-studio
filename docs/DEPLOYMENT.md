# Deployment — Metric Contract Studio

## Production URL

https://metric-contract-studio.vercel.app

## Prerequisites

- Node.js 20+
- Vercel account (or any Node host that can build Next.js)
- GitHub repo connected (optional but recommended for CI/CD)

## Environment

Copy `.env.example` → `.env.local` if desired. **No secrets are required** for the MVP.

```bash
NEXT_PUBLIC_APP_NAME=Metric Contract Studio
NEXT_PUBLIC_APP_ENV=local
```

## Local

```bash
npm install
npm run dev
# http://localhost:3000
```

## Quality gate before deploy

```bash
npm run quality
```

## Vercel

1. Import `BarujaFe1/metric-contract-studio`
2. Framework preset: Next.js
3. Build command: `npm run build`
4. Output: Next.js default
5. Deploy production → alias `metric-contract-studio.vercel.app`

GitHub pushes to `main` trigger production redeploys when the project is linked.

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Runs on push/PR: `npm ci` → lint → typecheck → test → build.

## Notes

- Client-only demo: no serverless DB/auth configuration needed.
- Do not commit `.env.local` or `.vercel/`.
