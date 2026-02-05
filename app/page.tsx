'use client'

import { useState, useEffect } from 'react'
import ProposalLanding from '@/components/proposal-landing'
import CelebrationView from '@/components/celebration-view'

export default function Home() {
  const [isAccepted, setIsAccepted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-rose-50">
      {isAccepted ? (
        <CelebrationView />
      ) : (
        <ProposalLanding onAccept={() => setIsAccepted(true)} />
      )}
    </main>
  )
}
