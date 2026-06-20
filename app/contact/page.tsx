import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { ContactMap } from "@/components/contact-map"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <ContactHero />
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <div className="space-y-8">
              <ContactInfo />
              <ContactMap />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
