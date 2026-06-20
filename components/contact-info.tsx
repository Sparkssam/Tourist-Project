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
              <p className="text-muted-foreground">+255 760 309 999</p>
              <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">samsuya999@gmail.com</p>
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
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call +255760309999
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp Chat
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Us
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
