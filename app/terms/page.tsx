import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Terms & Conditions - KEKEOsafari's",
  description: "Terms and conditions for booking safari adventures with KEKEOsafari's.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Booking & Payment Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  A 30% deposit is required to confirm your safari booking. The remaining balance is due 30 days before
                  departure. Payment can be made via bank transfer, credit card, or mobile money through our secure
                  Pesapal system.
                </p>
                <p className="leading-relaxed">
                  Bookings made within 30 days of departure require full payment upfront. All prices are in USD and
                  subject to change based on currency fluctuations and park fee adjustments.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cancellation Policy</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">60+ days before departure:</strong> 80% refund of total payment
                </li>
                <li>
                  <strong className="text-foreground">30-59 days before departure:</strong> 50% refund of total payment
                </li>
                <li>
                  <strong className="text-foreground">15-29 days before departure:</strong> 25% refund of total payment
                </li>
                <li>
                  <strong className="text-foreground">Less than 14 days:</strong> No refund
                </li>
              </ul>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                We strongly recommend comprehensive travel insurance to protect against unforeseen circumstances.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Travel Insurance</h2>
              <p className="text-muted-foreground leading-relaxed">
                Travel insurance is mandatory for all participants. Your policy should cover medical emergencies,
                evacuation, trip cancellation, and personal belongings. We can recommend trusted insurance providers
                upon request.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Health & Safety</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Participants must be in reasonable physical condition. Certain activities may have age or fitness
                restrictions. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Obtaining required vaccinations</li>
                <li>Carrying necessary medications</li>
                <li>Disclosing medical conditions that may affect participation</li>
                <li>Following guide instructions for safety</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While we take every precaution to ensure your safety, wildlife safaris involve inherent risks.
                KEKEOsafari's, its guides, and partners are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Illness, injury, or death resulting from wildlife encounters</li>
                <li>Loss or damage to personal property</li>
                <li>Flight delays, cancellations, or itinerary changes beyond our control</li>
                <li>Force majeure events (natural disasters, political unrest, pandemics)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Code of Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">All guests must:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Respect wildlife, local communities, and environments</li>
                <li>Follow park regulations and guide instructions</li>
                <li>Refrain from disturbing animals or removing natural objects</li>
                <li>Treat fellow travelers and staff with courtesy</li>
              </ul>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                We reserve the right to remove participants who violate these standards without refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Modifications & Force Majeure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify itineraries due to weather, road conditions, animal movements, or safety
                concerns. In cases of force majeure preventing travel, we'll work with you to reschedule or provide
                credit toward future safaris.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All website content, images, and branding are property of KEKEOsafari's. You may not reproduce, modify,
                or distribute our materials without written permission.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms are governed by the laws of Tanzania. Any disputes shall be resolved through the courts of
                Arusha, Tanzania.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">For questions about these terms, contact:</p>
              <div className="bg-accent/30 p-6 rounded-xl">
                <p className="text-foreground font-medium">Email: info@kekeosafaris.com</p>
                <p className="text-foreground font-medium">Phone: +255 XXX XXX XXX</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-between">
            <Link href="/" className="text-primary hover:underline font-medium">
              ← Return to The Plains
            </Link>
            <Link href="/privacy" className="text-primary hover:underline font-medium">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
