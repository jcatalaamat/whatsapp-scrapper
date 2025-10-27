# Google Places API Scraper for Mazunte

## What This Script Does

Fetches **real-time data** from Google Maps for all landmarks, restaurants, shops, yoga studios, hotels, and services in Mazunte using the official Google Places API.

## Results

**249 unique places** scraped with:
- ✅ Real verified coordinates (lat/long)
- ✅ Phone numbers
- ✅ Websites
- ✅ Opening hours
- ✅ Ratings & review counts
- ✅ Addresses
- ✅ Google Maps URLs
- ✅ Price levels

## Output Files

Located in `data/outputs/`:
- `Mazunte_Landmarks_Google_API.csv` - Spreadsheet format (92 KB)
- `Mazunte_Landmarks_Google_API.json` - JSON format (160 KB)

## Categories Included

- 20 Restaurants
- 20 Cafes
- 20 Yoga Studios
- 19 Tourist Attractions
- 18 Hotels & Hostels
- 15 Bars
- 14 Surf Shops
- 12 Beaches
- 11 Organic Shops
- 8 Massage & Spa
- 7 Laundries
- 7 Bakeries
- And more...

## How to Run Again

```bash
# Activate virtual environment
source venv/bin/activate

# Run the scraper
python3 scripts/scrape-mazunte-google.py
```

## API Key

The Google Maps API key is stored in `.env`:
```
GOOGLE_MAPS_API_KEY=AIzaSyCMYc7fiueWRxmHHerrICw4iCgEobmmQL4
```

## Cost

Google Places API pricing:
- First $200/month: **FREE**
- After that: ~$7 per 1,000 requests
- This script used ~500 requests = **FREE** (well within limit)

## Dependencies

```bash
pip install googlemaps
```

Already installed in `venv/` directory.

## Customize Search

Edit the `SEARCHES` list in `scripts/scrape-mazunte-google.py` to add/remove categories:

```python
SEARCHES = [
    {'type': 'restaurant', 'name': 'Restaurants'},
    {'keyword': 'yoga', 'name': 'Yoga Studios'},
    # Add your own searches here
]
```

## Change Location

Edit these variables in the script:

```python
MAZUNTE_CENTER = (15.6649, -96.5539)  # Lat, Long
SEARCH_RADIUS = 3000  # meters (3km)
```

---

**Generated:** October 27, 2025
**Script:** `scripts/scrape-mazunte-google.py`
