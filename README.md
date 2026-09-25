# ACSC // Cyber Awareness Quiz

Booth-friendly cybersecurity quiz for ACSC's university orientation.
React + TypeScript + Tailwind, CRT/SOC terminal aesthetic.
Scores live on a **Cloudflare Worker** (server side), the app deploys to **GitHub Pages**,
and the terminal is **locked behind a shared booth key**.

## Architecture

```
GitHub Pages (static app)  ──HTTPS──▶  Cloudflare Worker (leaderboard API + KV)
        │                                    │
   locked by X-Booth-Key              BOOTH_KEY secret (authorizes every call)
```

The booth key is entered once on the booth laptop, remembered on that device,
and can be cleared with the **■ LOCK TERMINAL** button. Note: a key shipped in
client JS can be extracted by a determined user — it deters casual abuse and can
be rotated, but it is a booth gate, not banking-grade security.

## 1. Deploy the API (Cloudflare Worker, free tier)

```bash
cd worker
npx wrangler login
npx wrangler kv namespace create LEADERBOARD      # copy the returned id
# paste the id into wrangler.toml (kv_namespaces → id)
npx wrangler secret put BOOTH_KEY                 # choose your shared booth key
npx wrangler deploy
```

Wrangler prints the worker URL, e.g.
`https://acsc-cyber-quiz-api.<account>.workers.dev`.

## 2. Point the app at the API

Create `.env.production` in the project root:

```
VITE_API_URL=https://acsc-cyber-quiz-api.<account>.workers.dev/leaderboard
```

Then optionally lock CORS in `worker/wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGIN = "https://<you>.github.io"
```

and redeploy the worker (`npx wrangler deploy`).

## 3. Deploy the app (GitHub Pages)

```bash
npm install
npm run deploy      # builds dist/ and pushes it to the gh-pages branch
```

In the GitHub repo: **Settings → Pages → Source: Deploy from branch → gh-pages / root**.
The site goes live at `https://<you>.github.io/<repo>/` (relative `base: './'`
means the same build works for project pages and custom domains).

## Local development

```bash
npm install
npm run dev         # http://localhost:3000 (set VITE_API_URL in .env.development to test against a local API)
```

## API contract (worker/api.js)

| Method | Path | Effect |
| --- | --- | --- |
| GET | `/leaderboard` | top 10 |
| POST | `/leaderboard` | save entry (same codename replaces previous), returns board |
| DELETE | `/leaderboard?ts=N` | remove one entry, returns board |
| DELETE | `/leaderboard` | wipe board |

Every request needs header `X-Booth-Key: <BOOTH_KEY>`.
