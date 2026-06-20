export function ContactHero() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/african-safari-landscape-with-acacia-trees-and-wil.png"
          alt="Contact us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-luxury mb-6 text-balance">The Watering Hole</h1>
        <p className="text-xl text-balance opacity-90 font-serif md:text-2xl">
          Every great journey begins with a conversation. Share your dreams, your questions, your timeline—and let us
          craft an experience as unique as your own story.
        </p>
      </div>
    </section>
  )
}
