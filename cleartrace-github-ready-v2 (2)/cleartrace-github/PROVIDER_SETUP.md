# ClearTrace Provider Setup Guide

Complete instructions for configuring all API providers for the full server research pipeline.

## Quick Start

```bash
cd server
cp .env.example .env
# Fill in credentials below
npm install
npm start
```

Server runs on `http://localhost:8787`

---

## Provider Configuration

### 1. CourtListener (Court Records)

**What it provides:** Federal & state court opinions, RECAP docket records

**Setup:**
1. Visit https://www.courtlistener.com/api/
2. Click "Sign up for a free account"
3. Navigate to your API tokens page
4. Generate a new token
5. Copy and paste into `.env`:
   ```
   COURTLISTENER_API_TOKEN=your_token_here
   ```

**Endpoint:** `https://www.courtlistener.com/api/rest/v3/search/`

**Cost:** FREE (limited) to paid plans

**Rate limits:** 60 requests/minute (free tier)

**Notes:**
- Supports opinions (`type=o`) and RECAP records (`type=r`)
- No authentication required for basic searches, but token increases limits
- Used by `server/src/providers/courtlistener.js`

---

### 2. Authorized Public Records Provider

**What it provides:** Criminal court, civil court, bankruptcy, professional licensing, business entities, regulatory enforcement, public contracts, campaign finance, property tax, judgment/liens

**Choose your provider:**

#### Option A: LexisNexis Risk Solutions
- **URL:** https://risk.lexisnexis.com/
- **Requires:** Business account + API credentials
- **Setup:**
  ```
  PUBLIC_RECORDS_API_URL=https://api.lexisnexis.com/public-records/search
  PUBLIC_RECORDS_API_TOKEN=your_api_key
  ```

#### Option B: Thomson Reuters (Westlaw)
- **URL:** https://legal.thomsonreuters.com/
- **Requires:** Law firm account + subscriptions
- **Setup:**
  ```
  PUBLIC_RECORDS_API_URL=https://api.westlaw.com/search
  PUBLIC_RECORDS_API_TOKEN=your_key
  ```

#### Option C: CourtListener (for court records subset)
- Use same token as above for criminal/civil court categories
- **Setup:**
  ```
  PUBLIC_RECORDS_API_URL=https://www.courtlistener.com/api/rest/v3/search/
  PUBLIC_RECORDS_API_TOKEN=your_courtlistener_token
  ```

**Cost:** $500–$10,000+/year depending on volume

**Notes:**
- Adapter sends `record_type` parameter for each category
- Must support: `criminal_court`, `civil_court`, `bankruptcy`, `professional_license`, `business_entity`, `regulatory_enforcement`, `public_contracts`, `campaign_finance`, `property_tax`, `judgment_lien`
- Used by `server/src/providers/public-records.js`

---

### 3. X (Twitter) API

**What it provides:** Public user profiles and posts matching search queries

**Setup:**
1. Go to https://developer.twitter.com/
2. Sign in or create a developer account
3. Create an app (or use existing)
4. Request **Elevated access** tier (required for v2 search endpoints)
5. Go to **Keys and tokens** → **Bearer Token**
6. Copy and paste into `.env`:
   ```
   X_BEARER_TOKEN=your_bearer_token_here
   ```

**Endpoint:** `https://api.x.com/2/users/search`

**Cost:** FREE (basic tier with limits) to $100+/month for higher volume

**Rate limits:** 300 requests/15 minutes (elevated access)

**Requirements:**
- Verified developer account
- Elevated or Pro access tier
- Phone number verification

**Notes:**
- Only searches public profiles
- Returns basic user data (name, username, bio, follower count)
- Used by `server/src/providers/x.js`

---

### 4. LinkedIn API

**What it provides:** Professional profiles matching search criteria

**Setup:**
1. Go to https://www.linkedin.com/developers/
2. Create an app
3. Request **Profile Lookup** or **Recruiter/Search** access (requires approval)
4. LinkedIn will provide:
   - Access token
   - Search endpoint URL
5. Configure in `.env`:
   ```
   LINKEDIN_ACCESS_TOKEN=your_access_token
   LINKEDIN_SEARCH_URL=https://api.linkedin.com/rest/search/
   ```

**Endpoint:** Varies (LinkedIn provides custom URL after approval)

**Cost:** FREE (limited sandbox) to $500+/year for production

**Requirements:**
- LinkedIn Developer account (free)
- App approval (typically 1–2 weeks)
- Legal entity verification

**Notes:**
- LinkedIn API access is restricted; approval required
- Standard access limited to 100 searches/month
- High compliance bar for background-screening use
- Used by `server/src/providers/linkedin.js`

---

### 5. Meta Graph API (Instagram & Facebook)

**What it provides:** Business/professional Instagram and Facebook profiles

**Setup:**
1. Go to https://developers.facebook.com/
2. Create an app (Business type)
3. Add **Instagram Basic Display** product
4. Set up OAuth and get access token:
   - Generate long-lived token (60 days)
5. Configure in `.env`:
   ```
   META_ACCESS_TOKEN=your_access_token
   META_APP_ID=your_app_id
   META_APP_SECRET=your_secret
   META_IG_SEARCH_URL=https://graph.instagram.com/v18.0/ig_hashtag_search
   ```

**Endpoint:** `https://graph.instagram.com/v18.0/`

**Cost:** FREE (limited) to $200+/year for advanced features

**Rate limits:** 200 calls/hour (standard tier)

**Requirements:**
- Facebook Business account
- Verified business
- App review approval

**Notes:**
- Limited to hashtag and business profile search
- Cannot directly search personal accounts
- Used by `server/src/providers/meta.js`

---

### 6. NewsAPI (Optional)

**What it provides:** Aggregated news articles mentioning the search subject

**Setup:**
1. Go to https://newsapi.org/
2. Sign up for free account
3. Copy your API key
4. Configure in `.env`:
   ```
   NEWSAPI_KEY=your_api_key
   ```

**Endpoint:** `https://newsapi.org/v2/everything`

**Cost:** FREE (100 requests/day) to $449+/year

**Rate limits:** 100 requests/day (free), 250/day (developer plan)

**Notes:**
- No adapter implemented yet; can be added to `server/src/providers/news.js`
- Searches news across 80+ sources

---

## Testing Your Configuration

### 1. Start the server
```bash
npm start
# Server listening on port 8787
```

### 2. Check health endpoint
```bash
curl http://localhost:8787/api/health
# {"ok":true,"service":"cleartrace-server"}
```

### 3. Run a research query
```bash
curl -X POST http://localhost:8787/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "region": "California",
    "city": "San Francisco",
    "depth": "intensive",
    "scope": "all"
  }'
```

**Expected response:**
```json
{
  "subject": {
    "name": "John Doe",
    "city": "San Francisco",
    "region": "California"
  },
  "search": {
    "depth": "intensive",
    "scope": "all",
    "providers": ["x", "linkedin", "instagram", "court_records", "public_records"]
  },
  "summary": {
    "total_candidates": 23,
    "by_category": {
      "Opinions / legal decisions": 2,
      "criminal_court": 1,
      "social": 20
    }
  },
  "candidates": [
    {
      "source": "CourtListener",
      "category": "Opinions / legal decisions",
      "title": "Case name here",
      "confidence": 0.92,
      "retrieved_at": "2026-09-08T..."
    }
  ],
  "generated_at": "2026-09-08T...",
  "review_required": true
}
```

### 4. Test frontend connection

Edit `site/config.js`:
```javascript
window.CLEARTRACE_API_BASE = 'http://localhost:8787';
```

Open `site/index.html` in browser → enter a name → click "Generate report"

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Provider returned HTTP 401` | Check API token is correct and not expired |
| `Provider returned HTTP 429` | Rate limit exceeded; wait or upgrade tier |
| `Provider returned HTTP 400` | Invalid query format; check endpoint URL |
| Empty results | Provider may require additional setup/approval |
| Server won't start | Check `PORT` not in use; verify `npm install` completed |

---

## Production Deployment

### Environment Variables
On your hosting platform (Render, Railway, Fly.io):

1. Set all `.env` variables in secrets/environment section
2. Ensure `FRONTEND_ORIGIN` matches your GitHub Pages URL:
   ```
   FRONTEND_ORIGIN=https://stackinstacks.github.io
   ```
3. Never commit `.env` to version control

### Rate Limiting & Compliance
```javascript
// server/src/server.js (add)
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many searches, please try again later'
});

app.use('/api/research', limiter);
```

### Audit Logging
```javascript
app.post('/api/research', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} searched: ${req.body.name}`);
  // Could also write to database or logging service
  next();
});
```

---

## Legal & Compliance Notes

- **Terms of Service:** Each provider has terms; ensure compliance (e.g., no scraping beyond API)
- **FCRA:** For employment screening, use certified screening provider
- **GDPR/CCPA:** Respect privacy laws; provide data deletion & opt-out mechanisms
- **Rate Limits:** Respect provider rate limits; don't bypass them
- **Disclosure:** Inform users which sources are queried

---

## Next Steps

1. ✅ Fill in `.env` with API credentials
2. ✅ Test each provider locally
3. ✅ Deploy server to production (Render/Railway/Fly.io)
4. ✅ Update `site/config.js` with backend URL
5. ✅ Test frontend → backend connection
6. ✅ Add rate limiting & audit logging
7. ✅ Review compliance requirements for your use case

---

For questions or issues, open a GitHub issue.
