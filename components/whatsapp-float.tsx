"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"

const MessageCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

export function WhatsAppFloat() {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Hide WhatsApp float on dashboard pages
  const isDashboardRoute = pathname?.startsWith('/admin') || 
                           pathname?.startsWith('/staff') || 
                           pathname?.startsWith('/tourist')

  // Hide during loading or if user is logged in or on dashboard pages
  if (loading || user || isDashboardRoute) {
    return null
  }

  return (
    <Link
      href="https://wa.me/255760309999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircleIcon />
    </Link>
  )
}
