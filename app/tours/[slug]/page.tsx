import { TourDetails } from "@/components/tour-details"
import { TourInquiryForm } from "@/components/tour-inquiry-form"
import { notFound } from "next/navigation"

// This would typically come from a database or CMS
const getTourData = (slug: string) => {
  const tours = {
    "serengeti-ngorongoro-safari": {
      title: "Serengeti & Ngorongoro Safari",
      duration: "5 Days",
      groupSize: "2-8 People",
      location: "Serengeti, Ngorongoro",
      price: "From $1,200",
      rating: 4.9,
      reviews: 127,
      images: [
        "/serengeti-lions-and-wildebeest-migration.png",
        "/ngorongoro-crater-elephants.png",
        "/serengeti-cheetah-hunting.png",
      ],
      description:
        "Experience the ultimate African safari adventure with our 5-day Serengeti and Ngorongoro tour. Witness the Great Migration, spot the Big Five, and explore the world's largest intact volcanic caldera.",
      highlights: [
        "Witness the Great Migration (seasonal)",
        "Spot all Big Five animals",
        "Explore Ngorongoro Crater",
        "Professional safari guide",
        "Luxury tented camps",
        "All meals included",
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Arusha",
          description: "Airport pickup and transfer to hotel. Safari briefing and equipment check.",
        },
        {
          day: 2,
          title: "Arusha to Serengeti",
          description: "Early morning departure to Serengeti. Game drive en route to camp.",
        },
        {
          day: 3,
          title: "Full Day Serengeti",
          description: "Full day game drives in central Serengeti. Search for the Big Five.",
        },
        {
          day: 4,
          title: "Serengeti to Ngorongoro",
          description: "Morning game drive, then travel to Ngorongoro Conservation Area.",
        },
        {
          day: 5,
          title: "Ngorongoro Crater & Departure",
          description: "Crater tour and return to Arusha for departure.",
        },
      ],
      included: [
        "Professional safari guide",
        "4x4 safari vehicle with pop-up roof",
        "All park fees and permits",
        "Accommodation in luxury tented camps",
        "All meals during safari",
        "Airport transfers",
        "Bottled water during game drives",
      ],
      excluded: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Personal expenses",
        "Alcoholic beverages",
        "Tips for guide and camp staff",
      ],
    },
    "kilimanjaro-trekking-adventure": {
      title: "Kilimanjaro Trekking Adventure",
      duration: "7 Days",
      groupSize: "2-12 People",
      location: "Mount Kilimanjaro",
      price: "From $1,800",
      rating: 4.8,
      reviews: 89,
      images: [
        "/mount-kilimanjaro-snow-peak-with-hikers.png",
        "/kilimanjaro-machame-route.jpg",
        "/kilimanjaro-summit-sunrise.jpg",
      ],
      description:
        "Conquer Africa's highest peak via the scenic Machame route with expert guides. This challenging 7-day trek takes you through diverse ecosystems from rainforest to arctic conditions at the summit.",
      highlights: [
        "Summit Uhuru Peak (5,895m)",
        "Scenic Machame Route",
        "Expert mountain guides",
        "All camping equipment provided",
        "Small group sizes",
        "Pre-trek briefing",
      ],
      itinerary: [
        {
          day: 1,
          title: "Machame Gate to Machame Camp",
          description: "Trek through lush rainforest to Machame Camp (3,010m). 5-7 hours hiking.",
        },
        {
          day: 2,
          title: "Machame Camp to Shira Camp",
          description: "Ascend through moorland to Shira Camp (3,840m). 4-6 hours hiking.",
        },
        {
          day: 3,
          title: "Shira Camp to Lava Tower to Barranco",
          description: "Climb high, sleep low day. Lava Tower (4,630m) then descend to Barranco (3,950m).",
        },
        {
          day: 4,
          title: "Barranco to Karanga Camp",
          description: "Tackle the Barranco Wall and trek to Karanga Camp (3,995m). 4-5 hours.",
        },
        {
          day: 5,
          title: "Karanga to Barafu Camp",
          description: "Short trek to Barafu Camp (4,673m). Rest and prepare for summit attempt.",
        },
        {
          day: 6,
          title: "Summit Day - Uhuru Peak",
          description: "Midnight start for Uhuru Peak (5,895m), then descend to Mweka Camp.",
        },
        {
          day: 7,
          title: "Mweka Camp to Mweka Gate",
          description: "Final descent through rainforest to Mweka Gate. Transfer to hotel.",
        },
      ],
      included: [
        "Professional mountain guides",
        "All camping equipment",
        "Park fees and permits",
        "All meals during trek",
        "Porters and cook",
        "Airport transfers",
        "Pre-trek briefing",
      ],
      excluded: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Personal trekking gear",
        "Tips for guides and porters",
        "Hotel accommodation",
      ],
    },
    "cultural-maasai-experience": {
      title: "Cultural Maasai Experience",
      duration: "3 Days",
      groupSize: "2-10 People",
      location: "Maasai Villages",
      price: "From $600",
      rating: 4.7,
      reviews: 156,
      images: [
        "/maasai-warriors-in-traditional-dress-with-village.png",
        "/maasai-traditional-dance.jpg",
        "/maasai-cattle-herding.jpg",
      ],
      description:
        "Immerse yourself in authentic Maasai culture and traditional way of life. Stay in a traditional boma, participate in daily activities, and learn about ancient customs and traditions.",
      highlights: [
        "Stay in traditional Maasai boma",
        "Participate in traditional dances",
        "Learn beadwork and crafts",
        "Cattle herding experience",
        "Traditional Maasai meals",
        "Cultural storytelling sessions",
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival and Welcome Ceremony",
          description: "Traditional welcome ceremony, village tour, and introduction to Maasai customs.",
        },
        {
          day: 2,
          title: "Daily Life Experience",
          description: "Participate in cattle herding, water collection, and traditional craft making.",
        },
        {
          day: 3,
          title: "Cultural Exchange and Departure",
          description: "Traditional dance performance, gift exchange, and farewell ceremony.",
        },
      ],
      included: [
        "Traditional boma accommodation",
        "All meals (traditional Maasai cuisine)",
        "Cultural guide and translator",
        "All cultural activities",
        "Traditional craft materials",
        "Transportation from Arusha",
      ],
      excluded: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Personal expenses",
        "Alcoholic beverages",
        "Tips for guides",
      ],
    },
    "zanzibar-beach-extension": {
      title: "Zanzibar Beach Extension",
      duration: "4 Days",
      groupSize: "2-6 People",
      location: "Zanzibar Island",
      price: "From $800",
      rating: 4.6,
      reviews: 203,
      images: [
        "/zanzibar-white-sand-beach-with-dhow-boats.png",
        "/stone-town-architecture.jpg",
        "/zanzibar-spice-market.jpg",
      ],
      description:
        "Relax on pristine beaches and explore Stone Town's rich history and spice markets. Perfect extension to any safari adventure with cultural tours and beach relaxation.",
      highlights: [
        "UNESCO World Heritage Stone Town",
        "Spice plantation tour",
        "Pristine beach resort",
        "Dhow sunset cruise",
        "Snorkeling excursion",
        "Local cuisine experiences",
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival and Stone Town Tour",
          description: "Airport pickup, Stone Town walking tour, and spice market visit.",
        },
        {
          day: 2,
          title: "Spice Tour and Beach Transfer",
          description: "Morning spice plantation tour, then transfer to beach resort.",
        },
        {
          day: 3,
          title: "Beach Day and Water Activities",
          description: "Snorkeling excursion, dhow sunset cruise, and beach relaxation.",
        },
        {
          day: 4,
          title: "Beach Relaxation and Departure",
          description: "Final beach time, souvenir shopping, and airport transfer.",
        },
      ],
      included: [
        "Beach resort accommodation",
        "All meals at resort",
        "Stone Town guided tour",
        "Spice plantation tour",
        "Dhow sunset cruise",
        "Snorkeling equipment",
        "Airport transfers",
      ],
      excluded: [
        "International flights",
        "Visa fees",
        "Travel insurance",
        "Personal expenses",
        "Alcoholic beverages",
        "Water sports activities",
      ],
    },
  }

  return tours[slug as keyof typeof tours] || null
}

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const tour = getTourData(params.slug)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <TourDetails tour={tour} />
      <TourInquiryForm tourName={tour.title} />
    </div>
  )
}
