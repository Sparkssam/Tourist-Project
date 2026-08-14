"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Compass, Sparkles, MapPin } from "lucide-react"

export function ToursHero() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* Background image with cinematic zoom */}
      <div className="absolute inset-0">
        <img
          src="/african-safari-landscape-with-acacia-trees-and-wil.jpeg"
          alt="Tanzania safari savanna landscape with wildlife"
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80 backdrop-blur-[0.5px]" />
      </div>

      <div
        className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 space-y-5 transition-all duration-1000 ${
          isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Expeditions</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-300 shadow-lg">
            <MapPin className="w-3.5 h-3.5" />
            <span>Serengeti • Kilimanjaro • Zanzibar</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury text-balance leading-tight tracking-tight text-white">
          Iconic Safari Itineraries
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-balance opacity-90 font-serif max-w-2xl mx-auto leading-relaxed text-amber-100/90">
          From the thunderous river crossings of the Great Migration to the glaciated heights of Uhuru Peak, every journey is privately guided by native Tanzanian specialists.
        </p>

        {/* Decorative Compass Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] w-12 bg-amber-400/60" />
          <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <div className="h-[1px] w-12 bg-amber-400/60" />
        </div>
      </div>
    </section>
  )
}
