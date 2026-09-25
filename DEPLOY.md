# Deploy Runbook — ACSC Cyber Quiz

The repo is committed and ready. Two external services are needed, each
requiring **your** login: GitHub (hosting) and Cloudflare (leaderboard API).
Everything else is already configured in this repo.

Estimated total time: ~15 minutes.

---

## Step 1 — GitHub repo (2 min)

Option A — GitHub CLI:

```bash
# install gh once: https://cli.github.com  then:
gh auth login
gh repo create acsc-cyber-quiz --public --source . --push
```

Option B — github.com: create a new **public** repository named `acsc-cyber-quiz`
(do NOT add a README), then:

```bash
git remote add origin https://github.com/<you>/acsc-cyber-quiz.git
git push -u origin main
```

## Step 2 — Cloudflare Worker (5 min)

```bash
cd worker
npx wrangler login                              # browser auth, one time
npx wrangler kv namespace create LEADERBOARD    # copy the id it prints
# paste the id into wrangler.toml  (kv_namespaces → id = "...")
npx wrangler secret put BOOTH_KEY               # paste the booth key
npx wrangler deploy                             # prints the worker URL
```

Then copy the worker URL (e.g. `https://acsc-cyber-quiz-api.x.workers.dev`)
into `.env.production` in the project root:

```
VITE_API_URL=https://acsc-cyber-quiz-api.<account>.workers.dev/leaderboard
```

Optionally lock CORS to your Pages URL in `worker/wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGIN = "https://<you>.github.io"
```

and run `npx wrangler deploy` again.

## Step 3 — Publish GitHub Pages (2 min)

```bash
npm install
npm run deploy        # builds with .env.production and pushes dist/ to gh-pages branch
gh api repos/<you>/acsc-cyber-quiz/pages -X POST \
  -F "source[branch]=gh-pages" -F "source[path]=/"
```

(or: repo → Settings → Pages → Deploy from branch → gh-pages / root)

Site goes live at: `https://<you>.github.io/acsc-cyber-quiz/`

## Step 4 — Booth day

1. Open the site, enter the booth key on the key gate → the laptop remembers it.
2. **■ LOCK TERMINAL** at the end of the day clears the key.

To rotate the key later: `cd worker && npx wrangler secret put BOOTH_KEY`,
then re-enter it on the booth laptop (LOCK TERMINAL first).
