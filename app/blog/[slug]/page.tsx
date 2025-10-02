import { Navigation } from "@/components/navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { BlogPost } from "@/components/blog-post"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <BlogPost slug={params.slug} />
      </main>
      <WhatsAppFloat />
    </div>
  )
}
