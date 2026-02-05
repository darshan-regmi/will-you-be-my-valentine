'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import FloatingHearts from '@/components/floating-hearts'
import EasterEggModal from '@/components/easter-egg-modal'
import { playBoopSound, playCelebrationSound } from '@/lib/sound-effects'
import { motion, AnimatePresence } from 'framer-motion'
import { saveProposalResponse, getProposalStatus } from '@/lib/firestore-service'
import { Heart, Sparkles, XCircle, Flower, MessageCircleHeart, Wand2, PartyPopper } from 'lucide-react'

interface ProposalLandingProps {
  onAccept: () => void
}

interface FloatingText {
  id: number
  x: number
  y: number
  message: string
}

export default function ProposalLanding({ onAccept }: ProposalLandingProps) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [noScale, setNoScale] = useState(1)
  const [noClickCount, setNoClickCount] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [justAccepted, setJustAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  const floatingTextIdRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Generate random position for NO button with safe margins for mobile
  const getRandomPosition = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };

    // Use smaller margins for smaller screens
    const margin = window.innerWidth < 640 ? 20 : 60;
    const buttonWidth = 100; // Estimated max width with scale
    const buttonHeight = 50; // Estimated max height

    const safeWidth = Math.max(margin, window.innerWidth - buttonWidth - margin);
    const safeHeight = Math.max(margin, window.innerHeight - buttonHeight - margin);

    const x = margin + Math.random() * (safeWidth - margin);
    const y = margin + Math.random() * (safeHeight - margin);

    return { x, y }
  }

  // Floating text messages for NO button - pookie edition
  const floatingMessages = [
    'Nice try! ✨',
    'Almost had it! 💖',
    'Why are you like this? 🥺',
    'That\'s illegal! 🙅‍♀️',
    'Error 404: No not found 🔍',
    'Try again pookie! 🎀',
    'Is that a challenge? 😏',
    'Not today, cutie! ✋',
    'Getting warmer... 🌡️',
    'You\'re too slow! 💨',
    'No way, José! 🙅‍♀️',
    'Look over there! 🦋',
    'Nice attempt! ✨',
    'Keep trying! 🎢',
    'So close! 🌌',
    'Missed me! 😜',
    'Catch me! 🏃‍♀️',
    'Nope! 🚫',
    'Maybe next time? 🕒',
    'Love you too! 💖',
    'Stay determined! ❤️',
    'You can do it! 🤭',
    'Oopsie daisy! 🌼',
    'Wrong button, silly! ⚠️',
  ]

  // Add floating text near NO button
  const addFloatingText = () => {
    const message =
      floatingMessages[Math.floor(Math.random() * floatingMessages.length)]
    const id = floatingTextIdRef.current++
    const newText: FloatingText = {
      id,
      x: noPosition.x + Math.random() * 100 - 50,
      y: noPosition.y - 40,
      message,
    }
    setFloatingTexts((prev) => [...prev, newText])
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id))
    }, 1500)
  }

  // Handle NO button interaction (click or hover)
  const handleNoInteraction = async () => {
    const newCount = noClickCount + 1
    setNoClickCount(newCount)
    if (!hasMoved) setHasMoved(true)
    setNoPosition(getRandomPosition())
    setNoScale(newCount > 15 ? 0 : Math.max(0, noScale * 0.85)) // Shrink aggressively
    playBoopSound()
    addFloatingText()

    // Save "NO" interaction to Firestore
    saveProposalResponse('NO', { clickCount: newCount })

    if (newCount >= 10) {
      setShowEasterEgg(true)
      setNoClickCount(0)
    }
  }

  const handleYesClick = async () => {
    setIsLoading(true)
    playCelebrationSound()
    await saveProposalResponse('YES')
    setIsLoading(false)
    setJustAccepted(true)
    setIsAccepted(true)
    // onAccept is now handled by the parent if needed, but we stay on success screen
  }

  useEffect(() => {
    const checkStatus = async () => {
      // Small delay for smoother transition
      const accepted = await getProposalStatus()
      if (accepted) {
        setIsAccepted(true)
      }
      setIsLoading(false)
    }
    checkStatus()
  }, [])

  // Initial loading state prevents UI flash
  if (isLoading && !isAccepted && !hasMoved) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-primary"
        >
          <Heart size={64} fill="currentColor" />
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Custom heart cursor */}
        <style>{`
          * {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23ec4899" stroke="%23fce7f3" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>') 16 16, auto !important;
          }
          .cursor-grabbing {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23db2777" stroke="%23fce7f3" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>') 16 16, grabbing !important;
          }
          @keyframes heartbeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-heartbeat {
            animation: heartbeat 1s ease-in-out infinite;
          }
        `}</style>

        <FloatingHearts />

        {/* Main Content */}
        <div className="text-center z-10 px-6 pointer-events-none">
          <AnimatePresence mode="wait">
            {!isAccepted ? (
              <motion.div
                key="proposal-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-12 pointer-events-auto"
              >
                {/* Animated heading */}
                <div className="mb-12">
                  <h1
                    style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
                    className="font-playfair font-bold text-foreground mb-6 leading-tight"
                  >
                    Hey you,
                  </h1>
                  <p
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}
                    className="font-lora text-foreground/80 max-w-2xl mx-auto leading-relaxed px-4"
                  >
                    I was trying to find the right words… so I built a whole website instead.
                  </p>
                </div>

                {/* Question */}
                <div className="mb-16 text-center px-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-block"
                  >
                    <p
                      style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
                      className="font-playfair text-primary font-bold drop-shadow-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
                    >
                      <Heart className="animate-pulse flex-shrink-0" size={48} fill="currentColor" />
                      <span>Will you be my Valentine?</span>
                      <Heart className="animate-pulse flex-shrink-0" size={48} fill="currentColor" />
                    </p>
                  </motion.div>
                </div>

                {/* Buttons Container */}
                <div className="flex gap-10 justify-center flex-wrap items-center min-h-24">
                  {/* YES Button */}
                  <motion.button
                    animate={{
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        '0 0 20px rgba(233, 30, 99, 0.2)',
                        '0 0 40px rgba(233, 30, 99, 0.4)',
                        '0 0 20px rgba(233, 30, 99, 0.2)'
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -1, 1, 0],
                      boxShadow: '0 0 60px rgba(233, 30, 99, 0.6)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    onClick={handleYesClick}
                    className="relative px-12 py-5 bg-primary text-primary-foreground rounded-full font-playfair text-2xl font-bold transition-all duration-300 disabled:opacity-50 flex items-center gap-3 overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                    <Heart fill="currentColor" size={24} />
                    {isLoading ? 'Sending...' : 'YES PLEASE!'}
                    <Sparkles size={24} className="group-hover:animate-spin-slow" />
                  </motion.button>

                  {/* NO Button - Teleporting */}
                  <AnimatePresence>
                    <motion.button
                      key="no-button"
                      layout
                      onClick={handleNoInteraction}
                      initial={false}
                      animate={{
                        position: hasMoved ? 'fixed' : 'relative' as any,
                        left: hasMoved ? `${noPosition.x}px` : 'auto',
                        top: hasMoved ? `${noPosition.y}px` : 'auto',
                        scale: noScale,
                      }}
                      whileHover={{ scale: (noScale || 1) * 1.1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                        mass: 0.5
                      }}
                      className={`px-8 py-4 bg-gray-200 text-gray-600 rounded-full font-playfair text-lg font-bold hover:bg-gray-300 transition-colors z-20 whitespace-nowrap flex items-center gap-2 border-2 border-transparent hover:border-pink-200 ${noScale === 0 ? 'pointer-events-none invisible' : ''}`}
                    >
                      <XCircle size={18} />
                      No...
                    </motion.button>
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 max-w-lg mx-auto pointer-events-auto"
              >
                {justAccepted ? (
                  /* Immediate Success Screen - Screenshot Style + Pookie Decorations */
                  <div className="space-y-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative inline-block"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 45, -45, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-16 -left-16 text-rose-300"
                      >
                        <PartyPopper size={64} />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 45, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                        className="absolute -top-16 -right-16 text-pink-300"
                      >
                        <Sparkles size={64} />
                      </motion.div>

                      <h1
                        className="font-playfair font-black text-rose-500 mb-2 leading-tight flex items-center justify-center gap-4 px-4"
                        style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}
                      >
                        YAY <span className="inline-block animate-bounce-heart"><Heart size={64} fill="currentColor" /></span>
                      </h1>
                      <h2
                        style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
                        className="font-playfair text-foreground font-bold"
                      >
                        I knew it.
                      </h2>
                    </motion.div>

                    <div className="space-y-4">
                      <p
                        style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}
                        className="font-lora text-foreground/70 flex items-center justify-center gap-2"
                      >
                        Valentine secured. <Sparkles size={24} className="text-pink-400" />
                      </p>
                      <p
                        style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}
                        className="font-lora text-foreground/50 italic px-4"
                      >
                        Now go tell me yes in real life too
                      </p>
                    </div>

                    <div className="pt-16 flex justify-center gap-8">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            delay: i * 0.4
                          }}
                          className="text-primary"
                        >
                          <Flower size={48} fill="currentColor" fillOpacity={0.3} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Persistent Success Screen - Stuck with me style */
                  <>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative inline-block"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 45, -45, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-16 -left-16 text-rose-300"
                      >
                        <PartyPopper size={64} />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 45, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                        className="absolute -top-16 -right-16 text-pink-300"
                      >
                        <Sparkles size={64} />
                      </motion.div>

                      <h1
                        style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}
                        className="font-playfair font-black text-rose-500 mb-8 animate-heartbeat leading-tight"
                      >
                        YAYAYAY!
                      </h1>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-8 px-4"
                    >
                      <p
                        style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}
                        className="font-lora text-foreground/90 font-semibold italic leading-relaxed text-balance"
                      >
                        "you have already accepted it, you can't change your mind nowww..."
                      </p>
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' }}
                        className="text-pink-400 font-playfair font-bold"
                      >
                        "you're stuck with meeeeee forever!"
                      </motion.div>
                    </motion.div>

                    <div className="pt-16 flex justify-center gap-8">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            delay: i * 0.4
                          }}
                          className="text-primary"
                        >
                          <Flower size={48} fill="currentColor" fillOpacity={0.3} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating text messages */}
        {floatingTexts.map((text) => (
          <div
            key={text.id}
            style={{
              position: 'fixed',
              left: `${text.x}px`,
              top: `${text.y}px`,
              pointerEvents: 'none',
              animation: 'float 1.5s ease-out forwards',
            }}
            className="font-lora text-sm font-semibold text-primary"
          >
            {text.message}
          </div>
        ))}
      </div>

      {/* Easter Egg Modal */}
      <EasterEggModal
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
        onAccept={onAccept}
      />
    </>
  )
}
