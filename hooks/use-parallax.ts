"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook for parallax scrolling effects
 * Returns scroll-based offset value for smooth parallax animations
 *
 * @param speed - Parallax speed multiplier (0.1 = slow, 1 = normal)
 * @returns offsetY value for transform
 */
export function useParallax(speed = 0.5) {
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return offsetY
}
