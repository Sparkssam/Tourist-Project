import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function ContactMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-luxury text-primary flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Find Us in Arusha
        </CardTitle>
        <p className="text-muted-foreground">Located in the heart of Tanzania's safari capital.</p>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
          {/* Placeholder for map - in a real app, you'd integrate with Google Maps or similar */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-lg font-medium text-primary">Arusha, Tanzania</p>
              <p className="text-sm text-muted-foreground">Gateway to Serengeti & Kilimanjaro</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-serif text-lg">
            Arusha is the perfect starting point for your Tanzanian adventure, located just hours from the Serengeti,
            Ngorongoro Crater, and Mount Kilimanjaro.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
