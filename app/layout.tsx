import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Dancing_Script } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import { Navigation } from "@/components/navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ScrollToTop } from "@/components/scroll-to-top"
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
        className={`font-sans ${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} kijiji-pattern antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <WhatsAppFloat />
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
