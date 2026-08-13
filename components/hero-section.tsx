"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

const PlayIcon = () => (
  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-[65vh] md:min-h-[75vh] lg:h-[85vh] flex items-center justify-center overflow-hidden page-enter">
      {/* Background Video with parallax effect */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/african-safari-landscape-with-acacia-trees-and-wil.jpeg"
        >
          <source src="/placeholder.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 leading-10" />
      </div>

      {/* Hero Content with staggered animations */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-luxury leading-tight mb-4 text-balance fade-in-down">
          Where Earth's Ancient Rhythms Still Echo
        </h1>
        <p
          className="text-responsive-md mb-6 text-pretty max-w-2xl mx-auto opacity-90 leading-relaxed tracking-wide font-thin font-serif fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Join us on journeys that honor the wild, respect the land, and awaken something timeless within you. This is
          Africa as it was meant to be experienced—raw, real, and profoundly transformative.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center scale-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-base font-semibold font-serif button-press hover:scale-105 transition-all duration-300"
          >
            <Link href="/tours">Discover Your Journey</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary px-6 py-2.5 text-base font-semibold bg-transparent font-serif button-press hover:scale-105 transition-all duration-300"
          >
            <Link href="/inquiry">Begin the Conversation</Link>
          </Button>
        </div>

        <div className="mt-8 fade-in-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="https://youtube.com/@kekeosafaris"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 text-white hover:text-white/80 transition-colors duration-300 group"
            aria-label="Watch our safari videos on YouTube"
          >
            <div className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-all duration-300 hover:scale-110 group">
              <PlayIcon />
            </div>
            <p className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">Watch Our Story</p>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
