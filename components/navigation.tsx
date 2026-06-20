"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Experience" },
    { href: "/about", label: "Our Pride" },
    { href: "/tours", label: "Itineraries" },
    { href: "/gallery", label: "Lens & Light" },
    { href: "/blog", label: "Trail Tales" },
    { href: "/reviews", label: "Voices" },
    { href: "/contact", label: "Connect" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/98 backdrop-blur-lg shadow-lg"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      } border-b border-border`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
          <Link href="/" className="flex items-center space-x-2 group" aria-label="KEKEOsafari's home page">
            <div className="font-luxury text-primary font-extrabold text-3xl md:text-4xl transition-all duration-300 group-hover:scale-105">
              KEKEOsafari's
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium link-underline relative"
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              asChild
              className="hidden sm:flex button-press hover:scale-105 transition-transform duration-300"
              aria-label="Send an enquiry"
            >
              <Link href="/inquiries" className="flex items-center space-x-2">
                <SendIcon />
                <span>Enquiry</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:scale-110 transition-transform duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 slide-in-up" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 border border-border shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-3 text-card-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <div className="px-3 py-2">
                <Button asChild className="w-full button-press" aria-label="Send an enquiry">
                  <Link href="/inquiries" className="flex items-center justify-center space-x-2">
                    <SendIcon />
                    <span>Enquiry</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
