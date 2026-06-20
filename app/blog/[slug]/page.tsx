import { BlogPost } from "@/components/blog-post"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPost slug={params.slug} />
}
