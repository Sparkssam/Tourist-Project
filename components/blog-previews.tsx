import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogPreviews() {
  const blogPosts = [
    {
      slug: "best-time-visit-serengeti-great-migration",
      title: "Best Time to Visit Serengeti for the Great Migration",
      excerpt:
        "Discover the optimal months to witness millions of wildebeest and zebras crossing the Serengeti plains.",
      image: "/wildebeest-migration-crossing-river.png",
      date: "March 15, 2024",
      category: "Wildlife",
      readTime: "5 min read",
    },
    {
      slug: "essential-packing-list-tanzania-safari",
      title: "Essential Packing List for Your Tanzania Safari",
      excerpt: "Everything you need to pack for a comfortable and successful safari adventure in Tanzania.",
      image: "/safari-packing-gear-binoculars-hat.png",
      date: "March 10, 2024",
      category: "Travel Tips",
      readTime: "7 min read",
    },
    {
      slug: "understanding-maasai-culture-respectful-guide",
      title: "Understanding Maasai Culture: A Respectful Guide",
      excerpt: "Learn about the rich traditions and customs of the Maasai people before your cultural visit.",
      image: "/maasai-elder-traditional-beads-jewelry.png",
      date: "March 5, 2024",
      category: "Culture",
      readTime: "6 min read",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-luxury text-primary mb-6">Safari Insights & Tips</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            Expert advice and insider knowledge to help you make the most of your African adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{post.category}</Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-card-foreground text-balance line-clamp-2 font-serif">{post.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-pretty line-clamp-3 font-serif">{post.excerpt}</p>

                <Button asChild variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
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
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
