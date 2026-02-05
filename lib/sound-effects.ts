// Simple sound effect generation using Web Audio API
export const createBoopSound = (): AudioBuffer | null => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    const sampleRate = audioContext.sampleRate
    const duration = 0.1
    const frequency = 800

    const buffer = audioContext.createBuffer(
      1,
      sampleRate * duration,
      sampleRate
    )
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate)
      data[i] *= (1 - i / buffer.length) // Fade out
    }

    return buffer
  } catch {
    return null
  }
}

export const playBoopSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    )

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch {
    // Audio not available
  }
}

export const playCelebrationSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()

    // Create a simple celebration sound with two notes
    const playNote = (
      frequency: number,
      startTime: number,
      duration: number
    ) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    const now = audioContext.currentTime
    playNote(523.25, now, 0.15) // C5
    playNote(659.25, now + 0.15, 0.15) // E5
    playNote(783.99, now + 0.3, 0.3) // G5
  } catch {
    // Audio not available
  }
}
