# Valentine Proposal Website - Deployment Guide

## Overview

This is an interactive Valentine proposal website built with Next.js, Tailwind CSS, and Framer Motion. It features playful button interactions, animations, and celebration effects.

## Features

- **Interactive Landing Page**: Heartfelt message with YES/NO buttons
- **Playful NO Button**: Teleports around the screen, shrinks on clicks, and shows floating text messages
- **Celebration View**: Confetti, floating hearts, and celebratory messages when YES is clicked
- **Easter Egg**: After 10 NO clicks, a dramatic modal appears
- **Sound Effects**: Web Audio API sounds for interactions
- **Custom Heart Cursor**: Themed cursor throughout the experience
- **Responsive Design**: Works beautifully on mobile and desktop
- **Soft Pastel Theme**: Pink, lavender, and rose color palette

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display (headings), Lora (body)
- **Animations**: Custom CSS animations and Tailwind utilities
- **Audio**: Web Audio API for sound effects
- **Deployment**: Cloudflare Pages

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Cloudflare Pages

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Follow the prompts to connect your GitHub account and configure the deployment

### Option 2: Manual GitHub Integration

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Valentine proposal website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/valentine-proposal.git
git push -u origin main
```

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Click "Create a project" and select "Connect to Git"

4. Choose your GitHub repository

5. Configure build settings:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

6. Click "Save and Deploy"

### Option 3: Deploy Without GitHub (Drag & Drop)

1. Build the project:
```bash
npm run build
```

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Drag and drop the `.next` folder (or use the CLI upload)

## Environment Variables

This project doesn't require environment variables for basic functionality. However, if you plan to add Firebase Firestore persistence:

1. Create a `.env.local` file (for development):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
# ... other Firebase config
```

2. For production on Cloudflare Pages, add these in the Pages project settings under "Environment variables"

## Customization

### Colors

Edit the color scheme in `/app/globals.css`:
- `--primary`: Main pink/red color
- `--secondary`: Lavender accent
- `--background`: Soft pink background
- `--foreground`: Dark text color

### Messages

Edit text in `/components/proposal-landing.tsx` and `/components/celebration-view.tsx`:
- Main message
- Valentine question
- Celebration messages
- Floating text messages

### Fonts

Fonts are configured in `/app/layout.tsx`:
- **Playfair Display**: Elegant serif for headings
- **Lora**: Beautiful serif for body text

Change to any Google Font by updating the font imports.

### Animations

Animation durations and styles are in `/tailwind.config.ts`:
- `float`: Floating motion for hearts and confetti
- `pulse-glow`: Glowing pulse effect
- `bounce-heart`: Bouncing animation

## Firebase Integration (Optional)

To add Firestore persistence for tracking proposals:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Install Firebase:
```bash
npm install firebase
```

3. Create `/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

4. Update `/components/celebration-view.tsx` to save the acceptance:
```typescript
import { db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

// In component:
const saveAcceptance = async () => {
  try {
    await addDoc(collection(db, 'proposals'), {
      accepted: true,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Error saving:', error)
  }
}
```

## Performance Notes

- All animations use CSS for optimal performance
- Sound effects use Web Audio API (lightweight)
- No external animation libraries (Framer Motion not used in final version)
- Optimized for mobile with touch events
- Total bundle size: ~50KB (gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Note: Web Audio API for sounds may not work in some sandboxed environments.

## Troubleshooting

**Sound effects not working:**
- Check browser console for errors
- Web Audio API requires user interaction first (click)
- Some browsers may require HTTPS for full Audio API support

**Animations stuttering:**
- Try disabling browser extensions
- Check for high CPU usage
- Try a different browser

**Mobile responsiveness:**
- Verify viewport meta tag in layout.tsx
- Test with browser DevTools mobile emulation
- Check Tailwind breakpoints (md:, lg:, etc.)

## License

Feel free to customize and use this for your own Valentine proposal!

## Support

For issues or questions, check:
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
