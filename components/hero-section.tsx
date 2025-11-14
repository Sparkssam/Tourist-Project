"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const PlayIcon = () => (
  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/Home1.png"
        >
          <source src="/placeholder.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 leading-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-luxury mb-6 text-balance">
          Your Adventure of a Lifetime Awaits in Tanzania
        </h1>
        <p className="text-xl mb-8 text-pretty max-w-2xl mx-auto opacity-90 leading-10 tracking-wide font-thin md:text-2xl font-serif">
          Experience authentic African safaris, witness incredible wildlife, and immerse yourself in rich cultural
          traditions with KEKEOsafari's expert guides.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold font-serif"
          >
            <Link href="/tours">Explore Tours</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold bg-transparent font-serif"
          >
            <Link href="/inquiry">Plan My Safari</Link>
          </Button>
        </div>

        {/* Play Video Button */}
        <div className="mt-12">
          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 rounded-full p-4"
            onClick={() => {
              alert("Video modal would open here - feature coming soon!")
            }}
          >
            <PlayIcon />
          </Button>
          <p className="text-sm mt-2 opacity-75">Watch Our Story</p>
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
