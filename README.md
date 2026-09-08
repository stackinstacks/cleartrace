# ClearTrace

Surface-level investigative website that uses publicly available information to compile research reports with source attribution and confidence scoring.

**Live site:** https://stackinstacks.github.io/cleartrace/

## Features

- **Identity resolution** — Cross-reference name, location, and baseline demographics
- **Multi-source retrieval** — Query court records, government registries, and social media
- **Confidence scoring** — Rate findings as confirmed, likely, possible, contradictory, or unresolved
- **Source ledger** — Every finding includes retrieval timestamp and source provenance
- **Methodological transparency** — Display limitations and reasoning for each result

## Open-Source Information Paths

### Court Records
- [CourtListener API](https://www.courtlistener.com/api/) — Federal and state court opinions
- [PACER](https://www.pacer.gov/) — Federal court documents and case lookup
- [Google Scholar](https://scholar.google.com/scholar?q=) — Indexed case law

### Government Records
- [SEC EDGAR](https://www.sec.gov/edgar/) — Corporate filings and disclosures
- [Secretary of State Databases](https://www.sos.ca.gov/) — Business entity search (varies by state)
- [FOIA.gov](https://www.foia.gov/) — Freedom of Information Act request portal

### Professional Licensing
- [FCC License Database](https://www.fcc.gov/) — Radio, telecom, and broadcast licenses
- [FSMB Physician Finder](https://www.fsmb.org/) — Medical license lookup
- [State Professional Boards](https://www.fsmb.org/) — Legal, medical, and credential databases

### Social Media & Web
- [NewsAPI](https://newsapi.org/) — Aggregated news article indexing
- [Common Crawl](https://commoncrawl.org/) — Web crawl archives and search
- [Archive.org](https://archive.org/) — Wayback Machine for historical web snapshots
- [Google Search](https://www.google.com/) — Public web indexing

### Public Registries
- [GeoNames](https://www.geonames.org/) — Location and geography data
- [OpenStreetMap](https://www.openstreetmap.org/) — Geographic and address data
- [FDA Databases](https://www.fda.gov/drugs/) — Drug approvals, recalls, and adverse events

## Important Safeguards

### Do's
✓ Verify findings across multiple independent sources  
✓ Display confidence scores and source attribution  
✓ Preserve audit trails and retrieval timestamps  
✓ Separate identity confirmation from behavioral inference  
✓ Include methodology and limitations in reports  

### Don'ts
✗ Do not display home addresses, exact birth dates, or contact details without legal necessity  
✗ Do not infer protected attributes (race, religion, health, political views, etc.)  
✗ Do not equate allegations, arrests, or lawsuits with guilt  
✗ Do not use for discriminatory screening without formal compliance measures  
✗ Do not bypass robots.txt, Terms of Service, or legal rate limits  

### Compliance Notes
- **Background screening:** For employment or regulated use, engage a certified consumer-reporting agency (FCRA-compliant)
- **Data retention:** Delete records after investigation completion unless legally required to retain
- **Access control:** Restrict tool access to authorized personnel with audit logging
- **Right to redress:** Provide mechanisms for subjects to dispute findings and request corrections
- **Legal counsel:** Consult counsel before deploying for commercial or high-stakes use

## Deployment

### GitHub Pages (Static Site)

1. Clone or download this repository
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch`
4. Select `main` branch and `/root` folder
5. Site will be available at `https://YOUR-USERNAME.github.io/cleartrace/`

### Self-Hosted Backend (Optional)

To add a backend API server:

```
POST /api/research
{
  "name": "John Doe",
  "region": "California",
  "city": "San Francisco",
  "sources": ["courtlistener", "news", "professional"]
}
```

Expected response:
```json
{
  "subject": "John Doe",
  "findings": [
    {
      "type": "court_record",
      "source": "CourtListener",
      "description": "Case name, dates, outcome",
      "url": "https://www.courtlistener.com/...",
      "confidence": 0.92,
      "status": "confirmed",
      "retrieved_at": "2026-09-08T12:34:56Z"
    }
  ],
  "summary": {
    "total_findings": 3,
    "confidence_avg": 0.87,
    "risk_level": "low"
  }
}
```

## Development

### Local Testing
```bash
# Open in browser
open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### File Structure
```
cleartrace/
├── index.html          # Frontend (static site)
├── README.md           # This file
└── LICENSE             # MIT (optional)
```

## License

MIT License. See LICENSE file for details.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a description

## Security & Legal Disclaimer

**This tool is educational only.** Users are responsible for:
- Complying with all applicable laws and regulations
- Obtaining proper authorization before accessing records
- Respecting privacy rights and terms of service for all data sources
- Consulting legal counsel for employment or high-stakes screening
- Maintaining audit logs and access controls if deployed commercially

Never use this tool for harassment, stalking, discrimination, or evasion of legal process.

---

For questions or issues, open a GitHub issue on this repository.
