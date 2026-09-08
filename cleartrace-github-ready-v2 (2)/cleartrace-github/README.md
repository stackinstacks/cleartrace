# ClearTrace — Investigation made easy

ClearTrace is a modern prototype for surface-level investigative research and due diligence using lawful, publicly available information. It emphasizes source provenance, corroboration, uncertainty, and human review.

## What is included

- `site/` — GitHub Pages-ready frontend
- `server/` — Node/Express server-side research pipeline scaffold
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment on pushes to `main`

## Important architecture note

GitHub Pages hosts the static frontend. API credentials and authorized data-source calls belong on the server, never in browser JavaScript. Deploy `server/` separately (Render, Railway, Fly.io, Cloud Run, or another HTTPS Node host) and configure the frontend API base URL for that deployment.

The server adapters are intentionally gated around authorized APIs and provider configuration. Do not add scraping, private-account access, credential collection, or bypasses of platform controls.

## GitHub Pages setup

1. Create a new GitHub repository, e.g. `cleartrace`.
2. Upload this project and push the `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. The included workflow deploys `site/` automatically whenever `main` changes.

GitHub will provide the Pages URL after the workflow succeeds.

## Local frontend

Open `site/index.html` directly for the static demo, or serve the folder with any static HTTP server.

## Local server

```bash
cd server
npm install
cp .env.example .env
npm start
```

Do not commit `.env` or real credentials.

## Production safeguards

ClearTrace should not be used as the sole basis for employment, housing, credit, insurance, education, or other regulated/high-impact decisions. A name match, arrest, allegation, lawsuit, or public profile match is not proof of identity, wrongdoing, or guilt.

For regulated background screening, use an appropriate compliant screening provider and follow applicable notice, consent, accuracy, dispute, retention, and other legal requirements.

## Intensive public-record search

ClearTrace now supports an **Intensive public-records search** mode. When configured, the server separately queries the authorized public-records provider for criminal court, civil court, bankruptcy, professional licensing, business entities, regulatory enforcement, public contracts, campaign finance, property-tax, and judgment/lien records. CourtListener is also queried for legal opinions and RECAP/docket records.

The project intentionally treats every hit as a **candidate record** requiring identity verification. It does not infer guilt, expose unnecessary sensitive personal information, or automate employment, housing, credit, insurance, education, or other high-impact decisions.
