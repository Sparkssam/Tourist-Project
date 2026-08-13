"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import { BLOG_POSTS } from "@/lib/blog-data"

interface BlogGridProps {
  activeCategory: string
}

export function BlogGrid({ activeCategory }: BlogGridProps) {
  const filteredPosts =
    activeCategory === "All" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === activeCategory)

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {filteredPosts.map((post) => (
        <article
          key={post.id}
          className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
        >
          {/* Thumbnail */}
          <div className="relative overflow-hidden h-48 sm:h-52 flex-shrink-0">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground font-semibold text-xs border-0 backdrop-blur-sm">
              {post.category}
            </Badge>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-card-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-serif leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="space-y-3 pt-3 border-t border-border mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center justify-between w-full text-xs font-bold text-primary group/link hover:underline"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </article>
      ))}

      {filteredPosts.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-muted-foreground font-serif">No articles found in this category.</p>
        </div>
      )}
    </div>
  )
}
