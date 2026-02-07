import React from "react"
import type { Metadata, Viewport } from 'next'
import { SafeRepeat } from '@/components/safe-repeat'
import { Playfair_Display, Lora } from 'next/font/google'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: "Valentine's Week 2026 - A Week of Love",
  description: 'Experience a magical Valentine\'s Week with daily unlockable experiences, mini-games, and heartfelt moments',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <head>
        <style>{`
          :root {
            --font-playfair: ${playfair.style.fontFamily};
            --font-lora: ${lora.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="font-lora antialiased bg-gradient-to-br from-pink-100 via-lavender-100 to-rose-50">
        <SafeRepeat />
        {children}
      </body>
    </html>
  )
}
