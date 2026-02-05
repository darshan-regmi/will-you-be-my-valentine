import React from "react"
import type { Metadata } from 'next'
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
  title: 'Will You Be My Valentine?',
  description: 'A heartfelt Valentine proposal with a touch of playfulness',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
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
      <body className="font-lora antialiased bg-gradient-to-br from-pink-100 via-lavender-100 to-rose-50">{children}</body>
    </html>
  )
}
