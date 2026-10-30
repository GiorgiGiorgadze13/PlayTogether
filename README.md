# PlayTogether (frontend-only)

React 19 + TypeScript + Vite + React Router. **No backend, no database** — all data
(accounts, games, bookings, PlayPass subscriptions, instructor lessons) is stored in the
browser's `localStorage` (key `playTogether_db_v1`; session token `playTogetherToken`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Notes

- Default admin account: `admin@playtogether.ge` / `Admin@PT2025`
- Data lives only in your browser. To reset everything: clear site data or run `localStorage.clear()` in the console.
- Data layer: `src/services/api.ts` (same methods as the old HTTP client). Seed data: `src/services/localSeed.ts`.
