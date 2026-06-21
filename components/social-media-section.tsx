"use client"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const InstagramIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

interface SocialMediaSectionProps {
  variant?: "default" | "compact"
  className?: string
}

/**
 * Social Media Section Component
 * Displays social media links with smooth animations
 * Encourages users to explore more visual content on social platforms
 */
export function SocialMediaSection({ variant = "default", className = "" }: SocialMediaSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  const socialLinks = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: "https://instagram.com/yoursafaricompany",
      color: "hover:text-pink-600",
      description: "Daily wildlife moments",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: "https://facebook.com/yoursafaricompany",
      color: "hover:text-blue-600",
      description: "Safari stories & updates",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      url: "https://twitter.com/yoursafaricompany",
      color: "hover:text-sky-500",
      description: "Quick safari tips",
    },
    {
      name: "YouTube",
      icon: YoutubeIcon,
      url: "https://youtube.com/yoursafaricompany",
      color: "hover:text-red-600",
      description: "Safari video adventures",
    },
  ]

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {socialLinks.map((social, index) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110`}
            aria-label={social.name}
          >
            <social.icon />
          </Link>
        ))}
      </div>
    )
  }

  return (
    <section ref={ref} className={`py-16 px-4 bg-gradient-to-br from-olive/5 via-caramel/5 to-arabica/5 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-luxury text-olive mb-4">Follow Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore more wildlife moments, behind-the-scenes stories, and safari inspiration on our social channels
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {socialLinks.map((social, index) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center p-6 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div
                  className={`mb-4 text-muted-foreground ${social.color} transition-all duration-300 group-hover:scale-125`}
                >
                  <social.icon />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{social.name}</h3>
                <p className="text-sm text-muted-foreground text-center">{social.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`text-center mt-10 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Share your safari memories with <span className="font-semibold text-primary">#TanzaniaSafariAdventure</span>
          </p>
        </div>
      </div>
    </section>
  )
}
