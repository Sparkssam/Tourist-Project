export function AboutHero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/african-safari-landscape-with-acacia-trees-and-wil.png"
          alt="African landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 leading-7" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-luxury mb-6 text-balance">Our Pride, Your Legacy</h1>
        <p className="text-xl md:text-2xl text-balance opacity-90 font-serif">
          Three generations of Tanzanian guides, one unwavering mission: to share Africa's soul with reverence,
          authenticity, and a commitment to conservation that outlasts every footprint.
        </p>
      </div>
    </section>
  )
}
