import { ReviewsHero } from "@/components/reviews-hero"
import { ReviewsGrid } from "@/components/reviews-grid"
import { ReviewStats } from "@/components/review-stats"
import { ReviewForm } from "@/components/review-form"
import { Footer } from "@/components/footer"

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ReviewsHero />
        <ReviewStats />
        <ReviewsGrid />
        <ReviewForm />
      </main>
      <Footer />
    </div>
  )
}
