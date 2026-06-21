import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "Frequently Asked Questions - KEKEOsafari's",
  description:
    "Find answers to common questions about Tanzania safaris, booking, travel requirements, and wildlife adventures.",
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Booking & Planning",
      questions: [
        {
          q: "How far in advance should I book my safari?",
          a: "We recommend booking 3-6 months in advance, especially for peak seasons (June-October and December-February). This ensures availability for preferred accommodations and allows time for travel arrangements.",
        },
        {
          q: "What's included in the safari price?",
          a: "All our safaris include park fees, professional guide services, 4x4 safari vehicle, accommodation, meals as specified, and drinking water. International flights, visas, travel insurance, and personal expenses are not included.",
        },
        {
          q: "Can I customize my itinerary?",
          a: "Every safari can be tailored to your interests, budget, and time frame. Contact us with your preferences and we'll craft a personalized adventure.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept bank transfers, credit cards via Pesapal, and mobile money payments. A deposit secures your booking, with the balance due before departure.",
        },
      ],
    },
    {
      category: "Travel Requirements",
      questions: [
        {
          q: "Do I need a visa for Tanzania?",
          a: "Most visitors require a visa, which can be obtained on arrival or online before travel. US citizens and many other nationalities can get a single-entry visa for $50-100 USD.",
        },
        {
          q: "What vaccinations are required?",
          a: "Yellow fever vaccination is mandatory if arriving from endemic countries. We strongly recommend malaria prophylaxis, hepatitis A&B, typhoid, and routine vaccinations. Consult your doctor 6-8 weeks before travel.",
        },
        {
          q: "Is Tanzania safe for tourists?",
          a: "Yes, Tanzania is one of Africa's safest countries for tourism. Our guides are trained in safety protocols, and we maintain comprehensive emergency support systems throughout your journey.",
        },
        {
          q: "What's the best time to visit Tanzania?",
          a: "The dry season (June-October) offers excellent wildlife viewing. December-March is perfect for calving season and fewer crowds. The green season (April-May) provides lush landscapes and great photography opportunities at lower rates.",
        },
      ],
    },
    {
      category: "Safari Experience",
      questions: [
        {
          q: "What should I pack for a safari?",
          a: "Essentials include neutral-colored clothing, sun protection, binoculars, camera with zoom lens, insect repellent, and any personal medications. We provide a detailed packing list upon booking.",
        },
        {
          q: "How close do we get to the animals?",
          a: "In Tanzania's national parks, we maintain safe distances as required by park regulations, typically 20-25 meters. However, animals often approach vehicles naturally, providing incredible close encounters.",
        },
        {
          q: "What type of accommodation is available?",
          a: "We offer options from luxury lodges and tented camps to mid-range hotels and budget camping. All accommodate varying comfort levels while maintaining authentic safari atmosphere.",
        },
        {
          q: "Can children join safaris?",
          a: "Yes! We welcome families and can customize itineraries for all ages. Some lodges have age restrictions, but we'll help find family-friendly options that create unforgettable experiences for young explorers.",
        },
      ],
    },
    {
      category: "Wildlife & Conservation",
      questions: [
        {
          q: "What animals will I see?",
          a: "Tanzania is home to the Big Five (lion, leopard, elephant, buffalo, rhino), plus cheetahs, giraffes, zebras, wildebeest, and over 400 bird species. Sightings vary by season and location.",
        },
        {
          q: "How do you support conservation?",
          a: "We partner with local communities and conservation organizations, practice responsible tourism, educate guests about ecosystems, and contribute a portion of profits to wildlife protection initiatives.",
        },
        {
          q: "Can I witness the Great Migration?",
          a: "Yes! The wildebeest migration occurs year-round across the Serengeti ecosystem. We time itineraries to maximize your chances of witnessing this spectacular natural phenomenon.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Questions From Fellow Explorers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about planning your Tanzania safari adventure. Can't find your answer? We're
              here to help.
            </p>
          </div>

          {faqs.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, qIdx) => (
                  <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <div className="mt-16 p-8 bg-accent/30 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our safari experts are ready to help you plan the perfect adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <Link href="/inquiry">
                <Button size="lg" variant="outline">
                  Send Enquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
