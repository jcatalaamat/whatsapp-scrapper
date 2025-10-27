#!/usr/bin/env python3
"""
MAZUNTE LANDMARKS SCRAPER - Using Google Places API
Fetches real coordinates, phone numbers, hours, ratings from Google

USAGE: python3 scripts/scrape-mazunte-google.py
"""

import googlemaps
import csv
import json
import os
from datetime import datetime
from pathlib import Path

# ============================================
# CONFIGURATION
# ============================================

# Load API key from .env file
def load_api_key():
    env_path = Path(__file__).parent.parent / '.env'
    if not env_path.exists():
        print(f"❌ .env file not found at {env_path}")
        return None

    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('GOOGLE_MAPS_API_KEY='):
                return line.split('=', 1)[1].strip()
    return None

API_KEY = load_api_key()
MAZUNTE_CENTER = (15.6649, -96.5539)
SEARCH_RADIUS = 3000  # meters (3km to cover entire area)

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / 'data' / 'outputs'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ============================================
# DEFINE SEARCHES
# ============================================

SEARCHES = [
    # Food & Drink
    {'type': 'restaurant', 'name': 'Restaurants'},
    {'keyword': 'cafe', 'name': 'Cafes'},
    {'keyword': 'juice bar', 'name': 'Juice Bars'},
    {'keyword': 'bar', 'name': 'Bars'},
    {'keyword': 'bakery', 'name': 'Bakeries'},

    # Wellness & Yoga
    {'keyword': 'yoga', 'name': 'Yoga Studios'},
    {'keyword': 'massage', 'name': 'Massage & Spa'},
    {'keyword': 'wellness', 'name': 'Wellness Centers'},
    {'keyword': 'healing', 'name': 'Healing Centers'},

    # Accommodations
    {'type': 'lodging', 'name': 'Hotels & Hostels'},
    {'keyword': 'hotel', 'name': 'Hotels'},
    {'keyword': 'hostel', 'name': 'Hostels'},
    {'keyword': 'cabin', 'name': 'Cabins'},

    # Attractions
    {'type': 'tourist_attraction', 'name': 'Tourist Attractions'},
    {'type': 'museum', 'name': 'Museums'},
    {'keyword': 'beach', 'name': 'Beaches'},
    {'keyword': 'viewpoint', 'name': 'Viewpoints'},

    # Shopping
    {'keyword': 'shop', 'name': 'Shops'},
    {'keyword': 'market', 'name': 'Markets'},
    {'keyword': 'organic', 'name': 'Organic Shops'},
    {'keyword': 'artisan', 'name': 'Artisan Shops'},
    {'type': 'store', 'name': 'Stores'},

    # Services
    {'keyword': 'coworking', 'name': 'Coworking Spaces'},
    {'keyword': 'laundry', 'name': 'Laundry'},
    {'keyword': 'surf', 'name': 'Surf Shops'},
]

# ============================================
# MAIN SCRAPER FUNCTION
# ============================================

def scrape_mazunte_places(api_key):
    """
    Scrape all Mazunte landmarks using Google Places API
    Returns list of place dictionaries with coordinates
    """

    if not api_key:
        print("❌ No API key found in .env file")
        return []

    try:
        gmaps = googlemaps.Client(key=api_key, timeout=10)
    except Exception as e:
        print(f"❌ Failed to initialize Google Maps client: {e}")
        print("   Make sure your API key is valid.")
        return []

    all_places = []
    seen_place_ids = set()  # Avoid duplicates

    print("🔍 Starting Mazunte landmark search...\n")
    print(f"📍 Center: {MAZUNTE_CENTER}")
    print(f"📏 Radius: {SEARCH_RADIUS}m\n")

    for i, search in enumerate(SEARCHES, 1):
        search_name = search.get('name', 'Unknown')
        print(f"[{i}/{len(SEARCHES)}] Searching: {search_name}...", end=" ", flush=True)

        try:
            # Remove 'name' from search dict before passing to API
            search_params = {k: v for k, v in search.items() if k != 'name'}
            search_params['location'] = MAZUNTE_CENTER
            search_params['radius'] = SEARCH_RADIUS

            # Make the nearby search request
            response = gmaps.places_nearby(**search_params)

            places_found = len(response.get('results', []))
            new_places = 0

            # Extract place data
            for place in response.get('results', []):
                place_id = place.get('place_id')

                # Skip if already added
                if place_id in seen_place_ids:
                    continue

                seen_place_ids.add(place_id)
                new_places += 1

                # Get detailed information
                try:
                    details_response = gmaps.place(
                        place_id=place_id,
                        fields=[
                            'name', 'formatted_address', 'geometry',
                            'formatted_phone_number', 'international_phone_number',
                            'website', 'rating', 'user_ratings_total',
                            'opening_hours', 'price_level', 'type', 'url'
                        ]
                    )

                    result = details_response.get('result', {})

                    place_data = {
                        'name': result.get('name', 'N/A'),
                        'category': search_name,
                        'latitude': result.get('geometry', {}).get('location', {}).get('lat', 'N/A'),
                        'longitude': result.get('geometry', {}).get('location', {}).get('lng', 'N/A'),
                        'address': result.get('formatted_address', 'N/A'),
                        'phone': result.get('formatted_phone_number', result.get('international_phone_number', 'N/A')),
                        'website': result.get('website', 'N/A'),
                        'google_maps_url': result.get('url', 'N/A'),
                        'rating': result.get('rating', 'N/A'),
                        'review_count': result.get('user_ratings_total', 'N/A'),
                        'price_level': format_price_level(result.get('price_level')),
                        'hours': format_hours(result.get('opening_hours', {})),
                        'open_now': result.get('opening_hours', {}).get('open_now', 'Unknown'),
                        'types': ', '.join(result.get('type', [])),
                        'place_id': place_id,
                    }

                    all_places.append(place_data)

                except Exception as e:
                    print(f"   ⚠️ Error getting details for {place.get('name')}: {e}")

            print(f"Found {places_found} ({new_places} new)")

        except Exception as e:
            print(f"❌ Error: {e}")

    return all_places


# ============================================
# HELPER FUNCTIONS
# ============================================

def format_price_level(price_level):
    """Format price level as dollar signs"""
    if price_level is None or price_level == 'N/A':
        return 'N/A'
    return '$' * price_level


def format_hours(opening_hours):
    """Format opening hours in readable format"""
    if not opening_hours:
        return "N/A"

    weekday_text = opening_hours.get('weekday_text', [])
    if weekday_text:
        return ' | '.join(weekday_text)
    return "N/A"


def save_to_csv(places, filename='Mazunte_Landmarks_Google_API.csv'):
    """Save places data to CSV file"""
    if not places:
        print("❌ No data to save")
        return False

    try:
        filepath = OUTPUT_DIR / filename

        fieldnames = [
            'name', 'category', 'latitude', 'longitude', 'address',
            'phone', 'website', 'google_maps_url', 'rating', 'review_count',
            'price_level', 'hours', 'open_now', 'types', 'place_id'
        ]

        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(places)

        print(f"✅ Saved {len(places)} places to {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error saving to CSV: {e}")
        return False


def save_to_json(places, filename='Mazunte_Landmarks_Google_API.json'):
    """Save places data to JSON file"""
    if not places:
        print("❌ No data to save")
        return False

    try:
        filepath = OUTPUT_DIR / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(places, f, indent=2, ensure_ascii=False)

        print(f"✅ Saved {len(places)} places to {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error saving to JSON: {e}")
        return False


def print_summary(places):
    """Print summary statistics"""
    print("\n" + "="*70)
    print("📊 SUMMARY")
    print("="*70)
    print(f"Total unique places found: {len(places)}")

    # By category
    categories = {}
    for place in places:
        cat = place.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1

    print("\nBy Category:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  • {cat}: {count}")

    # Average rating
    ratings = [float(p['rating']) for p in places if p['rating'] != 'N/A']
    if ratings:
        avg_rating = sum(ratings) / len(ratings)
        print(f"\nAverage rating: {avg_rating:.2f}/5.0")

    # With contact info
    with_websites = sum(1 for p in places if p['website'] != 'N/A')
    with_phones = sum(1 for p in places if p['phone'] != 'N/A')
    print(f"\nPlaces with websites: {with_websites}/{len(places)}")
    print(f"Places with phone numbers: {with_phones}/{len(places)}")

    # Open now
    open_now = sum(1 for p in places if p['open_now'] == True)
    print(f"Currently open: {open_now}/{len(places)}")

    print("="*70 + "\n")


def print_sample(places, count=5):
    """Print sample of places"""
    print("\n📍 SAMPLE DATA (first 5 places):")
    print("-" * 70)

    for place in places[:count]:
        print(f"\n  🏷️  {place['name']}")
        print(f"     Category: {place['category']}")
        print(f"     📍 {place['latitude']}, {place['longitude']}")
        print(f"     📧 {place['address']}")
        if place['phone'] != 'N/A':
            print(f"     ☎️  {place['phone']}")
        if place['website'] != 'N/A':
            print(f"     🌐 {place['website']}")
        if place['rating'] != 'N/A':
            print(f"     ⭐ {place['rating']}/5 ({place['review_count']} reviews)")
        if place['price_level'] != 'N/A':
            print(f"     💰 {place['price_level']}")

    print("\n" + "-" * 70)


# ============================================
# MAIN EXECUTION
# ============================================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🌴 MAZUNTE LANDMARKS SCRAPER - Google Places API")
    print("="*70 + "\n")

    # Run scraper
    places = scrape_mazunte_places(API_KEY)

    if places:
        print(f"\n✅ Successfully scraped {len(places)} unique places!\n")

        # Display summary
        print_summary(places)

        # Display sample
        print_sample(places, count=10)

        # Save to files
        print("\n💾 Saving data...")
        save_to_csv(places)
        save_to_json(places)

        print(f"\n✨ Done! Files saved to: {OUTPUT_DIR}")
        print("   • Mazunte_Landmarks_Google_API.csv")
        print("   • Mazunte_Landmarks_Google_API.json")
        print("\n   You can now use these in Google Maps, Excel, or any app.\n")
    else:
        print("\n❌ No places found. Check your API key and internet connection.\n")
