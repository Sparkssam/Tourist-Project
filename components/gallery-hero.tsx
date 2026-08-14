"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Camera, Sparkles, Eye } from "lucide-react"

export function GalleryHero() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* Background image with cinematic zoom */}
      <div className="absolute inset-0">
        <img
          src="/tanzania-safari-leopard-tree.jpeg"
          alt="African wildlife and safari photography"
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 backdrop-blur-[0.5px]" />
      </div>

      <div
        className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 space-y-5 transition-all duration-1000 ${
          isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 shadow-lg">
            <Camera className="w-3.5 h-3.5" />
            <span>Field Photography</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-300 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>Unfiltered African Moments</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury text-balance leading-tight tracking-tight text-white">
          Lens & Light
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-balance opacity-90 font-serif max-w-2xl mx-auto leading-relaxed text-amber-100/90">
          Every photograph tells a story of the wild. Explore authentic moments captured across Tanzania's golden plains, ancient craters, and vibrant tribal cultures.
        </p>

        {/* Decorative Camera Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] w-12 bg-amber-400/60" />
          <Camera className="w-5 h-5 text-amber-400" />
          <div className="h-[1px] w-12 bg-amber-400/60" />
        </div>
      </div>
    </section>
  )
}
