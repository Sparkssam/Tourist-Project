export function InquiryHero() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/Homepage1.jpg"
          alt="Safari adventure enquiry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-luxury mb-4 text-balance">Begin Your Safari Journey</h1>
        <p className="text-lg md:text-xl font-serif text-balance opacity-90 max-w-2xl mx-auto leading-relaxed">
          Share your travel vision with us. Every safari is unique, crafted around your interests, pace, and dreams.
        </p>
      </div>
    </section>
  )
}
