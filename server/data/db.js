/**
 * Sample data loaded into PostgreSQL by `npm run db:setup` (server/database/setup.js).
 *
 * Every array below mirrors one table of the database (see docs/ERD.md and
 * server/database/schema.sql). The API routes read from PostgreSQL, not from here.
 * Spot details are sample data for academic use only.
 */

export const FISHING_METHODS = ['rod_and_reel', 'handline', 'fly_fishing', 'spearfishing', 'cast_net']
export const WATER_TYPES = ['saltwater', 'freshwater', 'brackish']

// users  (plain-text sample passwords; setup.js stores only their bcrypt hashes)
export const users = [
  { id: 1, full_name: 'Pangisda Admin', username: 'admin', email: 'admin@pangisda.ph', password: 'Admin1234', role: 'admin', created_at: '2026-08-01T08:00:00+08:00' },
  { id: 2, full_name: 'Owen', username: 'owen', email: 'owen@pangisda.ph', password: 'Angler1234', role: 'angler', created_at: '2026-08-03T09:15:00+08:00' },
  { id: 3, full_name: 'Maria Santos', username: 'mariafishes', email: 'maria@pangisda.ph', password: 'Angler1234', role: 'angler', created_at: '2026-08-10T14:20:00+08:00' },
  { id: 4, full_name: 'Carlo Reyes', username: 'carlo_r', email: 'carlo@pangisda.ph', password: 'Angler1234', role: 'angler', created_at: '2026-08-21T18:45:00+08:00' },
]

// species
export const species = [
  { id: 1, common_name: 'Nile tilapia', local_name: 'Tilapia', scientific_name: 'Oreochromis niloticus', habitat: 'freshwater', is_protected: false, conservation_note: null, image_url: '/fish/oreochromis-niloticus.jpg', image_credit: 'Germano Roberto Schüür, CC BY-SA 4.0 via Wikimedia Commons' },
  { id: 2, common_name: 'Milkfish', local_name: 'Bangus', scientific_name: 'Chanos chanos', habitat: 'brackish', is_protected: false, conservation_note: null, image_url: '/fish/chanos-chanos.jpg', image_credit: 'Elisabeth Morcel, CC BY-SA 4.0 via Wikimedia Commons' },
  { id: 3, common_name: 'Humphead wrasse', local_name: 'Mameng', scientific_name: 'Cheilinus undulatus', habitat: 'saltwater', is_protected: true, conservation_note: 'Listed as Endangered and protected by law in the Philippines. Please release.', image_url: '/fish/cheilinus-undulatus.jpg', image_credit: 'Julien Bidet for MDC Seamarc, CC BY-SA 4.0 via Wikimedia Commons' },
  { id: 4, common_name: 'Striped snakehead', local_name: 'Dalag', scientific_name: 'Channa striata', habitat: 'freshwater', is_protected: false, conservation_note: null, image_url: '/fish/channa-striata.jpg', image_credit: 'Wie146, CC BY-SA 3.0 via Wikimedia Commons' },
  { id: 5, common_name: 'Giant mottled eel', local_name: 'Kasili', scientific_name: 'Anguilla marmorata', habitat: 'freshwater', is_protected: false, conservation_note: 'Eel stocks are declining. Release small eels.', image_url: '/fish/anguilla-marmorata.jpg', image_credit: 'ふうけ, CC BY-SA 3.0 via Wikimedia Commons' },
  { id: 6, common_name: 'Common carp', local_name: 'Karpa', scientific_name: 'Cyprinus carpio', habitat: 'freshwater', is_protected: false, conservation_note: null, image_url: '/fish/cyprinus-carpio.jpg', image_credit: 'George Chernilevsky, CC BY-SA 3.0 via Wikimedia Commons' },
  { id: 7, common_name: 'Giant trevally', local_name: 'Talakitok', scientific_name: 'Caranx ignobilis', habitat: 'saltwater', is_protected: false, conservation_note: null, image_url: '/fish/caranx-ignobilis.jpg', image_credit: 'Dwayne Meadows, NOAA/NMFS/OPR, public domain via Wikimedia Commons' },
  { id: 8, common_name: 'Orange-spotted grouper', local_name: 'Lapu-lapu', scientific_name: 'Epinephelus coioides', habitat: 'saltwater', is_protected: false, conservation_note: 'Slow to mature. Release undersized fish.', image_url: '/fish/epinephelus-coioides.jpg', image_credit: 'Sahat Ratmuangkhwang, CC BY 3.0 via Wikimedia Commons' },
  { id: 9, common_name: 'Mangrove red snapper', local_name: 'Maya-maya', scientific_name: 'Lutjanus argentimaculatus', habitat: 'saltwater', is_protected: false, conservation_note: null, image_url: '/fish/lutjanus-argentimaculatus.png', image_credit: '呂一起 (Lu i-chi), CC BY 4.0 via Wikimedia Commons' },
  { id: 10, common_name: 'Narrow-barred Spanish mackerel', local_name: 'Tanigue', scientific_name: 'Scomberomorus commerson', habitat: 'saltwater', is_protected: false, conservation_note: null, image_url: '/fish/scomberomorus-commerson.jpg', image_credit: 'ppericard, CC BY 4.0 via Wikimedia Commons' },
  { id: 11, common_name: 'Frigate tuna', local_name: 'Tulingan', scientific_name: 'Auxis thazard', habitat: 'saltwater', is_protected: false, conservation_note: null, image_url: '/fish/auxis-thazard.jpg', image_credit: 'Shrumster, CC BY-SA 3.0 via Wikimedia Commons' },
]

// fishing_spots
export const spots = [
  { id: 1, name: 'Lake Mainit (Jabonga shore)', municipality: 'Jabonga', province: 'Agusan del Norte', water_type: 'freshwater', latitude: 9.3640, longitude: 125.5240, best_time: 'Early morning, Nov–Mar', access_level: 'easy', description: 'One of the deepest lakes in the country, shared by Agusan del Norte and Surigao del Norte. Shore anglers target tilapia, dalag and kasili from the Jabonga side.', created_by: 1, created_at: '2026-08-01T08:30:00+08:00' },
  { id: 2, name: 'Agusan River (Butuan riverside)', municipality: 'Butuan City', province: 'Agusan del Norte', water_type: 'freshwater', latitude: 8.9480, longitude: 125.5430, best_time: 'Late afternoon, all year', access_level: 'easy', description: 'One of the longest rivers in the country runs right through Butuan. Shore anglers fish the city riverbanks for tilapia and kasili. Watch the current after heavy rain.', created_by: 1, created_at: '2026-08-01T08:35:00+08:00' },
  { id: 3, name: 'Agusan Marsh', municipality: 'Bunawan', province: 'Agusan del Sur', water_type: 'freshwater', latitude: 8.1800, longitude: 125.9300, best_time: 'Dawn and dusk, Oct–Feb', access_level: 'hard', description: 'A vast wetland of lakes and swamp forest and a protected wildlife sanctuary. Fish only where local guides allow and respect the floating communities.', created_by: 1, created_at: '2026-08-01T08:40:00+08:00' },
  { id: 4, name: 'Masao Beach', municipality: 'Butuan City', province: 'Agusan del Norte', water_type: 'saltwater', latitude: 9.0050, longitude: 125.5000, best_time: 'Rising tide, Dec–May', access_level: 'easy', description: 'Butuan\'s beach on Butuan Bay. Cast from the shore on a rising tide for trevally and grouper. Stay clear of swimmers on weekends.', created_by: 1, created_at: '2026-08-01T08:45:00+08:00' },
  { id: 5, name: 'Nasipit Port Breakwater', municipality: 'Nasipit', province: 'Agusan del Norte', water_type: 'saltwater', latitude: 8.9880, longitude: 125.3380, best_time: 'Night tides, Nov–Apr', access_level: 'easy', description: 'A popular breakwater for night fishing. Trevally and snapper patrol the rocks at high tide. Keep away from docking vessels.', created_by: 1, created_at: '2026-08-01T08:50:00+08:00' },
  { id: 6, name: 'Butuan Bay Reef Edge', municipality: 'Buenavista', province: 'Agusan del Norte', water_type: 'saltwater', latitude: 9.0400, longitude: 125.4000, best_time: 'Morning, Mar–May', access_level: 'hard', description: 'Boat access only. Pelagic species like tanigue and tulingan pass along the reef edge during the dry season. Respect marine sanctuary boundaries.', created_by: 1, created_at: '2026-08-01T08:55:00+08:00' },
  { id: 7, name: 'Magallanes Mangrove Channels', municipality: 'Magallanes', province: 'Agusan del Norte', water_type: 'brackish', latitude: 9.0230, longitude: 125.5200, best_time: 'Outgoing tide, all year', access_level: 'moderate', description: 'Brackish channels and mangroves at the mouth of the Agusan River. Hire a local bangkero for the best channels.', created_by: 1, created_at: '2026-08-01T09:00:00+08:00' },
  { id: 8, name: 'Tubay River', municipality: 'Tubay', province: 'Agusan del Norte', water_type: 'freshwater', latitude: 9.1650, longitude: 125.5300, best_time: 'Morning, Jun–Jan', access_level: 'moderate', description: 'A quiet river with weedy banks upstream of the town. Good for tilapia and dalag along slow bends.', created_by: 1, created_at: '2026-08-01T09:05:00+08:00' },
]

// spot_species (junction table: which species are found at which spot)
export const spotSpecies = [
  { spot_id: 1, species_id: 1 }, { spot_id: 1, species_id: 4 }, { spot_id: 1, species_id: 5 },
  { spot_id: 2, species_id: 1 }, { spot_id: 2, species_id: 4 }, { spot_id: 2, species_id: 5 },
  { spot_id: 3, species_id: 6 }, { spot_id: 3, species_id: 1 },
  { spot_id: 4, species_id: 7 }, { spot_id: 4, species_id: 8 }, { spot_id: 4, species_id: 11 },
  { spot_id: 5, species_id: 7 }, { spot_id: 5, species_id: 9 }, { spot_id: 5, species_id: 10 },
  { spot_id: 6, species_id: 10 }, { spot_id: 6, species_id: 11 }, { spot_id: 6, species_id: 8 }, { spot_id: 6, species_id: 3 },
  { spot_id: 7, species_id: 2 }, { spot_id: 7, species_id: 9 },
  { spot_id: 8, species_id: 1 }, { spot_id: 8, species_id: 4 },
]

// catches
export const catches = [
  { id: 1, user_id: 2, spot_id: 3, species_id: 6, weight_kg: 1.8, length_cm: 42, caught_at: '2026-10-10', method: 'rod_and_reel', bait: 'Corn dough', released: true, notes: 'Took the bait right at sunrise near the lake edge.', created_at: '2026-10-10T07:12:00+08:00' },
  { id: 2, user_id: 3, spot_id: 5, species_id: 7, weight_kg: 4.2, length_cm: 61, caught_at: '2026-10-09', method: 'rod_and_reel', bait: 'Metal jig', released: true, notes: 'Strong run, took about 10 minutes to land.', created_at: '2026-10-09T22:40:00+08:00' },
  { id: 3, user_id: 4, spot_id: 2, species_id: 1, weight_kg: 0.6, length_cm: 28, caught_at: '2026-10-08', method: 'handline', bait: 'Bread dough', released: false, notes: null, created_at: '2026-10-08T17:05:00+08:00' },
  { id: 4, user_id: 2, spot_id: 6, species_id: 3, weight_kg: 3.5, length_cm: 55, caught_at: '2026-10-06', method: 'handline', bait: 'Live shrimp', released: true, notes: 'Mameng! Released right away.', created_at: '2026-10-06T06:30:00+08:00' },
  { id: 5, user_id: 3, spot_id: 7, species_id: 2, weight_kg: 1.1, length_cm: 45, caught_at: '2026-10-05', method: 'cast_net', bait: null, released: false, notes: 'Escaped from a nearby fishpond, according to the bangkero.', created_at: '2026-10-05T10:20:00+08:00' },
  { id: 6, user_id: 4, spot_id: 4, species_id: 8, weight_kg: 2.3, length_cm: 48, caught_at: '2026-10-03', method: 'rod_and_reel', bait: 'Live sardine', released: false, notes: null, created_at: '2026-10-03T15:45:00+08:00' },
  { id: 7, user_id: 2, spot_id: 8, species_id: 4, weight_kg: 1.4, length_cm: 50, caught_at: '2026-09-28', method: 'rod_and_reel', bait: 'Frog lure', released: true, notes: 'Weedy bend upstream of the bridge.', created_at: '2026-09-28T08:10:00+08:00' },
  { id: 8, user_id: 3, spot_id: 6, species_id: 10, weight_kg: 6.5, length_cm: 92, caught_at: '2026-09-25', method: 'rod_and_reel', bait: 'Trolling lure', released: false, notes: 'Personal best tanigue!', created_at: '2026-09-25T09:00:00+08:00' },
  { id: 9, user_id: 4, spot_id: 5, species_id: 9, weight_kg: 1.9, length_cm: 46, caught_at: '2026-09-22', method: 'handline', bait: 'Squid strip', released: false, notes: null, created_at: '2026-09-22T23:30:00+08:00' },
  { id: 10, user_id: 2, spot_id: 2, species_id: 5, weight_kg: 0.9, length_cm: 38, caught_at: '2026-09-18', method: 'rod_and_reel', bait: 'Chicken liver', released: true, notes: null, created_at: '2026-09-18T18:15:00+08:00' },
  { id: 11, user_id: 3, spot_id: 3, species_id: 6, weight_kg: 2.6, length_cm: 49, caught_at: '2026-09-14', method: 'rod_and_reel', bait: 'Bread dough', released: true, notes: 'Picked up in the shallows near the reeds.', created_at: '2026-09-14T06:05:00+08:00' },
  { id: 12, user_id: 4, spot_id: 1, species_id: 1, weight_kg: 0.7, length_cm: 30, caught_at: '2026-09-10', method: 'handline', bait: 'Earthworm', released: false, notes: null, created_at: '2026-09-10T07:50:00+08:00' },
  { id: 13, user_id: 2, spot_id: 4, species_id: 11, weight_kg: 1.2, length_cm: 40, caught_at: '2026-09-06', method: 'rod_and_reel', bait: 'Small spoon', released: false, notes: null, created_at: '2026-09-06T16:25:00+08:00' },
  { id: 14, user_id: 3, spot_id: 8, species_id: 1, weight_kg: 0.8, length_cm: 31, caught_at: '2026-08-30', method: 'rod_and_reel', bait: 'Corn kernel', released: true, notes: null, created_at: '2026-08-30T09:40:00+08:00' },
]

