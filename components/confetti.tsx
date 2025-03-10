"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface ConfettiProps {
  onComplete?: () => void
}

export function Confetti({ onComplete }: ConfettiProps) {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        setIsComplete(true)
        if (onComplete) {
          setTimeout(onComplete, 500)
        }
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [onComplete])

  return null
}

