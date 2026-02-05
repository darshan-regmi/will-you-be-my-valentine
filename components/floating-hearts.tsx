'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart as HeartIcon } from 'lucide-react'

interface FloatingHeartsProps {
  count?: number
}

interface Heart {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  color: string
}

const colors = ['text-pink-300', 'text-pink-400', 'text-rose-300', 'text-rose-400', 'text-red-300']

export default function FloatingHearts({ count = 12 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const newHearts: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 15 + Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setHearts(newHearts)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          drag
          dragConstraints={{ top: -200, bottom: 1200, left: -200, right: 1200 }}
          dragElastic={0.1}
          whileDrag={{ scale: 1.3, zIndex: 5, cursor: 'grabbing' }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0.6, 0],
            x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute ${heart.color} pointer-events-auto cursor-grab transition-colors`}
          style={{
            left: `${heart.left}%`,
            zIndex: 1
          }}
        >
          <HeartIcon size={heart.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  )
}
