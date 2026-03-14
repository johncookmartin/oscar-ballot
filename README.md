# Oscar Ballot

A web app for the Cook-Martin family Oscar night. Submit your picks before the ceremony, then track the live leaderboard as winners are announced.

## Features

- **Submit Picks** — enter your name and choose one nominee per category before the ceremony
- **Leaderboard** — live-updating scoreboard once the ceremony begins; click any name to jump to their picks
- **Compare Picks** — browse everyone's selections category by category, with correct/incorrect indicators as winners are revealed
- **Admin** — authenticated admin panel to set and clear category winners (Microsoft account login required)

## Tech Stack

- React 19 + TypeScript
- Vite
- MUI (Material UI) v7
- Redux Toolkit + RTK Query
- React Router v7
- Azure MSAL (Microsoft authentication for admin access)

## Getting Started

```bash
npm install
npm run dev
```

The app expects a backend API. For more information see the [Cook-Martin Backend Api](https://github.com/johncookmartin/cookmartin-api). Set the base URL in the relevant config before running.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start local dev server               |
| `npm run build`   | Type-check and build for production  |
| `npm run lint`    | Run ESLint                           |
| `npm run preview` | Preview the production build locally |
