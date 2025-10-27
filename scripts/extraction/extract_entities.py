#!/usr/bin/env python3
"""
Extract events, places, and services from WhatsApp messages.
"""

import json
import re
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Tuple

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract contact information from message text."""
    contact = {
        'contact_phone': None,
        'contact_whatsapp': None,
        'contact_instagram': None,
        'contact_email': None,
        'website_url': None
    }

    # Phone patterns (various formats)
    phone_patterns = [
        r'\b(\+?52\s?1?\s?\d{10})\b',
        r'\b(\d{10})\b',
        r'\b(\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4})\b'
    ]
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            contact['contact_phone'] = match.group(1).strip()
            break

    # WhatsApp (often mentioned explicitly)
    wa_match = re.search(r'(?:whatsapp|wa|what\'s app)[\s:]*(\+?\d[\d\s-]+)', text, re.IGNORECASE)
    if wa_match:
        contact['contact_whatsapp'] = wa_match.group(1).strip()

    # Instagram
    ig_patterns = [
        r'(?:instagram|ig|insta)[\s:@]*([a-zA-Z0-9._]+)',
        r'@([a-zA-Z0-9._]+)'
    ]
    for pattern in ig_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            username = match.group(1).strip()
            if username and len(username) > 2 and not username.startswith('g.us'):
                contact['contact_instagram'] = username
                break

    # Email
    email_match = re.search(r'\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b', text)
    if email_match:
        contact['contact_email'] = email_match.group(1).strip()

    # Website
    url_match = re.search(r'(?:https?://)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?)', text)
    if url_match:
        contact['website_url'] = url_match.group(0).strip()

    return contact

def extract_price(text: str) -> Tuple[Optional[str], Optional[float], Optional[str]]:
    """Extract price information from text. Returns (full_price_string, amount, currency)."""
    # Look for free
    if re.search(r'\b(?:free|gratis|gratuito)\b', text, re.IGNORECASE):
        return ('Free', 0.0, None)

    # Look for price patterns
    price_patterns = [
        r'(\$\s?\d+(?:,\d{3})*(?:\.\d{2})?)\s*(MXN|USD|pesos?)?',
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(MXN|USD|pesos?)',
        r'(MXN|USD)?\s*(\$?\s?\d+(?:,\d{3})*(?:\.\d{2})?)'
    ]

    for pattern in price_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            groups = match.groups()
            amount_str = ''.join(c for c in str(groups[0] if groups[0] else groups[1]) if c.isdigit() or c == '.')
            if amount_str:
                try:
                    amount = float(amount_str)
                    currency = None
                    if len(groups) > 1 and groups[1]:
                        currency = groups[1].upper()
                        if 'PESO' in currency:
                            currency = 'MXN'
                    elif len(groups) > 0 and groups[0]:
                        if 'PESO' in groups[0].upper():
                            currency = 'MXN'
                    return (match.group(0), amount, currency if currency else 'MXN')
                except ValueError:
                    pass

    return (None, None, None)

def extract_date(text: str) -> Optional[str]:
    """Extract date from text and convert to YYYY-MM-DD format."""
    # Date patterns
    patterns = [
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',  # DD/MM/YYYY or MM/DD/YYYY
        r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})',  # YYYY-MM-DD
        r'(\d{1,2})\s+(?:de\s+)?([A-Za-z]+)\s+(?:de\s+)?(\d{4})',  # DD de Mes de YYYY
    ]

    months_es = {
        'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
        'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
    }

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            groups = match.groups()
            try:
                if pattern == patterns[2]:  # Month name pattern
                    day = int(groups[0])
                    month_name = groups[1].lower()
                    year = int(groups[2])
                    month = months_es.get(month_name)
                    if month:
                        return f"{year:04d}-{month:02d}-{day:02d}"
                elif pattern == patterns[1]:  # YYYY-MM-DD
                    return f"{int(groups[0]):04d}-{int(groups[1]):02d}-{int(groups[2]):02d}"
                else:  # DD/MM/YYYY - assume day/month format
                    day = int(groups[0])
                    month = int(groups[1])
                    year = int(groups[2])
                    if 1 <= day <= 31 and 1 <= month <= 12:
                        return f"{year:04d}-{month:02d}-{day:02d}"
            except (ValueError, AttributeError):
                pass

    # Look for relative dates
    if re.search(r'\b(?:hoy|today)\b', text, re.IGNORECASE):
        return datetime.now().strftime('%Y-%m-%d')
    if re.search(r'\b(?:mañana|tomorrow)\b', text, re.IGNORECASE):
        from datetime import timedelta
        return (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

    return None

def extract_time(text: str) -> Optional[str]:
    """Extract time from text and convert to HH:MM:SS format."""
    # Time patterns
    patterns = [
        r'(\d{1,2}):(\d{2})\s*(?:am|pm|AM|PM)?',
        r'(\d{1,2})\s*(?:am|pm|AM|PM)',
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            groups = match.groups()
            hour = int(groups[0])
            minute = int(groups[1]) if len(groups) > 1 and groups[1] else 0

            # Handle AM/PM
            if re.search(r'pm', match.group(0), re.IGNORECASE) and hour < 12:
                hour += 12
            elif re.search(r'am', match.group(0), re.IGNORECASE) and hour == 12:
                hour = 0

            if 0 <= hour < 24 and 0 <= minute < 60:
                return f"{hour:02d}:{minute:02d}:00"

    return None

def is_event_message(text: str) -> bool:
    """Determine if a message is advertising an event."""
    event_keywords = [
        r'\bevento\b', r'\bworkshop\b', r'\btaller\b', r'\bclase\b', r'\bclass\b',
        r'\bfiesta\b', r'\bparty\b', r'\bconcert\b', r'\bconcierto\b',
        r'\bperformance\b', r'\bgathering\b', r'\breunión\b', r'\bceremony\b',
        r'\bceremonia\b', r'\bfestival\b', r'\bretiro\b', r'\bretreat\b',
        r'\bcircle\b', r'\bcírculo\b', r'\bsession\b', r'\bsesión\b',
        r'\binvit(?:ación|amos|an)\b', r'\bnext\b', r'\bpróximo\b',
        r'\bthis\s+(?:week|friday|saturday|sunday)\b',
        r'\beste\s+(?:viernes|sábado|domingo|fin de semana)\b'
    ]

    return any(re.search(keyword, text, re.IGNORECASE) for keyword in event_keywords)

def is_place_message(text: str) -> bool:
    """Determine if a message mentions a place/venue."""
    place_keywords = [
        r'\brestaurant\b', r'\bcafe\b', r'\bcafé\b', r'\bbar\b',
        r'\bhotel\b', r'\bhostel\b', r'\bcabañas?\b', r'\bbeach\b', r'\bplaya\b',
        r'\bstudio\b', r'\bvenue\b', r'\bespacio\b', r'\btienda\b', r'\bshop\b',
        r'\blocation\b', r'\bubicación\b', r'\baddress\b', r'\bdirección\b',
        r'\babre\b', r'\bopen\b', r'\bhorario\b', r'\bhours\b'
    ]

    return any(re.search(keyword, text, re.IGNORECASE) for keyword in place_keywords)

def is_service_message(text: str) -> bool:
    """Determine if a message is offering a service."""
    service_keywords = [
        r'\bofrez(?:co|ca)\b', r'\boffer\b', r'\bservicio\b', r'\bservice\b',
        r'\byoga\b', r'\bmasaje\b', r'\bmassage\b', r'\btherapy\b', r'\bterapia\b',
        r'\bteaching\b', r'\benseñanza\b', r'\bclases?\b', r'\blessons?\b',
        r'\btransport\b', r'\btransporte\b', r'\bdriver\b', r'\bchofer\b',
        r'\bcleaning\b', r'\blimpieza\b', r'\brepair\b', r'\breparación\b',
        r'\bcooking\b', r'\bcocina\b', r'\bhaircut\b', r'\bcorte de pelo\b',
        r'\bvendo\b', r'\bselling\b', r'\bfor sale\b', r'\bse vende\b'
    ]

    return any(re.search(keyword, text, re.IGNORECASE) for keyword in service_keywords)

def categorize_event(text: str) -> str:
    """Categorize an event based on keywords."""
    categories = {
        'party': [r'\bfiesta\b', r'\bparty\b', r'\bdance\b', r'\bbaile\b', r'\bdj\b'],
        'workshop': [r'\bworkshop\b', r'\btaller\b', r'\btraining\b', r'\bentrenamiento\b'],
        'wellness': [r'\byoga\b', r'\bmeditation\b', r'\bmeditación\b', r'\bwellness\b', r'\bbienestar\b', r'\bhealing\b', r'\bsanación\b'],
        'music': [r'\bmusic\b', r'\bmúsica\b', r'\bconcert\b', r'\bconcierto\b', r'\bband\b', r'\bbanda\b', r'\blive\s+music\b'],
        'art': [r'\bart\b', r'\barte\b', r'\bpainting\b', r'\bpintura\b', r'\bexhibition\b', r'\bexposición\b', r'\bcraft\b'],
        'spirituality': [r'\bspiritual\b', r'\bceremony\b', r'\bceremonia\b', r'\bcircle\b', r'\bcírculo\b', r'\brituel\b', r'\britual\b'],
        'food': [r'\bfood\b', r'\bcomida\b', r'\bdinner\b', r'\bcena\b', r'\blunch\b', r'\bcocina\b', r'\bcooking\b'],
        'sports': [r'\bsport\b', r'\bdeporte\b', r'\bsurf\b', r'\bhiking\b', r'\bcaminata\b', r'\bfitness\b']
    }

    for category, keywords in categories.items():
        if any(re.search(keyword, text, re.IGNORECASE) for keyword in keywords):
            return category

    return 'other'

def categorize_place(text: str) -> Tuple[str, str]:
    """Categorize a place. Returns (type, category)."""
    place_types = {
        'restaurant': ([r'\brestaurant\b', r'\bcafe\b', r'\bcafé\b', r'\bbar\b', r'\bfood\b', r'\bcomida\b'], 'Food & Drink'),
        'accommodation': ([r'\bhotel\b', r'\bhostel\b', r'\bcabaña\b', r'\bcabin\b', r'\bstay\b', r'\balojamiento\b'], 'Lodging'),
        'venue': ([r'\bvenue\b', r'\bespacio\b', r'\bsala\b', r'\bhall\b', r'\bcenter\b', r'\bcentro\b'], 'Event Space'),
        'activity': ([r'\bbeach\b', r'\bplaya\b', r'\bsurf\b', r'\btour\b', r'\bactividad\b', r'\bactivity\b'], 'Activities'),
        'shop': ([r'\btienda\b', r'\bshop\b', r'\bstore\b', r'\bmercado\b', r'\bmarket\b'], 'Shopping'),
        'studio': ([r'\bstudio\b', r'\bespacio\b', r'\bgallery\b', r'\bgalería\b'], 'Creative Space')
    }

    for place_type, (keywords, category) in place_types.items():
        if any(re.search(keyword, text, re.IGNORECASE) for keyword in keywords):
            return (place_type, category)

    return ('venue', 'General')

def categorize_service(text: str) -> str:
    """Categorize a service."""
    categories = {
        'wellness': [r'\byoga\b', r'\bmasaje\b', r'\bmassage\b', r'\btherapy\b', r'\bterapia\b', r'\bhealing\b', r'\breiki\b'],
        'art': [r'\bart\b', r'\barte\b', r'\bpainting\b', r'\bmusic\b', r'\bmúsica\b', r'\bcraft\b'],
        'education': [r'\bteaching\b', r'\bclase\b', r'\blesson\b', r'\btutoría\b', r'\bcurso\b', r'\bcourse\b'],
        'food': [r'\bfood\b', r'\bcomida\b', r'\bcooking\b', r'\bcatering\b', r'\bchef\b'],
        'accommodation': [r'\broom\b', r'\bhabitación\b', r'\brent\b', r'\balquiler\b', r'\bstay\b'],
        'transportation': [r'\btransport\b', r'\btaxi\b', r'\bdriver\b', r'\bchofer\b', r'\bcar\b', r'\bcoche\b'],
        'repair': [r'\brepair\b', r'\breparación\b', r'\bfix\b', r'\barreglo\b'],
        'beauty': [r'\bhair\b', r'\bpelo\b', r'\bnails\b', r'\buñas\b', r'\bbeauty\b', r'\bbelleza\b']
    }

    for category, keywords in categories.items():
        if any(re.search(keyword, text, re.IGNORECASE) for keyword in keywords):
            return category

    return 'other'

def extract_location(text: str) -> Optional[str]:
    """Extract location/venue name from text."""
    # Look for location indicators
    location_patterns = [
        r'(?:en|at|@)\s+([A-Z][A-Za-z\s]{2,30})',
        r'(?:ubicación|location|lugar|place)[\s:]+([A-Za-z\s]{3,30})',
        r'(?:venue|espacio)[\s:]+([A-Za-z\s]{3,30})'
    ]

    for pattern in location_patterns:
        match = re.search(pattern, text)
        if match:
            location = match.group(1).strip()
            if location and len(location) > 2:
                return location

    return None

def extract_organizer(text: str) -> Optional[str]:
    """Extract organizer name from text."""
    organizer_patterns = [
        r'(?:organiza|organized by|host|hosted by)[\s:]+([A-Z][A-Za-z\s]{2,30})',
        r'(?:con|with|by)\s+([A-Z][A-Za-z\s]{2,30})',
    ]

    for pattern in organizer_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            organizer = match.group(1).strip()
            if organizer and len(organizer) > 2:
                return organizer

    return None

def process_messages(input_file: str) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """Process messages and extract events, places, and services."""

    with open(input_file, 'r', encoding='utf-8') as f:
        messages = json.load(f)

    events = []
    places = []
    services = []

    for msg in messages:
        message_id = msg.get('id')
        text = msg.get('message_body', '')

        if not text or len(text) < 10:
            continue

        contact_info = extract_contact_info(text)

        # Extract events
        if is_event_message(text):
            event = {
                'id': str(uuid.uuid4()),
                'city_id': 'mazunte',
                'message_id': message_id,
                'title': text[:100].strip() if len(text) > 100 else text.strip(),
                'description': text,
                'date': extract_date(text),
                'time': extract_time(text),
                'location_name': extract_location(text),
                'category': categorize_event(text),
                'price': extract_price(text)[0],
                'organizer_name': extract_organizer(text),
                **contact_info
            }
            events.append(event)

        # Extract places
        if is_place_message(text):
            place_type, place_category = categorize_place(text)
            place = {
                'id': str(uuid.uuid4()),
                'city_id': 'mazunte',
                'message_id': message_id,
                'name': extract_location(text) or text[:50].strip(),
                'type': place_type,
                'category': place_category,
                'description': text,
                'location_name': extract_location(text),
                'hours': None,  # Could be extracted with more specific patterns
                **contact_info
            }
            places.append(place)

        # Extract services
        if is_service_message(text):
            price_str, price_amount, price_currency = extract_price(text)
            service = {
                'id': str(uuid.uuid4()),
                'city_id': 'mazunte',
                'message_id': message_id,
                'title': text[:100].strip() if len(text) > 100 else text.strip(),
                'description': text,
                'category': categorize_service(text),
                'price_type': 'fixed' if price_amount else 'negotiable',
                'price_amount': price_amount,
                'price_currency': price_currency,
                'price_notes': price_str,
                **contact_info
            }
            services.append(service)

    return events, places, services

def main():
    input_file = '/Users/astralamat/Documents/Code/whatsapp-scrapper/data/messages_20251026_201832.json'

    print(f"Processing messages from {input_file}...")
    events, places, services = process_messages(input_file)

    # Write events
    events_file = '/Users/astralamat/Documents/Code/whatsapp-scrapper/extracted-events.json'
    with open(events_file, 'w', encoding='utf-8') as f:
        json.dump(events, f, indent=2, ensure_ascii=False)
    print(f"Extracted {len(events)} events to {events_file}")

    # Write places
    places_file = '/Users/astralamat/Documents/Code/whatsapp-scrapper/extracted-places.json'
    with open(places_file, 'w', encoding='utf-8') as f:
        json.dump(places, f, indent=2, ensure_ascii=False)
    print(f"Extracted {len(places)} places to {places_file}")

    # Write services
    services_file = '/Users/astralamat/Documents/Code/whatsapp-scrapper/extracted-services.json'
    with open(services_file, 'w', encoding='utf-8') as f:
        json.dump(services, f, indent=2, ensure_ascii=False)
    print(f"Extracted {len(services)} services to {services_file}")

    print("\n=== SUMMARY ===")
    print(f"Total Events: {len(events)}")
    print(f"Total Places: {len(places)}")
    print(f"Total Services: {len(services)}")
    print(f"Total Extracted: {len(events) + len(places) + len(services)}")

if __name__ == '__main__':
    main()
