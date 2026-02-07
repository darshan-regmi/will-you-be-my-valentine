'use client'

import { useEffect, useState } from 'react'

import { Heart, Sparkles, Flower, Star, Gift } from 'lucide-react'

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  rotation: number
  Icon: React.ElementType
  color: string
}

export default function Confetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const icons = [Heart, Sparkles, Flower, Star, Gift]
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ff4500', '#ffd700']

    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(pieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-float text-pink-500"
          style={{
            left: `${piece.left}%`,
            top: '-30px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.8,
            color: piece.color,
          }}
        >
          <piece.Icon size={24} fill="currentColor" />
        </div>
      ))}
    </div>
  )
}
