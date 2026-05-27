# Will You Be My Valentine?

An interactive Valentine's Week web experience built with Next.js. Each of the 8 days of Valentine's Week gets its own animated page — from Rose Day to Valentine's Day.

## Features

- Timeline view of all 8 Valentine's Week days
- Individual interactive pages for each day:
  - Rose Day, Propose Day, Chocolate Day, Teddy Day
  - Promise Day, Hug Day, Kiss Day, Valentine's Day
- Smooth animations with Framer Motion
- Firebase backend
- Fully responsive

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion
- **Backend**: Firebase
- **UI Components**: shadcn/ui

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Add your Firebase config to environment variables:
   ```bash
   # .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

3. Start the dev server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
