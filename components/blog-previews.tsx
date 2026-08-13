"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BLOG_POSTS } from "@/lib/blog-data"

export function BlogPreviews() {
  const featuredPosts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Safari Field Journals</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-luxury text-primary mb-3">Wisdom from the Wild</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            Stories, insights, and field advice from guides who have spent decades tracking the rhythms of Tanzania.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold text-xs border-0">
                  {post.category}
                </Badge>
              </div>

              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg text-card-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 mt-auto">
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 font-serif">
                  {post.excerpt}
                </p>

                <Button asChild variant="ghost" className="p-0 h-auto text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline" className="px-8 rounded-xl font-semibold gap-2">
            <Link href="/blog">
              <span>View All Safari Guides</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
