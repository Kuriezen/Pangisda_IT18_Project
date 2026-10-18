# Pangisda – Fishing Spot Finder & Catch Log

ITE 18 Midterm Project · **Frontend track** · Soreño & Alvar

Pangisda helps anglers in Butuan and the Agusan area find fishing spots, log their catches, and practice responsible catch-and-release.
<<<<<<< HEAD
It is built with **Nuxt 4 (Vue 3)** and **Pinia**, and reads data from a **mock REST API** whose shape matches the planned database (`docs/ERD.md`) and API contract (`docs/API.md`).

## Run it

Requirements: **Node.js 20 or newer** (`node -v`).

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test on your phone, run `npm run dev -- --host` and open the "Network" address on a phone connected to the same Wi-Fi.

### Demo accounts (mock API)
=======
It is built with **Nuxt 4 (Vue 3)** and **Pinia**, with a REST API (Nuxt server routes) backed by **PostgreSQL**. The database design is in `docs/ERD.md` and the API contract in `docs/API.md`.

## Run it

Requirements: **Node.js 20.12 or newer** (`node -v`) and a **PostgreSQL** database (installed locally, or a free hosted one from Neon, Supabase or Render).

```bash
npm install
cp .env.example .env      # then put your DATABASE_URL and JWT_SECRET in .env
npm run db:setup          # creates the tables and loads the sample data
npm run dev
```

`npm run db:setup` drops and recreates every table, so run it again whenever you want to reset to the sample data.

Open http://localhost:3000. To test on your phone, run `npm run dev -- --host` and open the "Network" address on a phone connected to the same Wi-Fi.

### Demo accounts (sample data)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

| Role | Email | Password |
|---|---|---|
| Angler | owen@pangisda.ph | Angler1234 |
| Admin | admin@pangisda.ph | Admin1234 |

<<<<<<< HEAD
The login page has buttons that fill these in. Data lives in memory, so anything you add resets when the dev server restarts.
=======
The login page has buttons that fill these in. Passwords are stored as bcrypt hashes. Anything you add is saved in PostgreSQL.
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

## Screens and routes

| Route | Screen | Access |
|---|---|---|
| `/` | Home: hero, community stats, popular spots, latest catches | Everyone |
| `/spots` | Fishing spots with search and water-type/province filters | Everyone |
| `/spots/:id` | Spot details, species found there (protected species flagged), catches at the spot | Everyone |
| `/catches` | Community catch feed with species/water filters, sorting, "released only" | Everyone |
| `/catches/new` | **Log a catch** – the main validated form | Logged in |
| `/my-catches` | Personal stats, catch history (delete), saved spots | Logged in |
| `/admin/spots` | Add / edit / delete spots | Admin only |
| `/login`, `/register` | Authentication with validation | Guests only |
| anything else | Custom 404 page | – |

## How it meets the midterm requirements

| Requirement | Where |
|---|---|
| Component-based framework, layout, routing | Nuxt file-based routing in `app/pages`, shared layout in `app/layouts/default.vue` |
| Reusable components | `app/components` (SpotCard, CatchCard, BaseInput, BaseSelect, StatTile, EmptyState, ErrorState, ToastHost, and more) |
| State management (Pinia) | `app/stores`: `auth` (session and role), `catches` (catch log, filters, stats: the core feature), `spots` (spots, filters, saved spots), `ui` (toasts) |
<<<<<<< HEAD
| Mock API integration | `server/api/*` (Nuxt server routes) and `server/data/db.js`. Consumed through `app/plugins/api.js` and `app/composables/useApi.js` |
=======
| API integration | `server/api/*` (Nuxt server routes) querying PostgreSQL through `server/utils/db.js`. Consumed through `app/plugins/api.js` and `app/composables/useApi.js` |
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
| Validation and error handling | `app/utils/validators.js` (client) and `server/utils/validation.js` (server). Errors appear per field, in a summary box with links, and through toasts, with loading and retry states |
| Responsive design | Mobile-first CSS with 640 / 768 / 1024 px breakpoints and a collapsible mobile menu |
| Accessibility | Skip link, labels on every input, `aria-invalid` and `aria-describedby` on errors, `aria-live` regions, visible focus rings, AA color contrast, keyboard-friendly menu (Esc closes it), reduced-motion support |
| Role-based UI | Guests see Log in/Sign up. Anglers get "My Catches" and "Log a catch". Admins also get "Manage Spots". Route middleware in `app/middleware` |
<<<<<<< HEAD
| Make way for ERD and API | `docs/ERD.md`, `docs/API.md`. Mock tables, columns and the response envelope match the design |

## Switching to the real backend (Final)

Set the API base URL and restart. No component code changes are needed:

```bash
NUXT_PUBLIC_API_BASE=https://your-backend.example.com/api npm run dev
```
=======
| Make way for ERD and API | `docs/ERD.md`, `docs/API.md`. `server/database/schema.sql` implements the ERD; responses follow the envelope in API.md |

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Hosted databases usually need `?sslmode=require` at the end |
| `JWT_SECRET` | In production | Secret for signing login tokens. A dev-only fallback is used under `npm run dev` |
| `NUXT_PUBLIC_API_BASE` | No | Point the frontend at a different API server. Defaults to this project's own `/api` |
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

## Project structure

```
app/
  assets/css/main.css    design tokens (colors, type, spacing) and shared styles
  components/            reusable UI components
  composables/useApi.js  API wrapper with friendly error messages
  layouts/default.vue    header, main, footer, toasts
  middleware/            auth, admin and guest route guards
  pages/                 one file per route
  plugins/api.js         configured $fetch client (base URL and auth header)
  stores/                Pinia stores
  utils/                 constants, formatters, validators
  error.vue              404 / error page
server/
<<<<<<< HEAD
  api/                   mock REST endpoints
  data/db.js             mock tables (users, fishing_spots, species, spot_species, catches)
=======
  api/                   REST endpoints (SQL queries against PostgreSQL)
  data/db.js             sample rows loaded by db:setup (users, fishing_spots, species, spot_species, catches)
  database/schema.sql    PostgreSQL tables, enum types, keys and constraints
  database/setup.js      npm run db:setup: creates the schema and loads the sample data
  utils/db.js            PostgreSQL connection pool (reads DATABASE_URL)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  utils/                 response helpers and server-side validation
docs/
  ERD.md                 database design and data dictionary
  API.md                 endpoint list, screen mapping, sample requests and responses
```

## Git workflow (both members must commit)

```bash
git init
git add .
git commit -m "chore: scaffold Nuxt 4 + Pinia project"
git branch -M main
git remote add origin https://github.com/<user>/pangisda.git
git push -u origin main
```

Work on feature branches (`feature/spots-page`, `feature/catch-form`, …), open pull requests, and merge into `main`. Use clear commit messages (`feat:`, `fix:`, `style:`, `docs:`).

## Credits and licenses

- Nuxt, Vue, Pinia: MIT License
- Plus Jakarta Sans font: SIL Open Font License 1.1 (Google Fonts)
- Icons and spot illustrations: drawn for this project as inline SVG
- Spot, species and catch records are **sample data** for academic purposes. Species information is based on public references (FishBase, IUCN Red List).

## Photo credits

Species photos in `public/fish/` come from Wikimedia Commons and are used under their original licenses:

| Species | Photo by | License |
| --- | --- | --- |
| Tilapia (*Oreochromis niloticus*) | Germano Roberto Schüür | CC BY-SA 4.0 |
| Bangus (*Chanos chanos*) | Elisabeth Morcel | CC BY-SA 4.0 |
| Mameng (*Cheilinus undulatus*) | Julien Bidet for MDC Seamarc | CC BY-SA 4.0 |
| Dalag (*Channa striata*) | Wie146 | CC BY-SA 3.0 |
| Kasili (*Anguilla marmorata*) | ふうけ | CC BY-SA 3.0 |
| Karpa (*Cyprinus carpio*) | George Chernilevsky | CC BY-SA 3.0 |
| Talakitok (*Caranx ignobilis*) | Dwayne Meadows, NOAA/NMFS/OPR | Public domain |
| Lapu-lapu (*Epinephelus coioides*) | Sahat Ratmuangkhwang | CC BY 3.0 |
| Maya-maya (*Lutjanus argentimaculatus*) | 呂一起 (Lu i-chi) | CC BY 4.0 |
| Tanigue (*Scomberomorus commerson*) | ppericard | CC BY 4.0 |
| Tulingan (*Auxis thazard*) | Shrumster | CC BY-SA 3.0 |
