import { BlogPost } from "@/components/blog-post"
import { Footer } from "@/components/footer"
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) {
    return {
      title: "Article Not Found - Kekeo Safaris",
    }
  }

  return {
    title: `${post.title} | Kekeo Safaris`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <BlogPost slug={slug} />
      </main>
      <Footer />
    </div>
  )
}
