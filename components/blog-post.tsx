import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"

interface BlogPostProps {
  slug: string
}

export function BlogPost({ slug }: BlogPostProps) {
  // In a real app, you'd fetch the post data based on the slug
  const post = {
    title: "Best Time to Visit Serengeti for the Great Migration",
    content: `
      <p>The Great Migration is one of the most spectacular wildlife events on Earth, and timing your visit to the Serengeti is crucial to witness this incredible phenomenon. Here's everything you need to know about when to visit for the best migration experience.</p>
      
      <h2>Understanding the Migration Cycle</h2>
      <p>The Great Migration follows a roughly circular route through the Serengeti-Mara ecosystem, driven by seasonal rains and the search for fresh grazing. Over 1.5 million wildebeest, along with hundreds of thousands of zebras and gazelles, participate in this annual journey.</p>
      
      <h2>January to March: Calving Season</h2>
      <p>This is arguably the most exciting time to visit the Serengeti. The herds are concentrated in the southern Serengeti and Ndutu area, where the short grass plains provide perfect grazing for pregnant females. During this period, you'll witness:</p>
      <ul>
        <li>Over 400,000 calves born in just a few weeks</li>
        <li>Incredible predator action as lions, cheetahs, and hyenas take advantage</li>
        <li>Dramatic scenes of survival and new life</li>
      </ul>
      
      <h2>April to June: The Great Crossing</h2>
      <p>As the dry season approaches, the herds begin their journey north. This is when you might witness the famous river crossings, though timing can be unpredictable. The herds typically reach the Western Corridor and Grumeti River area during this period.</p>
      
      <h2>July to October: Mara River Crossings</h2>
      <p>The herds move into the northern Serengeti and cross into Kenya's Maasai Mara. The Mara River crossings are legendary, with dramatic scenes of wildebeest braving crocodile-infested waters. This is peak season, so expect higher prices and more crowds.</p>
      
      <h2>November to December: The Return Journey</h2>
      <p>The short rains begin, and the herds start their journey back south. This is often considered the best time for photography, with dramatic skies and fewer tourists.</p>
      
      <h2>Planning Your Visit</h2>
      <p>Remember that the migration is a natural phenomenon, and exact timing can vary based on rainfall patterns. We recommend booking flexible itineraries and working with experienced guides who can track the herds' movements in real-time.</p>
      
      <p>At KEKEOsafaris, we monitor the migration year-round and can help you plan the perfect timing for your visit. Contact us to discuss your migration safari dreams!</p>
    `,
    image: "/serengeti-lions-and-wildebeest-migration.png",
    category: "Wildlife",
    author: "Samuel Suya",
    date: "March 15, 2024",
    readTime: "5 min read",
  }

  return (
    <article className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          <Badge className="absolute top-4 left-4" variant="secondary">
            {post.category}
          </Badge>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-luxury text-primary mb-6 text-balance">{post.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-luxury prose-p:text-muted-foreground prose-p:text-pretty prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-luxury text-primary mb-4">Ready to Experience the Great Migration?</h3>
            <p className="text-muted-foreground mb-6 text-balance">
              Let our expert guides help you plan the perfect safari to witness this incredible natural phenomenon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Plan My Safari</Button>
              <Button variant="outline" size="lg">
                Contact Our Experts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  )
}
