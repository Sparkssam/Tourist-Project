import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KEKEOsafari's - Authentic African Safari Adventures",
    short_name: "KEKEOsafari's",
    description:
      "Experience authentic African safaris with KEKEOsafari's. Discover Tanzania's wildlife, culture, and breathtaking landscapes with our expert guides.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5c6f3a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/placeholder-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["travel", "tourism", "safari", "adventure"],
  }
}
