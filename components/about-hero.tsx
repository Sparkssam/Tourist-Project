"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ShieldCheck, Compass, Sparkles } from "lucide-react"

export function AboutHero() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="relative min-h-[65vh] flex items-center justify-center overflow-hidden py-20">
      {/* Hero Background Image with subtle zoom */}
      <div className="absolute inset-0">
        <img
          src="/Homepage1.jpg"
          alt="African landscape Serengeti"
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[1px]" />
      </div>

      <div
        className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 space-y-6 transition-all duration-1000 ${
          isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Est. 2009 • 100% Tanzanian Owned</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-300 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Licensed Tour Operator</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury text-balance leading-tight tracking-tight">
          Our Pride, Your Legacy
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-balance opacity-90 font-serif max-w-3xl mx-auto leading-relaxed text-amber-100/90">
          Three generations of Tanzanian guides, one sacred mission: to share Africa's soul with reverence, authenticity, and an unyielding commitment to conservation.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] w-12 bg-amber-400/60" />
          <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <div className="h-[1px] w-12 bg-amber-400/60" />
        </div>
      </div>
    </section>
  )
}
