"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"

const ArrowUpIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
)

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Hide on dashboard pages
  const isDashboardRoute = pathname?.startsWith('/admin') || 
                           pathname?.startsWith('/staff') || 
                           pathname?.startsWith('/tourist')

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Hide scroll to top if loading, user is logged in, on dashboard pages, or not scrolled down
  if (loading || user || isDashboardRoute || !isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      size="sm"
      className="fixed bottom-4 right-4 z-50 rounded-full h-10 w-10 p-0 shadow-lg transition-theme"
    >
      <ArrowUpIcon />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}
