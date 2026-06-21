import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MapPinIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export function ContactMap() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-luxury text-primary flex items-center gap-2">
          <MapPinIcon />
          Find Us in Arusha
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Located in the heart of Tanzania's safari capital, gateway to Africa's greatest wildlife spectacles.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Location Image with Overlay */}
        <div className="relative h-80 overflow-hidden">
          <img
            src="/arusha-tanzania-city-skyline-with-mount-meru-backg.jpg"
            alt="Arusha, Tanzania - Safari Capital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Location Details Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start gap-3 mb-4">
              <MapPinIcon />
              <div>
                <p className="font-semibold text-lg mb-1">KEKEOsafari's Headquarters</p>
                <p className="text-sm opacity-90">Arusha, Tanzania</p>
                <p className="text-sm opacity-90">Gateway to Serengeti, Ngorongoro & Kilimanjaro</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold">2hrs</p>
                <p className="text-xs opacity-80">to Serengeti</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">45min</p>
                <p className="text-xs opacity-80">to Kilimanjaro</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1.5hrs</p>
                <p className="text-xs opacity-80">to Ngorongoro</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
