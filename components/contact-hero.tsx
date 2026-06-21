export function ContactHero() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/Homepage1.jpg"
          alt="Contact us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-luxury mb-4 text-balance">The Watering Hole</h1>
        <p className="text-base md:text-lg text-balance opacity-90 font-serif">
          Every great journey begins with a conversation. Share your dreams, your questions, your timeline—and let us
          craft an experience as unique as your own story.
        </p>
      </div>
    </section>
  )
}
