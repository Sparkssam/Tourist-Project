import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - KEKEOsafari's",
  description: "Our commitment to protecting your privacy and personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: January 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At KEKEOsafari's, we respect your privacy and are committed to protecting your personal information.
                This policy explains how we collect, use, and safeguard your data when you use our website and services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="leading-relaxed">
                    When you enquire about or book a safari, we collect: name, email address, phone number, nationality,
                    travel dates, accommodation preferences, and special requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Automatically Collected Data</h3>
                  <p className="leading-relaxed">
                    We collect browser type, device information, IP address, and website usage patterns through cookies
                    and analytics tools to improve your experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process safari bookings and enquiries</li>
                <li>Communicate important travel information and updates</li>
                <li>Improve our services and website functionality</li>
                <li>Send promotional offers (only with your consent)</li>
                <li>Comply with legal requirements</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Protection & Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures including SSL encryption, secure payment processing
                through Pesapal, and restricted access to personal data. Your information is stored securely and never
                sold to third parties.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your browsing experience, remember your preferences, and analyze website
                traffic. You can control cookie settings through your browser, though some features may not function
                properly without them.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We partner with trusted service providers (accommodation, payment processors, analytics) who may access
                your information solely to perform services on our behalf. These partners are bound by confidentiality
                agreements.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <div className="bg-accent/30 p-6 rounded-xl">
                <p className="text-foreground font-medium">Email: privacy@kekeosafaris.com</p>
                <p className="text-foreground font-medium">Phone: +255 XXX XXX XXX</p>
                <p className="text-muted-foreground mt-2">We respond to all requests within 30 days.</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-primary hover:underline font-medium">
              ← Return to The Plains
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
