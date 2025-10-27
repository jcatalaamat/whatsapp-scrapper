# Project Organization

## Folder Structure

```
whatsapp-scrapper/
├── scripts/
│   └── extraction/              # AI entity extraction scripts
│       ├── extract-entities-ai.js          # Full extraction (all messages)
│       ├── extract-entities-ai-sample.js   # Sample extraction (30 messages)
│       ├── extract-entities.js             # Legacy script
│       ├── extract_entities.py             # Python version
│       └── README.md                       # Extraction docs
│
├── data/
│   ├── messages_YYYYMMDD_HHMMSS.json      # Source WhatsApp messages
│   └── outputs/
│       ├── full/                          # Full extraction results
│       │   ├── events.json
│       │   ├── places.json
│       │   ├── services.json
│       │   └── progress.json
│       └── samples/                       # Sample extraction results
│           ├── latest/                    # Most recent sample
│           └── run-N/                     # Archived samples
│
├── docs/
│   └── reference/                         # Reference documentation
│       ├── tables-structure.md            # Database schema
│       └── query-table-structure.sql      # SQL schema queries
│
├── src/                                   # Main WhatsApp scraper code
│   ├── index.js                           # Main entry point
│   ├── wizard.js                          # Interactive setup
│   └── ...
│
└── migrations/                            # Database migrations
```

## Quick Commands

### Extraction
```bash
yarn extract:sample   # Test on 30 messages
yarn extract:full     # Process all messages
yarn extract:clean    # Clean outputs
```

### WhatsApp Scraping
```bash
yarn wizard           # Interactive setup
yarn start            # Start scraper
yarn backfill         # Fetch historical messages
```

### Database
```bash
yarn migrate:up       # Run migrations
yarn test:db          # Test DB connection
```

## Output Files

All extraction outputs go to `data/outputs/`:
- **`full/`** - Complete extraction results (resumable)
- **`samples/latest/`** - Quick test runs (30 messages)

Each extraction creates:
- `events.json` - Event entities
- `places.json` - Place entities  
- `services.json` - Service entities
- `progress.json` - Resume tracking (full only)

## Workflow

1. **Scrape messages**: `yarn backfill` or `yarn start`
2. **Test extraction**: `yarn extract:sample`
3. **Review quality**: Check `data/outputs/samples/latest/`
4. **Full extraction**: `yarn extract:full`
5. **Generate SQL**: (next step - TBD)
6. **Import to DB**: (next step - TBD)
