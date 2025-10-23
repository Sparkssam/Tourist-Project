import { BlogPost } from "@/components/blog-post"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <BlogPost slug={params.slug} />
    </div>
  )
}
