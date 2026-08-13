"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowLeft, Share2, Send, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data"
import { notFound } from "next/navigation"

interface BlogPostProps {
  slug: string
}

export function BlogPost({ slug }: BlogPostProps) {
  const post = getBlogPostBySlug(slug) || BLOG_POSTS[0]

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(() => {})
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <article className="py-10 sm:py-14 px-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <div>
          <Link href="/blog">
            <Button variant="ghost" className="pl-0 gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Safari Guides & Articles</span>
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[300px] sm:h-[450px]">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold text-xs border-0 shadow">
            {post.category}
          </Badge>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs text-amber-300 font-semibold">{post.authorRole}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary leading-tight text-balance">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-4 w-4 text-primary" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <Button onClick={handleShare} variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-10">
            <div
              className="prose prose-base sm:prose-lg max-w-none prose-headings:text-primary prose-headings:font-luxury prose-headings:font-bold prose-p:text-card-foreground prose-p:font-serif prose-p:leading-relaxed prose-li:text-card-foreground prose-strong:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border border-primary/20 bg-primary/5 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-luxury text-primary">
              Ready to Experience Tanzania in Real Life?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-serif leading-relaxed">
              Our native Tanzanian safari guides customize every detail from private 4x4 vehicles to luxury tented camps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="rounded-xl font-bold gap-2">
                <Link href="/inquiry">
                  <span>Plan My Safari</span>
                  <Send className="w-4 h-4" />
                </Link>
              </Button>
              <a
                href="https://wa.me/255766860273"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Guide on WhatsApp</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  )
}
