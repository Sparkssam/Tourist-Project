import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BlogGrid() {
  const blogPosts = [
    {
      id: 1,
      title: "Best Time to Visit Serengeti for the Great Migration",
      excerpt:
        "Discover the optimal timing to witness one of nature's most spectacular events - the Great Wildebeest Migration.",
      image: "/serengeti-lions-and-wildebeest-migration.png",
      category: "Wildlife",
      author: "Samuel Suya",
      date: "March 15, 2024",
      readTime: "5 min read",
      slug: "best-time-serengeti-migration",
    },
    {
      id: 2,
      title: "Essential Packing List for Your Tanzania Safari",
      excerpt: "Everything you need to pack for a comfortable and successful safari adventure in Tanzania.",
      image: "/safari-packing-essentials.png",
      category: "Travel Tips",
      author: "Grace Mwangi",
      date: "March 10, 2024",
      readTime: "7 min read",
      slug: "tanzania-safari-packing-list",
    },
    {
      id: 3,
      title: "Meeting the Maasai: A Cultural Journey",
      excerpt: "Experience the rich traditions and warm hospitality of Tanzania's iconic Maasai people.",
      image: "/maasai-warriors-in-traditional-dress-with-village.png",
      category: "Cultural Experiences",
      author: "Maria Temba",
      date: "March 5, 2024",
      readTime: "6 min read",
      slug: "maasai-cultural-experience",
    },
    {
      id: 4,
      title: "Conservation Success Stories in Tanzania",
      excerpt: "How local communities and conservation efforts are protecting Tanzania's incredible wildlife.",
      image: "/conservation-success-tanzania.png",
      category: "Conservation",
      author: "Joseph Kimani",
      date: "February 28, 2024",
      readTime: "8 min read",
      slug: "tanzania-conservation-success",
    },
    {
      id: 5,
      title: "Photography Tips for Your Safari Adventure",
      excerpt: "Capture stunning wildlife photos with these expert tips from our professional guides.",
      image: "/safari-photography-tips.png",
      category: "Photography",
      author: "Samuel Suya",
      date: "February 20, 2024",
      readTime: "10 min read",
      slug: "safari-photography-tips",
    },
    {
      id: 6,
      title: "Conquering Kilimanjaro: A Beginner's Guide",
      excerpt: "Everything you need to know about climbing Africa's highest peak, from preparation to summit day.",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      category: "Mount Kilimanjaro",
      author: "Samuel Suya",
      date: "February 15, 2024",
      readTime: "12 min read",
      slug: "kilimanjaro-beginners-guide",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.map((post) => (
        <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
          <div className="relative overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-4 left-4" variant="secondary">
              {post.category}
            </Badge>
          </div>

          <CardHeader>
            <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 text-balance">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4 text-pretty font-serif text-xl">{post.excerpt}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              </div>
              <span>{post.readTime}</span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
            >
              Read More
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
