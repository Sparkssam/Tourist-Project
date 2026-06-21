import type React from "react"
import type { Metadata } from "next"

import { Navigation } from "@/components/navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ScrollToTop } from "@/components/scroll-to-top"
import { EnquiryBanner } from "@/components/enquiry-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

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

import { Inter, JetBrains_Mono, Dancing_Script, Libre_Baskerville as V0_Font_Libre_Baskerville, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, Lora as V0_Font_Lora } from 'next/font/google'

// Initialize fonts
const _libreBaskerville = V0_Font_Libre_Baskerville({ subsets: ['latin'], weight: ["400","700"], variable: '--v0-font-libre-baskerville' })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"], variable: '--v0-font-ibm-plex-mono' })
const _lora = V0_Font_Lora({ subsets: ['latin'], weight: ["400","500","600","700"], variable: '--v0-font-lora' })
const _v0_fontVariables = `${_libreBaskerville.variable} ${_ibmPlexMono.variable} ${_lora.variable}`

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
        className={`font-serif ${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} kijiji-pattern antialiased ${_v0_fontVariables}`}
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
