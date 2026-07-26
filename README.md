# RestoFlow Frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for **RestoFlow** — SaaS restaurant QR-Menu, KDS, waiter station, and director dashboard.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default the app runs in **mock mode** (`NEXT_PUBLIC_USE_MOCK=true`) so every screen works without the Django backend.

## Docker

Production:

```bash
docker compose up --build -d
```

Dev (hot reload, `dev` profile):

```bash
docker compose --profile dev up --build frontend-dev
```

Env (build-time for production image):

```bash
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/orders/
FRONTEND_PORT=3000
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hub / entry |
| `/login` | Staff login |
| `/register` | Restaurant / staff registration |
| `/menu/[tableNumber]` | Guest QR menu (e.g. `/menu/5`) |
| `/kds` | Kitchen Display System |
| `/waiter` | Waiter station |
| `/director` | Director analytics dashboard |

## Architecture

```
src/
  app/                 # App Router pages
  components/
    menu/              # QR menu UI
    kds/               # Kitchen tickets
    waiter/            # Waiter board
    director/          # Dashboard widgets
    ui/                # Shared primitives
  hooks/               # useWebSocket, useOrders
  lib/                 # types, api client, mock data
  store/               # Zustand cart
```

### Data layer

- `src/lib/api.ts` — REST client. When mock is on, it mutates in-memory data and broadcasts local events.
- `src/hooks/useWebSocket.ts` — connects to `NEXT_PUBLIC_WS_URL`, or listens to mock events when `NEXT_PUBLIC_USE_MOCK !== "false"`.
- Cart persists in `localStorage` via Zustand.

### Connect real backend

Set in `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/orders/
```

Expected API surface:

- `POST /auth/login/` `{ email, password }` → `{ access, refresh, user }`
- `POST /auth/register/` `{ email, password, fullName, restaurantName, role }` → `{ access, refresh, user }`
- `GET /categories/`
- `GET /menu/`
- `POST /orders/`
- `GET /orders/?status=`
- `PATCH /orders/:id/status/` `{ status }`
- `POST /waiter/call/`
- `GET /tables/`
- `GET /dashboard/stats/`

Mock demo accounts (password `demo1234`):

- `director@restoflow.uz` → `/director`
- `kitchen@restoflow.uz` → `/kds`
- `waiter@restoflow.uz` → `/waiter`

WebSocket events: `order.created`, `order.updated`, `order.status_changed`, `waiter.called`, `stats.updated`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
