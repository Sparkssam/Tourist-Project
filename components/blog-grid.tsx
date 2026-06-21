"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)

interface BlogGridProps {
  activeCategory: string
}

export function BlogGrid({ activeCategory }: BlogGridProps) {
  const blogPosts = [
    {
      id: 1,
      title: "Best Time to Visit Serengeti for the Great Migration",
      excerpt:
        "Discover the optimal timing to witness one of nature's most spectacular events - the Great Wildebeest Migration.",
      image: "/serengeti-lions-and-wildebeest-migration.jpeg",
      category: "Wildlife",
      author: "Samuel Msuya",
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
      image: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
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
      image: "/conservation-success-tanzania.jpeg",
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
      author: "Samuel Msuya",
      date: "February 20, 2024",
      readTime: "10 min read",
      slug: "safari-photography-tips",
    },
    {
      id: 6,
      title: "Conquering Kilimanjaro: A Beginner's Guide",
      excerpt: "Everything you need to know about climbing Africa's highest peak, from preparation to summit day.",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
      category: "Mount Kilimanjaro",
      author: "Samuel Msuya",
      date: "February 15, 2024",
      readTime: "12 min read",
      slug: "kilimanjaro-beginners-guide",
    },
  ]

  const { ref, isVisible } = useScrollAnimation(0.1) // Moved hook call to top level

  const filteredPosts =
    activeCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post, index) => {
        return (
          <div
            key={post.id}
            ref={ref}
            className={`transform transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm" variant="secondary">
                  {post.category}
                </Badge>
              </div>

              <CardHeader>
                <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 text-balance">
                  {post.title}
                </h3>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground mb-4 text-pretty font-serif text-xl">{post.excerpt}</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <UserIcon />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-all duration-300 group-hover:translate-x-2"
                  >
                    Read More
                    <ArrowRightIcon />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}

      {filteredPosts.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">No blog posts found in this category.</p>
        </div>
      )}
    </div>
  )
}
