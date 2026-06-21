import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogPreviews() {
  const blogPosts = [
    {
      slug: "best-time-visit-serengeti-great-migration",
      title: "When Earth Moves: Timing Your Migration Encounter",
      excerpt:
        "The Great Migration doesn't follow calendars—it follows rain, instinct, and ancient pathways. Here's how to align your journey with nature's grandest procession.",
      image: "/wildebeest-migration-crossing-river.png",
      date: "March 15, 2024",
      category: "Wildlife Wisdom",
      readTime: "6 min read",
    },
    {
      slug: "essential-packing-list-tanzania-safari",
      title: "Pack Light, See More: The Safari Essentials",
      excerpt:
        "What you bring matters less than what you're ready to receive. A guide to packing smart so you can be fully present in the wild.",
      image: "/safari-packing-gear-binoculars-hat.png",
      date: "March 10, 2024",
      category: "Travel Wisdom",
      readTime: "7 min read",
    },
    {
      slug: "understanding-maasai-culture-respectful-guide",
      title: "Walking with Warriors: Honoring Maasai Traditions",
      excerpt:
        "Cultural immersion begins with humility and deep respect. Learn how to be a gracious guest in communities whose wisdom predates written history.",
      image: "/maasai-elder-traditional-beads-jewelry.jpeg",
      date: "March 5, 2024",
      category: "Cultural Connections",
      readTime: "8 min read",
    },
  ]

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-luxury text-primary mb-4">Wisdom from the Wild</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            Stories, insights, and hard-won knowledge from guides who've spent decades reading the rhythms of Africa.
            This is the intelligence that transforms tourists into travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{post.category}</Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-card-foreground text-balance line-clamp-2 font-serif">
                  {post.title}
                </CardTitle>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 text-pretty line-clamp-3 font-serif">{post.excerpt}</p>

                <Button asChild variant="ghost" className="p-0 h-auto text-sm font-semibold text-primary hover:text-primary/80">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="px-8 bg-transparent">
            <Link href="/blog">Read More Trail Tales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
