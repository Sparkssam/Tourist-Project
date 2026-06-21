import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kekeosafaris.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/inquiries/", "/payment/callback/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
