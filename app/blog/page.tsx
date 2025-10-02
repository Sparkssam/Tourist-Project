import { BlogHero } from "@/components/blog-hero"
import { BlogGrid } from "@/components/blog-grid"
import { BlogCategories } from "@/components/blog-categories"
import { Footer } from "@/components/footer"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <BlogHero />
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <BlogCategories />
            <BlogGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
