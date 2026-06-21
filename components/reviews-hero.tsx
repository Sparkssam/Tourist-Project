export function ReviewsHero() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/serengeti-lions-and-wildebeest-migration.jpeg"
          alt="Customer reviews"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-white/95 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-800 font-semibold text-sm">Verified by Google</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-luxury mb-6 text-balance">Voices from the Pride</h1>
        <p className="text-xl md:text-2xl text-balance opacity-90 font-serif mb-6">
          Unfiltered stories from travelers whose lives were touched by the wild. These aren't testimonials—they're
          transformation tales written in dust, wonder, and unforgettable sunsets.
        </p>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed">
            <strong>100% Authentic Reviews:</strong> Every review you see here comes directly from Google Reviews and
            has not been edited, filtered, or created by us. We believe in complete transparency—our guests' honest
            experiences speak louder than any marketing message ever could.
          </p>
        </div>
      </div>
    </section>
  )
}
