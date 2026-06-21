"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for scroll-based animations using Intersection Observer
 * Triggers animations when elements enter the viewport
 *
 * @param threshold - Percentage of element visibility before triggering (0-1)
 * @param triggerOnce - Whether to trigger animation only once
 * @returns ref and isVisible state
 */
export function useScrollAnimation(threshold = 0.1, triggerOnce = true) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, triggerOnce])

  return { ref, isVisible }
}

/**
 * Hook for staggered animations (children animate in sequence)
 */
export function useStaggerAnimation(itemCount: number, delay = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const { ref, isVisible } = useScrollAnimation()

  useEffect(() => {
    if (isVisible && visibleItems.length === 0) {
      // Stagger animation for each item
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, i])
        }, i * delay)
      }
    }
  }, [isVisible, itemCount, delay, visibleItems.length])

  return { ref, visibleItems }
}
