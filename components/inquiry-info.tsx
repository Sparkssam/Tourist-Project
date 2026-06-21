import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

export function InquiryInfo() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-luxury text-primary mb-4">Other Ways to Reach Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Prefer to contact us directly? Here are all the ways you can reach our safari experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Speak directly with our safari experts</p>
              <a href="tel:+255760309999" className="text-primary hover:text-primary/80 font-medium">
                +255 760 309 999
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Send us detailed inquiries</p>
              <a href="mailto:info@kekeosafaris.com" className="text-primary hover:text-primary/80 font-medium">
                info@kekeosafaris.com
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">Chat with us instantly</p>
              <a
                href="https://wa.me/255760309999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium"
              >
                +255 760 309 999
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground mb-3">We typically respond within</p>
              <span className="text-primary font-medium">24 hours</span>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Visit Our Office</h3>
              </div>
              <p className="text-muted-foreground mb-2">Arusha, Tanzania</p>
              <p className="text-sm text-muted-foreground">
                Located in the heart of Tanzania's safari capital, we're here to help you plan your perfect adventure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
