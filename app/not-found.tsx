import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CompassIcon = () => (
  <svg className="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function NotFound() {
  // Detect if this is a file request (has file extension)
  const isFileRequest = typeof window !== 'undefined' && /\.[a-z0-9]+$/i.test(window.location.pathname)
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <CompassIcon />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold mb-2">
              {isFileRequest ? '404 - File Not Found' : '404 - Page Not Found'}
            </CardTitle>
            <CardDescription className="text-lg">
              {isFileRequest 
                ? "The requested file doesn't exist on our server"
                : "Oops! Looks like you've wandered off the safari trail"
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              {isFileRequest
                ? "The file you're looking for is missing or has been removed."
                : "The page you're looking for doesn't exist or has been moved to a new location."
              }
            </p>
            <p className="text-sm">
              Don't worry, even the best explorers get lost sometimes!
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button asChild variant="default" size="lg" className="w-full">
              <Link href="/" className="flex items-center justify-center gap-2">
                <HomeIcon />
                <span>Back to Home</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/tours" className="flex items-center justify-center gap-2">
                <SearchIcon />
                <span>Explore Tours</span>
              </Link>
            </Button>
          </div>

          {/* Popular Links */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-3 text-center">Popular Pages</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/about" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                About Us
              </Link>
              <Link href="/gallery" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Gallery
              </Link>
              <Link href="/blog" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Blog
              </Link>
              <Link href="/reviews" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Reviews
              </Link>
              <Link href="/contact" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Contact
              </Link>
              <Link href="/inquiries" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Inquiries
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p>Need help? Contact us at</p>
            <a href="mailto:info@kekeosafaris.com" className="text-primary hover:underline font-medium">
              info@kekeosafaris.com
            </a>
            <span className="mx-2">or</span>
            <a href="tel:+255760309999" className="text-primary hover:underline font-medium">
              +255 760 309 999
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
