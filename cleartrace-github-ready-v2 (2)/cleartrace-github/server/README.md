# ClearTrace server

Node/Express backend for the ClearTrace research pipeline.

## Intensive public-record search

Set the frontend search depth to **Intensive public-records search**. The pipeline expands the authorized public-records adapter into separate searches for:

- criminal court
- civil court
- bankruptcy
- professional licensing
- business entities
- regulatory enforcement
- public contracts
- campaign finance
- property tax
- judgments/liens

The adapter sends `record_type` on each request. Your organization's provider must support these categories; unsupported categories should return an empty result or an explicit provider error.

CourtListener is also queried separately for opinions and RECAP/docket records. A returned name match is always a candidate record, not an identity confirmation.

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

The server listens on `http://localhost:8787` by default.

## Security

Keep API credentials server-side. Use a secret manager in production, restrict CORS with `FRONTEND_ORIGIN`, apply authentication/rate limits before exposing the API publicly, and retain only the minimum data necessary. Do not use this system to make automated high-impact decisions or infer sensitive traits.
