# Cloudflare Pages CLI Deployment Guide 🚀

This guide will help you deploy your Valentine proposal website to Cloudflare Pages using the CLI (Wrangler).

## Prerequisites

1. A Cloudflare account
2. Your project built and ready to deploy

## Step 1: Install Wrangler (if not already installed)

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window asking you to authorize Wrangler with your Cloudflare account.

## Step 3: Build Your Project

```bash
pnpm build
```

This will create the `out` folder with your static site.

## Step 4: Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy out --project-name=valentine
```

**Important Notes:**
- Replace `valentine-proposal` with whatever project name you want
- The first time you run this, it will create a new Cloudflare Pages project
- Subsequent deployments will update the existing project

## Step 5: Set Environment Variables

After your first deployment, you need to add your Firebase credentials:

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** → **Your Project** → **Settings** → **Environment Variables**
3. Add the following variables (from your `.env.local` file):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

4. After adding the variables, redeploy:

```bash
npx wrangler pages deploy out --project-name=valentine-proposal
```

## Quick Deploy Script

For future deployments, you can use this one-liner:

```bash
pnpm build && npx wrangler pages deploy out --project-name=valentine-proposal
```

## Your Site is Live! 🎉

After deployment, Wrangler will give you a URL like:
```
https://valentine-proposal.pages.dev
```

You can also set up a custom domain in the Cloudflare dashboard.

---

**Pro Tip:** If you want to preview before deploying to production, use:
```bash
npx wrangler pages deploy out --project-name=valentine-proposal --branch=preview
```

Good luck with your proposal! 🌹❤️
