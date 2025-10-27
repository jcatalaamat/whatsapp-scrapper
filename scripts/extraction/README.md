# AI Entity Extraction Scripts

These scripts use Claude AI to extract structured entities (events, places, services) from WhatsApp messages.

## Quick Start

### Run a Sample Extraction (30 messages)
```bash
yarn extract:sample
```
Output: `data/outputs/samples/latest/`

### Run Full Extraction (all messages)
```bash
yarn extract:full
```
Output: `data/outputs/full/`

### Clean Outputs
```bash
yarn extract:clean
```

## Scripts

### `extract-entities-ai-sample.js`
- Processes first 30 messages
- Fast testing (~10 seconds)
- Good for validating extraction quality
- Output: `data/outputs/samples/latest/`

### `extract-entities-ai.js`
- Processes ALL messages with text content
- Batched processing (20 messages/batch)
- Progress tracking & resumable
- Rate limiting to avoid API limits
- Output: `data/outputs/full/`

## Configuration

Both scripts use environment variables from `.env`:
- `ANTHROPIC_KEY` - Your Anthropic API key

Edit the `CONFIG` object in each script to adjust:
- `SAMPLE_SIZE` - Number of messages to process (sample only)
- `BATCH_SIZE` - Messages per API call
- `RATE_LIMIT_DELAY` - Milliseconds between batches
- `MIN_MESSAGE_LENGTH` - Skip messages shorter than N characters

## Output Structure

Each run creates 3 JSON files:

### `events.json`
```json
[{
  "id": "uuid",
  "title": "Event name",
  "description": "...",
  "date": "2025-10-27",
  "time": "17:30:00",
  "location_name": "Venue name",
  "category": "workshop",
  "price": "100 MXN",
  "contact_whatsapp": "+52...",
  "original_message_id": "local_..."
}]
```

### `places.json`
```json
[{
  "id": "uuid",
  "name": "Place name",
  "type": "restaurant",
  "description": "...",
  "location_name": "Address",
  "tags": ["beach", "cafe"],
  "contact_whatsapp": "+52...",
  "original_message_id": "local_..."
}]
```

### `services.json`
```json
[{
  "id": "uuid",
  "title": "Service name",
  "description": "...",
  "category": "wellness",
  "price_type": "hourly",
  "price_amount": 500,
  "price_currency": "MXN",
  "contact_whatsapp": "+52...",
  "original_message_id": "local_..."
}]
```

## Folder Structure

```
data/
├── outputs/
│   ├── full/              # Full extraction results
│   │   ├── events.json
│   │   ├── places.json
│   │   ├── services.json
│   │   └── progress.json  # Resume capability
│   └── samples/
│       ├── latest/        # Latest sample run
│       └── run-1/         # Previous runs (manual backup)
```

## Tips

1. **Test first**: Always run `yarn extract:sample` before full extraction
2. **Review quality**: Check sample output before processing all messages
3. **Backup runs**: Copy `data/outputs/samples/latest/` to `run-N/` before re-running
4. **Resume support**: Full extraction can be resumed if interrupted (uses progress.json)
5. **Cost estimation**: Sample = ~$0.02, Full (~110 msgs) = ~$0.50 with Claude 4.5 Haiku

## Next Steps

After extraction, use the generated JSON to:
1. Generate SQL INSERT statements
2. Review and validate data quality
3. Import to Supabase database
