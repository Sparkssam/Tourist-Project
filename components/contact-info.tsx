import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react"

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-luxury text-primary">Contact Information</CardTitle>
        <p className="text-muted-foreground">Get in touch with us through any of these channels.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Phone</p>
              <a href="tel:+255766860273" className="text-muted-foreground hover:text-primary transition-colors">
                +255 766 860 273
              </a>
              <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:doubleebariki@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                doubleebariki@gmail.com
              </a>
              <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Office Location</p>
              <p className="text-muted-foreground">Arusha, Tanzania</p>
              <p className="text-sm text-muted-foreground">Gateway to Northern Safari Circuit</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Business Hours</p>
              <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM EAT</p>
              <p className="text-muted-foreground">Sat - Sun: 9:00 AM - 4:00 PM EAT</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <h4 className="font-medium">Quick Contact</h4>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <a href="tel:+255766860273">
                <Phone className="h-4 w-4 mr-2" />
                Call +255 766 860 273
              </a>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <a href="https://wa.me/255766860273" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp Chat
              </a>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <a href="mailto:doubleebariki@gmail.com">
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
