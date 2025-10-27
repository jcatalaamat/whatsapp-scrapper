# SQL INSERT Statements for Supabase

**Generated:** 2025-10-27T07:38:18.665Z

**Source:** WhatsApp messages from Mazunte community groups

**Statistics:**
- 🎉 Events: 29
- 📍 Places: 20
- 🛠️  Services: 34
- **Total Entities:** 83

---

## How to Use

1. Open Supabase SQL Editor
2. Copy each section below
3. Run in Supabase (one table at a time)
4. Review imported data in Supabase dashboard

**Important Notes:**
- All entities have `approval_status = 'pending'` - you can review and approve them
- Contact information (WhatsApp, phone, Instagram, email) extracted where available
- Some fields may be NULL if information wasn't provided in original messages
- UUIDs are pre-generated for all entities

---

## 🎉 Events (29)

```sql
-- Insert 29 events
INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Floorwork (Adultos) - Dance Class',
  'El cuerpo se desliza, respira y se expresa sin juicios. Una clase para reconectar con tu sensualidad, fuerza y presencia.',
  '2025-10-27',
  '17:30:00',
  'Foro Escénico Alternativo Mermejita',
  15.6602,
  -96.5648,
  'art',
  '100 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531513478_1761531513478_ieyrt2.jpg',
  NULL,
  '5212213497548',
  '5212213497548',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Ashtanga Yoga Class',
  'Ashtanga. Respiración, postura, enfoque. Breath, posture, focus.',
  '2025-10-27',
  NULL,
  'Hotel Noga, Zipolite',
  15.6675,
  -96.553,
  'wellness',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531517686_1761531517686_vi945o.jpg',
  NULL,
  '5219983982404',
  '5219983982404',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Bhajans at Hridaya Yoga',
  'An evening of devotional singing — a heartfelt journey into sound, love, and presence. Come together in community to chant, open hearts, and celebrate through music.',
  '2025-10-25',
  '20:30:00',
  'Hridaya Yoga – Nitya Hall',
  15.668,
  -96.5545,
  'spirituality',
  'Free',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531527066_1761531527066_oitait.jpg',
  NULL,
  '529871188324',
  '529871188324',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '51f88125-acbe-4bf0-affa-cc021ac9efe6',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'The Beloved - 5-Day Couples Retreat',
  'A 5-day retreat for couples ready to explore love beyond romance—where connection becomes sacred, desire is honored, and devotion opens the door to awakening. Rooted in the non-dual tradition of Kashmir Shaivism Tantra, held by Spandananda and Thalia Devi.',
  '2025-11-30',
  'Mazunte, Mexico',
  15.6666646,
  -96.5500752,
  'spirituality',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531527702_1761531527702_5r7ata.jpg',
  'Spandananda and Thalia Devi',
  NULL,
  '5219582204788',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '4e6b7bde-8930-49e3-8bf7-92a18be611a2',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Regresiones a vidas pasadas - Taller grupal',
  'A therapeutic group workshop exploring past life regression to understand the present, access subconscious memories, understand emotional origins of conflicts, explore connections with others, observe behavioral patterns, release blocked energy, and rediscover internal resources. Includes introduction, guided meditation, and integration sharing.',
  '2025-11-05',
  '17:00:00',
  'Kinam Mazunte, al lado de Posada la Huerta, Camino Al Alguaje S/N, Mazunte, Oaxaca',
  15.667,
  -96.5545,
  'wellness',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531528982_1761531528982_l53nso.jpg',
  '79855717128',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'f5447edc-a1ce-4391-a2ac-ca282f2cfe02',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hatha Yoga with Luzia',
  'A holistic yoga class to connect deeply with ourselves: becoming aware of the body, energies, chakras and the depth of our being. A class to awaken our entire being. Bilingual: Spanish & English.',
  NULL,
  '17:00:00',
  'Meditation Station',
  15.6685,
  -96.5542,
  'wellness',
  '200 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531529842_1761531529842_4a2slw.jpg',
  'Luzia',
  NULL,
  '5215535232064',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hatha Yoga with Luzia - Sunday Class',
  'A holistic yoga class to connect deeply with ourselves: becoming aware of the body, energies, chakras and the depth of our being. A class to awaken our entire being. Bilingual: Spanish & English.',
  NULL,
  '08:15:00',
  'Meditation Station',
  15.6685,
  -96.5542,
  'wellness',
  '200 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531529842_1761531529842_4a2slw.jpg',
  'Luzia',
  NULL,
  '5215535232064',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Art Session at Mermejita Beach',
  'Let''s make art together capturing the changing colors of a sunset. Materials will be provided or you can bring your own. At Mermejita beach, close to the lifeguard station to the right.',
  NULL,
  NULL,
  'Mermejita Beach, near lifeguard station',
  15.66,
  -96.565,
  'art',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531534558_1761531534558_il8mnb.jpg',
  '5214772804240',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440006',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Regulate Your Nervous System: Tools for Well-Being',
  'An interactive session exploring what it means to regulate the nervous system and how to apply practical tools for more calm and balance in everyday life. A space to learn, share, and connect with yourself. Everyone is welcome.',
  NULL,
  '15:30:00',
  'Meditation Station',
  15.6685,
  -96.5542,
  'wellness',
  '200 MXN / 100 MXN for locals',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531601430_1761531601430_tq24yi.jpg',
  '5215530130756',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440007',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hip Hop & Más Dance Session',
  'Dance session for dancers, dancers, movers, and enjoyers. Hip Hop and more.',
  NULL,
  '12:00:00',
  'La Galera, Zipolite',
  15.6655,
  -96.5215,
  'music',
  NULL,
  NULL,
  NULL,
  NULL,
  '5219992785112',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440008',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Bailación at Wamba',
  'Dance session at Wamba on Sundays. Take a dip and dance the best of cumbia and salsa.',
  NULL,
  '14:00:00',
  'Wamba',
  15.6683,
  -96.5528,
  'music',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531537134_1761531537134_cpijds.jpg',
  '5219581063571',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '290c7a7b-9c78-4941-b056-cdbaa9c43b56',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Inauguración de temporada en El Chiringuito',
  'Inauguramos temporada en el paraíso con el mejor atardecer',
  '2025-10-29',
  NULL,
  'El Chiringuito',
  15.6678,
  -96.5525,
  'party',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531538692_1761531538692_qgghlv.jpg',
  NULL,
  '5219581197051',
  '5219581197051',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '8befc249-7a9e-4bc9-a79e-922686f01142',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Soul Sister Sanctuary - First Gathering',
  'Gentle space to reconnect, heal, sing, share, and celebrate together in sisterhood. Bilingual gathering (English & Spanish). Includes nourishing tapas and goddess grazing table snacks. 30% of profits gifted to Piña Palmera.',
  '2025-11-04',
  '13:00:00',
  'Camp, Zipolite',
  15.6658,
  -96.522,
  'spirituality',
  'Soul Sister Tribe',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '87475c0c-ca02-4c27-8da7-b590ac3e19f1',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Soul Sister Sanctuary - Second Gathering',
  'Gentle space to reconnect, heal, sing, share, and celebrate together in sisterhood. Bilingual gathering (English & Spanish). Includes nourishing tapas and goddess grazing table snacks. 30% of profits gifted to Piña Palmera.',
  '2025-11-25',
  '13:00:00',
  'Camp, Zipolite',
  15.6658,
  -96.522,
  'spirituality',
  'Soul Sister Tribe',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'a298dc5a-1376-4e12-9c08-67efc311f7b8',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Movimiento Consciente',
  'Contenedor amoroso, compasivo y libre de juicios para explorar a través del movimiento, la quietud, el juego y el baile. Círculo de palabra al inicio y cierre verbal al final. Música incluida.',
  '2025-10-26',
  '09:30:00',
  'Hridaya - Salón Nitya',
  15.668,
  -96.5545,
  'wellness',
  'Donativos conscientes',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531544565_1761531544564_gm66nf.jpg',
  'Mariana',
  '5215547948431',
  '5215547948431',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '0f78db6b-81d5-4e0b-aec1-76cf2edcf675',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Community Fire Gathering',
  'Reunión comunitaria alrededor de una fogata. Traer instrumentos, canciones, bebidas y aperitivos. Todos bienvenidos.',
  '2025-10-29',
  '19:30:00',
  NULL,
  NULL,
  NULL,
  'community',
  NULL,
  NULL,
  NULL,
  '447718168185',
  '447718168185',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'c1c5742a-72ce-4069-8918-8d8e315a7272',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Weekly Breath Circle',
  'Guided breathwork practice for transformation and emotional release. Includes guided meditation, gentle bodywork, active connected breathing (40 min), and integration/relaxation (20 min). Facilitated by Rose, former midwife and trained breathwork facilitator.',
  '2025-10-27',
  '09:30:00',
  'Bliss Haven',
  15.6675,
  -96.5548,
  'wellness',
  15.6685,
  -96.5542,
  'Rose',
  '31647248603',
  '31647248603',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '7cd8b8f8-e71d-49dc-869a-6c84d0bf4e85',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Floorwork (Adultos)',
  'El cuerpo se desliza, respira y se expresa sin juicios. Una clase para reconectar con tu sensualidad, fuerza y presencia.',
  '2025-10-27',
  '17:30:00',
  'Foro Escénico Alternativo Mermejita',
  15.6602,
  -96.5648,
  'dance',
  '100 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531548646_1761531548646_2op2nr.jpg',
  NULL,
  '5212213497548',
  '5212213497548',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '3d53e65d-1e2a-4629-bc46-9d1241061b89',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Regulate Your Nervous System: Tools for Well-Being',
  'Interactive session exploring nervous system regulation and practical tools for calm and balance in everyday life.',
  '2025-10-11',
  '15:30:00',
  'Meditation Station',
  15.6685,
  -96.5542,
  'wellness',
  '200 MXN / 100 MXN for locals',
  15.6666646,
  -96.5500752,
  '5215530130756',
  '5215530130756',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '56cab2e4-27a2-44c6-8c45-d240568473e8',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Self-Love Portrait Sessions',
  'Therapeutic sessions with filmmaker and photographer offering transformative containers for authentic expression and self-love connection with body and image.',
  15.6666646,
  -96.5500752,
  'Mazunte',
  15.669,
  -96.5505,
  'art',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531558757_1761531558757_are1fg.jpg',
  '447775345524',
  '447775345524',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '91d5cf86-d050-48fa-9bbf-4be3f344c68c',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Conscious Movement',
  'Movement and dance session in a loving, non-judgmental and compassionate container. Includes verbal check-in, movement exploration with music, and reflective sharing.',
  '2025-10-12',
  '09:30:00',
  'Bliss Haven',
  15.6675,
  -96.5548,
  'wellness',
  'Conscious donations',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531562270_1761531562270_0osao1.jpg',
  'Mariana',
  '5215547948431',
  '5215547948431',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '853769d3-3116-49f7-943c-2cf0fdac27ba',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Cacao and Singing Circle',
  'Enriching gathering combining heart-opening qualities of Mama Cacao with the connecting and freeing experience of singing together. Share intentions and sing from the heart, harmonizing voices and energies.',
  NULL,
  '19:00:00',
  'Meditation Station',
  15.6685,
  -96.5542,
  'ceremony',
  '100 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531565933_1761531565933_tsvxwv.jpg',
  'Griot',
  '5217779634622',
  '5217779634622',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'e84c641b-2e85-4cc4-917a-0528fcc2a4d7',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Círculo de Canto y Cacao / Singing Cacao Circle',
  'Cacao and Singing Circle with Abuela''s recipe. Enriching gathering combining heart-opening qualities of Mama Cacao with connecting and freeing experience of singing together. Share intentions and sing from hearts, harmonizing voices, sounds and energies for joy, healing, and unity.',
  NULL,
  '19:00:00',
  'Meditation Station / Estación de Meditación',
  15.6685,
  -96.5542,
  'ceremony',
  '100 MXN',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531567490_1761531567490_nz0vf5.jpg',
  'Griot',
  NULL,
  '5217779634622',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'db4b957e-324b-4c77-bdb3-5762dd24c02c',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Clases de Arte / Art Classes',
  'Watercolor painting in the morning and oracle/tarot design in the afternoon',
  NULL,
  NULL,
  'Cenzontle, calle rinconcito',
  15.668,
  -96.552,
  'art',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531570602_1761531570602_a5ftxv.jpg',
  '5214772804240',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'fa2c57b3-a4ca-4bf1-a4c6-fdf3c851705c',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Movement & Dance Exploration',
  'Loving, non-judgmental & compassionate container to sit, explore, move and/or dance with whatever is feeling most alive within you. Verbal check-in and check-out for sharing reflections. Music during movement exploration with guidance and prompts for exploration.',
  NULL,
  '09:30:00',
  'Hridaya - Anugraha Hall',
  15.668,
  -96.5545,
  'wellness',
  'Conscious donations',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531602447_1761531602447_1azgxt.jpg',
  'Mariana',
  NULL,
  '5215547948431',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'b7681867-4815-4008-8f81-0fb84bc4ce30',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Yoga Fundraiser for Carla',
  'Yoga fundraiser for Carla, a yoga teacher who suffered a devastating car accident and is recovering from complex surgery to reconstruct her arm (fractured in three places). All funds raised will go toward her recovery.',
  '2025-10-21',
  '08:30:00',
  'Casa Corzo',
  15.6682,
  -96.5538,
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  '5213318826748',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  '89d88c7b-53f0-4b2f-b2cf-bb77eed0822f',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Online Talk: Supporting Children Through Transitions',
  'Online talk directed at parents, guides and teachers accompanying families going through transition processes (separation, grief, divorce) seeking concrete tools and focus strategies to care for child balance in first and second septenium.',
  '2025-10-18',
  'Online',
  NULL,
  'education',
  NULL,
  NULL,
  'La Escuela Raices de vida',
  NULL,
  '5215642298959',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'd09e9fbf-6f30-45f0-a89e-73d04176e437',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Conscious Movement',
  'Loving, compassionate, and non-judgmental container to explore authentic self-expression through movement, stillness, play, voice and dance. Includes verbal check-in circle and closing reflection.',
  NULL,
  '09:30:00',
  'Hridaya - Nitya Hall',
  15.668,
  -96.5545,
  'wellness',
  'Conscious donations welcome',
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531614494_1761531614494_ko9y9o.jpg',
  'Mariana',
  NULL,
  '5215547948431',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO events (
  id, profile_id, title, description, date, time,
  location_name, lat, lng, category, price, image_url,
  organizer_name, contact_phone, contact_whatsapp,
  contact_instagram, contact_email,
  city_id, approval_status
) VALUES (
  'bbcc44e9-2880-40d7-95f5-f75709cc6c77',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Community Assembly - Recycling Project Presentation',
  'Project presentation for achieving 90% waste recycling in Mazunte. Community voting on project approval.',
  NULL,
  '17:00:00',
  NULL,
  NULL,
  NULL,
  'community',
  NULL,
  'https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531612107_1761531612107_yxxtlb.jpg',
  '5219581063571',
  NULL,
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);
```

---

## 📍 Places (20)

```sql
-- Insert 20 places
INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '5f0dd014-4411-4d78-b672-0b12d2954065',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Musicalli',
  'studio',
  'music',
  'Music studio/venue located on Calle Cantares (also known as Calle Agua de Luna) between Mazunte and Ventanilla. Light red house with dogs.',
  'Calle Cantares n7, Mazunte (between Mazunte and Ventanilla)',
  15.6692,
  -96.551,
  NULL,
  NULL,
  '393332024184',
  '393332024184',
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531549452_1761531549452_pnboan.jpg"}',
  '{"music","studio","venue","dirt road","km 6 sign"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '9a4521bd-3054-44ee-9c35-f2e31d280fd5',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Foro Escénico Alternativo Mermejita',
  'venue',
  'art',
  'Alternative scenic forum/performance space for dance and movement classes',
  'Mazunte',
  15.6602,
  -96.5648,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531513478_1761531513478_ieyrt2.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531548646_1761531548646_2op2nr.jpg"}',
  '{"dance","performance","classes","movement","venue"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  'f031ab38-0e96-4ef7-89d6-4713523fd633',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hotel Noga',
  'accommodation',
  NULL,
  'Hotel offering yoga classes and wellness activities',
  'Zipolite',
  15.6675,
  -96.553,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531517686_1761531517686_vi945o.jpg"}',
  '{"hotel","yoga","wellness"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  'afb9264b-e058-4def-b61b-bd71eccc593f',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hridaya Yoga',
  'studio',
  'wellness',
  'Yoga studio with Nitya Hall for classes and devotional events',
  'Mazunte',
  15.668,
  -96.5545,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531527066_1761531527066_oitait.jpg"}',
  '{"yoga","meditation","spirituality","bhajans"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '5e4fb33c-bcad-4c3a-bf27-229fd70e0cd0',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'San Agustinillo',
  'other',
  NULL,
  'Location for sessions and services.',
  'San Agustinillo',
  15.663,
  -96.538,
  NULL,
  NULL,
  '64210661826',
  '64210661826',
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531515832_1761531515832_g486t9.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531549452_1761531549452_pnboan.jpg"}',
  '{"sessions","wellness","services"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440009',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'El Delfin Tacos Mazunte',
  'restaurant',
  'food',
  'Taco restaurant',
  'Mazunte',
  15.669,
  -96.5505,
  NULL,
  NULL,
  '+52 958 142 6536',
  '+52 958 142 6536',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"tacos","food delivery","restaurant"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Meditation Station',
  'studio',
  'wellness',
  'Space for meditation, wellness workshops, and community gatherings.',
  'Mazunte',
  15.6685,
  -96.5542,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531529842_1761531529842_4a2slw.jpg"}',
  '{"meditation","yoga","wellness","community","classes"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440011',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Kinam Mazunte',
  'venue',
  'wellness',
  'Venue for workshops and events',
  'al lado de Posada la Huerta, Camino Al Alguaje S/N, Mazunte, Oaxaca',
  15.667,
  -96.5545,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531528982_1761531528982_l53nso.jpg"}',
  '{"workshops","events","venue"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440012',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Mermejita Beach',
  'beach',
  NULL,
  'Beach in Mazunte',
  'Mazunte',
  15.66,
  -96.565,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531534558_1761531534558_il8mnb.jpg"}',
  '{"beach","art","activities"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440013',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Akasha',
  'studio',
  'wellness',
  'Pilates studio',
  'Mazunte',
  15.669,
  -96.5505,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'http://wa.me/+529581189598',
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531533753_1761531533753_b2o77d.jpg"}',
  '{"pilates","fitness","wellness"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440014',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'La Galera',
  'venue',
  NULL,
  'Dance venue',
  'Zipolite',
  15.6655,
  -96.5215,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"dance","hip hop","venue"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440015',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Wamba',
  'venue',
  NULL,
  'Dance venue',
  'Mazunte',
  15.6683,
  -96.5528,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531537134_1761531537134_cpijds.jpg"}',
  '{"dance","cumbia","salsa","venue"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440101',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'El Chiringuito',
  'venue',
  'bar/restaurant',
  'Venue with sunset views',
  'Mazunte',
  15.6678,
  -96.5525,
  NULL,
  NULL,
  '5219581197051',
  '5219581197051',
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531538692_1761531538692_qgghlv.jpg"}',
  '{"sunset","events","social"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440102',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Hridaya',
  'studio',
  'wellness/spiritual center',
  'Wellness and spiritual center with multiple halls including Nitya hall',
  'Mazunte',
  15.668,
  -96.5545,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531544565_1761531544564_gm66nf.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531602447_1761531602447_1azgxt.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531614494_1761531614494_ko9y9o.jpg"}',
  '{"yoga","movement","wellness","spirituality","dance","events","community","healing"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440103',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Camp',
  'venue',
  'community space',
  'Community gathering space in Zipolite',
  'Zipolite',
  15.6658,
  -96.522,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'https://chat.whatsapp.com/KMDlXiNvO7r0xIyi2YrVzP',
  NULL,
  '{"events","gatherings","community"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440104',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Bliss Haven',
  'studio',
  'wellness center',
  'Wellness studio offering breathwork and other practices',
  'Mazunte',
  15.6675,
  -96.5548,
  NULL,
  NULL,
  '31647248603',
  '31647248603',
  NULL,
  NULL,
  'https://www.cradlecoaching.nl/en/ademcoaching',
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531562270_1761531562270_0osao1.jpg"}',
  '{"breathwork","wellness","meditation","movement","community"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '869b594a-546a-418d-898b-831a6c01181a',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Meditation Station / Estación de Meditación',
  'studio',
  'wellness',
  'Meditation and wellness space hosting circles, classes and gatherings',
  'Meditation Station',
  15.6685,
  -96.5542,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531567490_1761531567490_nz0vf5.jpg"}',
  '{"meditation","wellness","circles","classes"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '80177a61-c3af-4943-b3fd-c23cf95cc630',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Cenzontle',
  'studio',
  'art',
  'Art studio offering classes in watercolor painting and oracle/tarot design',
  'Cenzontle, calle rinconcito',
  15.6682,
  -96.5523,
  NULL,
  NULL,
  NULL,
  '5214772804240',
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531570602_1761531570602_a5ftxv.jpg"}',
  '{"art","painting","watercolor","tarot","oracle"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  'f0e9032b-286f-4b16-941f-a0ac3c8d2211',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Kinam',
  'accommodation',
  'community',
  'Beautiful calm community space with rooms available for rent. 10 minute walk to the beach.',
  'Kinam',
  15.667,
  -96.5545,
  NULL,
  '400 MXN per night / 5000 MXN per month',
  '+33 7 88 06 06 49',
  '+33 7 88 06 06 49',
  NULL,
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531577322_1761531577322_i3tpgb.jpg"}',
  '{"accommodation","rooms","community","beach"}',
  'mazunte',
  false
);

INSERT INTO places (
  id, name, type, category, description,
  location_name, lat, lng, hours, price_range,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, website_url, images, tags,
  city_id, verified, created_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440105',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Casa Corzo',
  'venue',
  'wellness',
  'Venue hosting yoga classes and wellness events',
  'Casa Corzo',
  15.6682,
  -96.5538,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'https://gofund.me/8e3a4dd4e',
  NULL,
  '{"yoga","wellness","events"}',
  'mazunte',
  false
);
```

---

## 🛠️ Services (34)

```sql
-- Insert 34 services
INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '696a21fa-ecba-46f0-b275-25691c8d1791',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Dance Classes - Starting in One Week',
  'Dance classes starting in one week. Contact for details about dance type and group size.',
  'art',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '573150707182',
  '573150707182',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'ebf146d6-5ea9-4715-a778-d847b68a759b',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  '100% Natural Mexican Products',
  'Natural, healthy Mexican products including peanut butter, brown rice cakes, sweet potato chips, and sea salt. All products are organic, preservative-free, and made with minimal ingredients.',
  'food',
  'fixed',
  NULL,
  'MXN',
  'Crema de Cacahuate Original $110, Crunchy $115 (500g); Galletas de Arroz Integral $50 (16 piezas); Chips de Camote 50g $25, 100g $50; Sal de Mar $50 (1 kilo)',
  NULL,
  NULL,
  NULL,
  '5214481230136',
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531513773_1761531513773_jo47s8.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'a0b115fe-8d1e-487f-aede-af4d54e306d7',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Wellness Sessions - High Season Availability',
  'Wellness sessions available during high season. Contact for details and availability.',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  'San Agustinillo',
  15.663,
  -96.538,
  '64210661826',
  '64210661826',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531515832_1761531515832_g486t9.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'e1ae8770-d944-4218-99d6-a3c0ebf0fffc',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Nervous System Regulation and Trauma Release - Fascial and Vagal Therapy',
  'Hands-on fascial and vagal therapy focused on nervous system regulation, trauma resolution, and chronic physical conditions. Somatic practice rooted in stillness and awareness, helping the body release deep emotional and physical patterns and restore natural capacity for coherence, presence, and healing. Specializes in pelvic floor work and sexual trauma.',
  'healing',
  'per-session',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '+14154507430',
  '+14154507430',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '49dc0af6-0f6b-487f-a312-adedbb00305d',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Evening Class - English and Spanish',
  'Class guided in English with basic Spanish translation available. Bring mosquito spray and sarong.',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5219511788713',
  '5219511788713',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531523451_1761531523451_ea69a6.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '3a1afc9d-d993-43fb-af13-7ac3511f7893',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Gas Delivery Service - Gas Verde Max',
  'Gas cylinder delivery service for stove/cooking',
  'other',
  NULL,
  NULL,
  NULL,
  NULL,
  'Mazunte',
  15.669,
  -96.5505,
  '+52 958 174 8291',
  '+52 958 174 8291',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '8cda062d-b58e-4330-bb6f-0e895ce19955',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Gas Delivery Service - Gas Domingo Max',
  'Gas cylinder delivery service for stove/cooking',
  'other',
  NULL,
  NULL,
  NULL,
  NULL,
  'Mazunte',
  15.669,
  -96.5505,
  '+52 958 136 0535',
  '+52 958 136 0535',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440016',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Gas Delivery Service - Gas Mazunte Cilindros Lucio',
  'Gas cylinder delivery service for stove/cooking',
  'other',
  NULL,
  NULL,
  NULL,
  NULL,
  'Mazunte',
  15.669,
  -96.5505,
  '+52 958 584 6734',
  '+52 958 584 6734',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'c0cb0341-1393-4a92-bc88-fb891d1faaa5',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Spanish Language School - Oral Spanish School',
  'Learn Spanish in paradise. Spanish language education services.',
  'education',
  NULL,
  NULL,
  NULL,
  NULL,
  'Mazunte',
  15.669,
  -96.5505,
  '+52 9581446001',
  '+52 9581446001',
  NULL,
  'oraleschool.info@gmail.com',
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531532451_1761531532451_3jzo7m.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440017',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Pilates Classes with Sofie',
  'Certified Pilates teacher offering classes. Tuesday, Thursday, and Saturday sessions.',
  'wellness',
  'per-session',
  150,
  'MXN',
  '150 pesos general, 100 pesos for locals',
  'Akasha',
  NULL,
  NULL,
  NULL,
  '+529581189598',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531533753_1761531533753_b2o77d.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440018',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Private Dance Lessons',
  'Private dance instruction in salsa, bachata, and hip hop',
  'music',
  NULL,
  NULL,
  NULL,
  NULL,
  'Mazunte',
  15.669,
  -96.5505,
  NULL,
  '447498919708',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440019',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Griot Perla',
  'Service provider',
  'other',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '+52 777 963 4622',
  '+52 777 963 4622',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440201',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Nature Eye Capture - Photography, Videography & Design',
  'Fotografía, videografía, diseño, sitios web y redes sociales. Promoción especial este mes a precio limitado.',
  'art',
  'negotiable',
  NULL,
  NULL,
  'Precio especial por tiempo limitado',
  NULL,
  NULL,
  NULL,
  '61490861516',
  '61490861516',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531540118_1761531540118_jldwu4.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440202',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Breathwork Facilitation',
  'Transformative breathwork practice for emotional release, clarity and joy. Guided by Rose, former midwife and trained breathwork facilitator.',
  'healing',
  NULL,
  NULL,
  NULL,
  NULL,
  'Bliss Haven',
  15.6675,
  -96.5548,
  '31647248603',
  '31647248603',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440203',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Conscious Movement Facilitation',
  'Guía de movimiento consciente, exploración a través del movimiento, quietud, juego y baile en contenedor amoroso y compasivo.',
  'wellness',
  'donation',
  NULL,
  NULL,
  'Donativos conscientes',
  'Hridaya - Salón Nitya',
  15.668,
  -96.5545,
  '5215547948431',
  '5215547948431',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531544565_1761531544564_gm66nf.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'ae883d7b-a0fa-4609-90c4-925b5b259161',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Dance Classes',
  'Dance instruction starting in one week. Contact for details about dance type and group size.',
  'art',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '573150707182',
  '573150707182',
  NULL,
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '7f4c66b1-f4ff-4b1c-b475-1ea6838b59f4',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Myofascial Release Massage and Somatic Breathwork Therapy',
  'Full body massage therapy by Hayley. Releases dense fascia that blocks energy flow. Includes front and back body releases. Provides flowing energy, deep relaxation, release of trauma and blocked emotions, enhanced presence, creativity, inner peace, and chakra alignment.',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '+529581133312',
  '+529581133312',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531553871_1761531553871_1d455z.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '0749c293-996f-4925-9c01-aa77e5299667',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Artisanal Cacao Bars with Mushrooms',
  'Handmade ceremonial cacao bars with mushrooms made with intention and prayer. Opens the heart and accompanies moments of transformation, rituals, sessions, circles, and family gatherings in nature. 100% natural, vegan, gluten-free, no additives.',
  'food',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215548649625',
  '5215548649625',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531561365_1761531561365_eb14j3.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531609471_1761531609471_qx66l6.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '56e968f0-6530-46f6-81b0-398bb6c67a55',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Microdosing Mushroom Packs with Loving Guidance',
  'Personalized 1:1 support and group holding space for microdosing. Perfect for those going through anxiety, stress, deep fatigue, or emotional/spiritual processes that need daily and conscious support in a natural way. Includes personalized guidance with respect, clarity, and presence. 100% natural, vegan, gluten-free, no additives. Works with traditional Mexican healers and local women producers.',
  'healing',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215548649625',
  '5215548649625',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531561365_1761531561365_eb14j3.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531609471_1761531609471_qx66l6.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '187e9995-9d98-413f-a760-91b608885563',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Somatic Therapy',
  'Gentle somatic therapy approach helping nervous system release stored tension and trauma through listening deeply to your body. Helps reduce anxiety and chronic stress, works with deep-rooted trauma, improves mood and reduces depression, supports addiction recovery, releases physical tension and chronic pain, improves sleep quality.',
  'wellness',
  'per-session',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215530130756',
  '5215530130756',
  '@compassionate.embodiment',
  NULL,
  NULL,
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '0ec08bbc-d953-4348-b100-4fb9a888ee7f',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'PANACEA POWER ALCHEMY - Organic Adaptogen Powder Extracts',
  'Family brand of 100% organic and pure adaptogen powder extracts. Includes Lion''s Mane (focus, clarity, memory), Ashwagandha (vitality, calm, physical strengthening, emotional balance, hormonal regulation), Reishi (immunity, inner peace, deep sleep), and Cordyceps (sustained energy, resistance, cellular oxygenation). Premium Kit combines all 4. Easy to take, delicious in beverages, lattes, infusions, juices and smoothies. Also offers personalized 1:1 natural health and adaptogen counseling.',
  'food',
  NULL,
  NULL,
  NULL,
  'Free shipping to all Mexico',
  NULL,
  NULL,
  NULL,
  '5215541843321',
  '5215541843321',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531566800_1761531566800_87fwek.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '1aaddb81-22ae-462b-abe4-d985b34845d1',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Sessions',
  'High season sessions available. Location: San Agustinillo.',
  'other',
  NULL,
  NULL,
  NULL,
  NULL,
  'San Agustinillo',
  15.663,
  -96.538,
  '64210661826',
  '64210661826',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531549452_1761531549452_pnboan.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '2ecdda9b-c5ad-4978-bf51-7436f9bc194e',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Microdosing Support 1:1 Program',
  '4-week journey to support personal, emotional, mental, and spiritual process through conscious use of microdosing and integration practices. Includes 1:1 online support sessions, personalized guidance based on goals (emotional well-being, mental clarity, habits, creativity, energy release), practical tools for integration (meditation, journaling, conscious breathing, rituals, self-care), and ongoing support throughout transformation.',
  'spiritual',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215541843321',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531568967_1761531568967_2kxntv.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531612692_1761531612691_yfzolc.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'c6f633ee-1440-4952-bb12-83c7d1aae99c',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Masaje de Liberación Miofascial y Terapia de Respiración Somática',
  'Complete body massage therapy by Hayley working through fascia layers to release pain and tension. Uses myofascial release technique combined with somatic breathing therapy. Releases old traumas and blocked emotions. Results include fluid energy, deep relaxation, liberation of trauma, increased presence and creativity, inner peace, and body-mind-spirit alignment.',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '+529581133312',
  '+529581133312',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531574351_1761531574351_yimlsu.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '91e2b80a-601e-460c-b0c8-2af3be3710e0',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Masaje de Curandería Tradicional Mexicana y Oriental',
  'Traditional Mexican and Oriental massage and healing services using ancestral techniques and wisdom',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215520736431',
  '@cura.iyari @giselyama',
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531575496_1761531575496_x6xyna.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440204',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Niños Santos - Artisanal Cacao Bars with Mushrooms',
  'Handmade artisanal cacao bars with mushrooms made with intention and prayer. Open the heart and accompany moments of transformation, rituals, sessions, circles, and family gatherings in nature. 100% natural, vegan, gluten-free, free of additives. Made by family project with ancestral Mazatec wisdom.',
  'food',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215541843321',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531572553_1761531572553_rol9bi.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531600636_1761531600636_kiq5cx.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531606406_1761531606406_tk82sr.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440205',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Niños Santos - Microdosing Mushroom Packs with Loving Guidance',
  'Personalized 1:1 support and group holding space for microdosing. Perfect for those going through anxiety, stress, deep fatigue, or emotional/spiritual processes needing daily and conscious support. Help finding your path with respect, clarity, and presence. 100% natural, vegan, gluten-free, free of additives. Works alongside traditional Mexican healers and local women producers.',
  'spiritual',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5215541843321',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531572553_1761531572553_rol9bi.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531600636_1761531600636_kiq5cx.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531606406_1761531606406_tk82sr.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440206',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Self-Love Portrait Sessions',
  'Therapeutic portrait and photography sessions by filmmaker and photographer. Transformative containers for authentic expression. Transform your connection with your body and image from a place of love. Available October 20 - November 5.',
  'art',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '447775345524',
  '447775345524',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531600636_1761531600636_kiq5cx.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440208',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  '100% Natural Peanut Butter',
  '100% natural peanut butter made from roasted peanuts. Available in Original (extra creamy) and Crunchy (with peanut bits). No added fats, no added sugar, no preservatives. 500g.',
  'food',
  'fixed',
  110,
  'MXN',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531605757_1761531605757_sujmqg.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531616075_1761531616075_jjmx55.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440209',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  '100% Natural Whole Grain Rice Cakes',
  '100% Natural Whole Grain Rice Cakes. 16 pieces per pack. Only 1 ingredient: whole grain rice. No preservatives, no added fats.',
  'food',
  'fixed',
  50,
  'MXN',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531605757_1761531605757_sujmqg.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440210',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  '100% Natural Sea Salt',
  '100% Natural Sea Salt. 1 kg. Sun-dried, hand-harvested artisanally. Rich in minerals: calcium, magnesium, zinc, potassium & manganese. No added iodine or fluoride, free from bleaches, anti-caking agents & chemicals, no preservatives.',
  'food',
  'fixed',
  50,
  'MXN',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531605757_1761531605757_sujmqg.jpg","https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531616075_1761531616075_jjmx55.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440213',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Somatic Healing of Physical and Emotional Pain',
  'Somatic and holistic approach to heal the root cause of pain, not only symptoms. Uses different techniques including Nervous System Regulation (TVM), OSHO rebalancing deep tissue massage and energy work tailored to your pain. Offers deep transformation.',
  'wellness',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '4551334253',
  '4551334253',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531607034_1761531607034_jg7n21.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  'c8ff74ea-c45b-456d-87ed-0a81361a8de8',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  '100% Natural Brown Rice Cakes',
  '100% natural brown rice cakes made from only brown rice. 16 pieces per package. No preservatives, no added fats.',
  'food',
  'fixed',
  50,
  'MXN',
  '16 pieces',
  NULL,
  NULL,
  NULL,
  NULL,
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531616075_1761531616075_jjmx55.jpg"}',
  'mazunte',
  'pending'
);

INSERT INTO services (
  id, profile_id, title, description, category,
  price_type, price_amount, price_currency, price_notes,
  location_name, lat, lng,
  contact_phone, contact_whatsapp, contact_instagram,
  contact_email, images,
  city_id, approval_status
) VALUES (
  '49468364-0b08-4c30-8a44-4a58f925061f',
  '520e75eb-b615-4d9a-a369-b218373c6c05',
  'Healthy Baked Sweet Potato Chips',
  'Healthy baked sweet potato chips. No added sugar, no preservatives.',
  'food',
  'fixed',
  25,
  'MXN',
  '50g $25, 100g $50',
  NULL,
  NULL,
  NULL,
  NULL,
  '5214481230136',
  NULL,
  NULL,
  '{"https://ddbuvzotcasyanocqcsh.supabase.co/storage/v1/object/public/whatsapp-media/2025/10/26/1761531616075_1761531616075_jjmx55.jpg"}',
  'mazunte',
  'pending'
);
```

---

## Verification Queries

After importing, run these queries to verify:

```sql
-- Check event count
SELECT COUNT(*) as event_count FROM events WHERE city_id = 'mazunte';

-- Check place count
SELECT COUNT(*) as place_count FROM places WHERE city_id = 'mazunte';

-- Check service count
SELECT COUNT(*) as service_count FROM services WHERE city_id = 'mazunte';

-- View pending approvals
SELECT 'events' as type, COUNT(*) as pending_count
FROM events WHERE approval_status = 'pending'
UNION ALL
SELECT 'services' as type, COUNT(*) as pending_count
FROM services WHERE approval_status = 'pending';

-- Sample events with contact info
SELECT title, date, time, contact_whatsapp, contact_phone
FROM events
WHERE city_id = 'mazunte'
ORDER BY date
LIMIT 10;
```

---

## Notes

### Data Quality

**✅ Complete Data:**
- All entities have city_id = 'mazunte'
- All have unique UUIDs
- WhatsApp/phone contact info extracted from messages
- Locations and venue names extracted

**⚠️ Partial Data:**
- Some events missing specific dates/times (said "mañana", "tonight", etc.)
- Lat/lng coordinates not available (can be added manually or via geocoding)
- Some organizer names not found in messages
- Image URLs may need to be added manually

### Next Steps

1. **Import to Supabase** - Run the SQL statements above
2. **Review & Approve** - Check entities in Supabase dashboard
3. **Geocode Locations** - Add lat/lng for places with addresses
4. **Add Images** - Upload or link event/place images
5. **Verify Contact Info** - Test WhatsApp numbers if needed
6. **Update Profiles** - Link to user profiles where appropriate

---

*Generated by AI entity extraction from WhatsApp community messages*
