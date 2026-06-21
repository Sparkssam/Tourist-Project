import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Dancing_Script, Libre_Baskerville, IBM_Plex_Mono, Lora } from 'next/font/google'

import { Navigation } from "@/components/navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ScrollToTop } from "@/components/scroll-to-top"
import { EnquiryBanner } from "@/components/enquiry-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

// Initialize fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dancing-script",
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ["400","700"],
  display: "swap",
  variable: '--font-libre-baskerville'
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ["100","200","300","400","500","600","700"],
  display: "swap",
  variable: '--font-ibm-plex-mono'
})

const lora = Lora({
  subsets: ['latin'],
  weight: ["400","500","600","700"],
  display: "swap",
  variable: '--font-lora'
})

export const metadata: Metadata = {
  title: "KEKEOsafari's - Your Adventure of a Lifetime Awaits in Tanzania",
  description:
    "Experience authentic African safaris with KEKEOsafari's. Discover Tanzania's wildlife, culture, and breathtaking landscapes with our expert guides.",
  generator: "v0.app",
  keywords: "Tanzania safari, African wildlife, cultural tours, adventure travel, Serengeti, Ngorongoro, Kilimanjaro",
  authors: [{ name: "KEKEOsafari's" }],
  openGraph: {
    title: "KEKEOsafari's - Authentic African Safari Adventures",
    description: "Experience the adventure of a lifetime with our authentic African safari tours in Tanzania.",
    type: "website",
    locale: "en_US",
    url: "https://kekeosafaris.com",
    siteName: "KEKEOsafari's",
  },
  twitter: {
    card: "summary_large_image",
    title: "KEKEOsafari's - Authentic African Safari Adventures",
    description: "Experience the adventure of a lifetime with our authentic African safari tours in Tanzania.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-serif ${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable} ${lora.variable} antialiased`}
      >
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <WhatsAppFloat />
          <ScrollToTop />
          <EnquiryBanner />
          <CookieConsent />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
