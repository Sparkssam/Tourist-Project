import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">Lost in the Savannah</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The trail you're following has gone cold. Let's get you back on track to discover Tanzania's wonders.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Return to The Plains
            </Button>
          </Link>
          <Link href="/tours">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Explore Routes
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Need assistance finding your way?</p>
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Contact Our Guides
          </Link>
        </div>
      </div>
    </div>
  )
}
