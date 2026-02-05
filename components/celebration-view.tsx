'use client'

import { useEffect, useState } from 'react'
import Confetti from '@/components/confetti'
import FloatingHearts from '@/components/floating-hearts'
import { playCelebrationSound } from '@/lib/sound-effects'

export default function CelebrationView() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
    playCelebrationSound()
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-rose-50 relative">
      <Confetti />
      <FloatingHearts count={30} />

      <style>{`
        * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%23E91E63" d="M16 4c6.627 0 12 5.373 12 12s-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4m0-2C9.373 2 4 7.373 4 14s5.373 12 12 12 12-5.373 12-12S22.627 2 16 2z"/><circle cx="16" cy="16" r="4" fill="%23E91E63"/></svg>') 16 16, auto;
        }
      `}</style>

      <div
        className={`text-center z-20 transform transition-all duration-1000 ${
          showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <h1 className="font-playfair text-6xl md:text-8xl font-bold text-primary mb-4 drop-shadow-lg animate-bounce-heart">
          YAY ❤️
        </h1>
        <p className="font-playfair text-4xl md:text-5xl text-foreground mb-8 drop-shadow-md">
          I knew it.
        </p>
        <p className="font-lora text-2xl text-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
          Valentine secured.
        </p>
        <p className="font-lora text-xl text-foreground/60 italic">
          Now go tell me yes in real life too 😌
        </p>
      </div>
    </div>
  )
}
