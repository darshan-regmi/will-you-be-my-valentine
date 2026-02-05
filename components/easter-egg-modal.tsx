'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Confetti from '@/components/confetti'
import { playBoopSound, playCelebrationSound } from '@/lib/sound-effects'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, HeartOff, Sparkles, X, MessageCircleHeart } from 'lucide-react'

interface EasterEggModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function EasterEggModal({
  isOpen,
  onClose,
  onAccept,
}: EasterEggModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <Confetti />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(233, 30, 99, 0.2)',
          }}
        >
          {/* Decorative icons */}
          <Sparkles className="absolute top-4 left-4 text-pink-200 animate-pulse" size={24} />
          <Sparkles className="absolute bottom-4 right-4 text-pink-200 animate-pulse" size={24} />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="font-playfair text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            Okay okay! <MessageCircleHeart size={32} className="text-pink-400" />
          </h2>
          <p className="font-lora text-lg text-foreground/70 mb-8">
            At this point, you're just being stubborn. Just say yes!
          </p>

          <div className="flex items-center justify-center gap-4 text-5xl mb-8">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <HeartOff className="text-gray-400" size={48} />
            </motion.div>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Sparkles className="text-pink-300" size={32} />
            </motion.div>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart className="text-primary" fill="currentColor" size={48} />
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                playBoopSound()
                onClose()
              }}
              variant="outline"
              className="rounded-full px-8 py-6 border-pink-100 hover:bg-pink-50 transition-colors flex-1"
            >
              Still No
            </Button>
            <Button
              onClick={() => {
                playCelebrationSound()
                setTimeout(onAccept, 200)
              }}
              className="rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 flex-1 shadow-lg shadow-pink-200"
            >
              YES! <Sparkles className="ml-2 inline" size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
