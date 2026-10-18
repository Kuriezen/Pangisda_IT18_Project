# Pangisda – REST API Design (frontend ↔ backend contract)

Base URL: `/api` (configurable with `NUXT_PUBLIC_API_BASE`).
<<<<<<< HEAD
**Mocked** = already working in this project through the mock API (`/server/api`). **Planned** = designed now, built for the Final.
=======
**Built** = working in this project (`/server/api`, backed by PostgreSQL). **Planned** = designed now, built for the Final.
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

## Response format

Success:
```json
{ "success": true, "data": { }, "meta": { "total": 8 } }
```
Error:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Please check the highlighted fields.", "details": { "weight_kg": "Weight must be greater than 0 and at most 500 kg." } } }
```
Status codes: `200` OK · `201` Created · `401` not logged in · `403` wrong role · `404` not found · `409` conflict · `422` validation error · `500` server error.

## Authentication

<<<<<<< HEAD
- **JWT bearer token.** Sent as `Authorization: Bearer <token>`. The mock issues `mock.<userId>.<stamp>` tokens; the real backend will sign JWTs that expire after 7 days.
=======
- **JWT bearer token.** Sent as `Authorization: Bearer <token>`. Tokens are JWTs signed with `JWT_SECRET` that expire after 7 days. Passwords are stored as bcrypt hashes.
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
- **Roles:** `guest` (not logged in), `angler`, `admin`.

## Endpoints

| Method | Endpoint | Description | Access | Used by screen | Status |
|---|---|---|---|---|---|
<<<<<<< HEAD
| POST | /api/auth/register | Create an angler account, return token + user | Public | Register | Mocked |
| POST | /api/auth/login | Log in with email + password, return token + user | Public | Login | Mocked |
| GET | /api/auth/me | Current user's profile | Angler, Admin | Session check on app start (Final) | Mocked |
| POST | /api/auth/logout | Invalidate the token | Angler, Admin | Header → Log out | Planned |
| GET | /api/spots?q=&water_type=&province= | List spots with species and catch counts | Public | Home, Fishing Spots, Log a Catch | Mocked |
| GET | /api/spots/:id | Spot details, species found there, creator | Public | Spot Details | Mocked |
| POST | /api/spots | Add a spot | Admin | Manage Spots | Mocked |
| PUT | /api/spots/:id | Update a spot | Admin | Manage Spots | Mocked |
| DELETE | /api/spots/:id | Delete a spot (409 if it has catches) | Admin | Manage Spots | Mocked |
| GET | /api/species | List all species | Public | Catch Feed, Log a Catch | Mocked |
| POST | /api/species | Add a species | Admin | Manage Species (Final) | Planned |
| PUT | /api/species/:id | Update a species | Admin | Manage Species (Final) | Planned |
| DELETE | /api/species/:id | Delete a species | Admin | Manage Species (Final) | Planned |
| GET | /api/catches?spot_id=&user_id=&species_id= | List catches, newest first, with user/spot/species | Public | Home, Catch Feed, Spot Details, My Catches | Mocked |
| GET | /api/catches/:id | One catch | Public | Catch detail (Final) | Mocked |
| POST | /api/catches | Log a catch | Angler, Admin | Log a Catch | Mocked |
| PUT | /api/catches/:id | Edit own catch | Owner, Admin | Edit Catch (Final) | Planned |
| DELETE | /api/catches/:id | Delete own catch (admin: any) | Owner, Admin | My Catches | Mocked |
| GET | /api/users/me/favorites | My saved spots | Angler, Admin | My Catches → Saved spots | Planned |
| POST | /api/users/me/favorites | Save a spot `{ spot_id }` | Angler, Admin | Spot card, Spot Details | Planned |
| DELETE | /api/users/me/favorites/:spotId | Unsave a spot | Angler, Admin | Spot card, Spot Details | Planned |
| GET | /api/stats/summary | Totals for the home page | Public | Home | Mocked |
=======
| POST | /api/auth/register | Create an angler account, return token + user | Public | Register | Built |
| POST | /api/auth/login | Log in with email + password, return token + user | Public | Login | Built |
| GET | /api/auth/me | Current user's profile | Angler, Admin | Session check on app start (Final) | Built |
| POST | /api/auth/logout | Invalidate the token | Angler, Admin | Header → Log out | Planned |
| GET | /api/spots?q=&water_type=&province= | List spots with species and catch counts | Public | Home, Fishing Spots, Log a Catch | Built |
| GET | /api/spots/:id | Spot details, species found there, creator | Public | Spot Details | Built |
| POST | /api/spots | Add a spot | Admin | Manage Spots | Built |
| PUT | /api/spots/:id | Update a spot | Admin | Manage Spots | Built |
| DELETE | /api/spots/:id | Delete a spot (409 if it has catches) | Admin | Manage Spots | Built |
| GET | /api/species | List all species | Public | Catch Feed, Log a Catch | Built |
| POST | /api/species | Add a species | Admin | Manage Species (Final) | Planned |
| PUT | /api/species/:id | Update a species | Admin | Manage Species (Final) | Planned |
| DELETE | /api/species/:id | Delete a species | Admin | Manage Species (Final) | Planned |
| GET | /api/catches?spot_id=&user_id=&species_id= | List catches, newest first, with user/spot/species | Public | Home, Catch Feed, Spot Details, My Catches | Built |
| GET | /api/catches/:id | One catch | Public | Catch detail (Final) | Built |
| POST | /api/catches | Log a catch | Angler, Admin | Log a Catch | Built |
| PUT | /api/catches/:id | Edit own catch | Owner, Admin | Edit Catch (Final) | Planned |
| DELETE | /api/catches/:id | Delete own catch (admin: any) | Owner, Admin | My Catches | Built |
| GET | /api/users/me/favorites | My saved spots | Angler, Admin | My Catches → Saved spots | Planned |
| POST | /api/users/me/favorites | Save a spot `{ spot_id }` | Angler, Admin | Spot card, Spot Details | Planned |
| DELETE | /api/users/me/favorites/:spotId | Unsave a spot | Angler, Admin | Spot card, Spot Details | Planned |
| GET | /api/stats/summary | Totals for the home page | Public | Home | Built |
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

## Sample: log a catch

**Request**
```http
POST /api/catches
Authorization: Bearer <token>
Content-Type: application/json

{
  "spot_id": 3,
  "species_id": 6,
  "weight_kg": 1.8,
  "length_cm": 42,
  "caught_at": "2026-10-10",
  "method": "rod_and_reel",
  "bait": "Corn dough",
  "released": true,
  "notes": "Hit right at sunrise."
}
```

**201 Created**
```json
{
  "success": true,
  "data": {
    "id": 15, "user_id": 2, "spot_id": 3, "species_id": 6,
    "weight_kg": 1.8, "length_cm": 42, "caught_at": "2026-10-10",
    "method": "rod_and_reel", "bait": "Corn dough", "released": true,
    "notes": "Hit right at sunrise.", "created_at": "2026-10-12T13:30:00.000Z",
    "user": { "id": 2, "full_name": "Owen", "username": "owen" },
    "spot": { "id": 3, "name": "Agusan Marsh", "province": "Agusan del Sur", "water_type": "freshwater" },
    "species": { "id": 6, "common_name": "Common carp", "local_name": "Karpa", "is_protected": false, "image_url": "/fish/cyprinus-carpio.jpg" }
  }
}
```

**422 Validation error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "details": { "weight_kg": "Weight must be greater than 0 and at most 500 kg.", "caught_at": "Date caught cannot be in the future." }
  }
}
```

**401 Not logged in**
```json
{ "success": false, "error": { "code": "UNAUTHENTICATED", "message": "Please log in to log a catch." } }
```
