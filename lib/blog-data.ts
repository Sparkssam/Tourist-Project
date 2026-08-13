export interface BlogPostItem {
  id: number
  title: string
  slug: string
  category: string
  author: string
  authorRole: string
  date: string
  readTime: string
  image: string
  excerpt: string
  metaDescription: string
  content: string
}

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: 1,
    slug: "best-time-serengeti-migration",
    title: "Best Time to Visit Serengeti for the Great Migration: Month-by-Month Guide",
    category: "Wildlife",
    author: "Elibariki Basso",
    authorRole: "Founder & Lead Safari Specialist",
    date: "March 15, 2024",
    readTime: "6 min read",
    image: "/serengeti-lions-and-wildebeest-migration.jpeg",
    excerpt:
      "Discover the exact calendar timing to witness nature's greatest wildlife spectacle — from Southern calving to northern Mara River crossings.",
    metaDescription:
      "Complete month-by-month guide to witnessing the Great Wildebeest Migration in Serengeti National Park with expert safari advice from Kekeo Safaris.",
    content: `
      <h2>The Year-Round Clockwork of the Great Migration</h2>
      <p>A common misconception among first-time safari travelers is that the Great Migration is a single event occurring once a year. In reality, it is a continuous, year-round cyclical journey of over 1.5 million blue wildebeest, 400,000 zebras, and 200,000 gazelles across the Serengeti-Mara ecosystem.</p>

      <h3>1. January to March: Southern Calving Season (Ndutu Plains)</h3>
      <p>During these three months, the herds settle in the short-grass plains of Southern Serengeti and Ndutu. In a synchronized biological marvel, over <strong>8,000 calves are born every single day</strong> within a three-week window.</p>
      <ul>
        <li><strong>Why Go:</strong> Highest density of big cat hunts anywhere in Africa. Cheetahs and lion prides stalk open plains.</li>
        <li><strong>Best Camps:</strong> Mobile tented camps in Ndutu and Kusini.</li>
      </ul>

      <h3>2. April to June: The Grumeti River Crossings</h3>
      <p>As the dry season approaches, the herds begin moving northwest into the Western Corridor. In June, they encounter their first major water barrier: the Grumeti River, inhabited by 18-foot Nile crocodiles.</p>

      <h3>3. July to October: Legendary Mara River Crossings</h3>
      <p>The iconic National Geographic scenes unfold here in Northern Serengeti (Kogatende). Herds hesitate on steep cliffs before plunging into rushing waters amid snapping crocodiles and watchful lion prides on the opposite bank.</p>
      <ul>
        <li><strong>Pro-Tip:</strong> Book your northern Serengeti safari at least 6 to 9 months in advance as luxury camps near Kogatende fill up rapidly.</li>
      </ul>

      <h3>4. November to December: The Southbound Journey</h3>
      <p>With the onset of the short rains, fresh green shoots appear in the south. The herds trek back down through Seronera (Central Serengeti), offering splendid game viewing with dramatic afternoon cloud formations and lower tourist numbers.</p>
    `,
  },
  {
    id: 2,
    slug: "tanzania-safari-packing-list",
    title: "The Ultimate Tanzania Safari Packing List: What to Bring & What to Leave",
    category: "Travel Tips",
    author: "Agricola Basso",
    authorRole: "Hospitality & Operations Director",
    date: "March 10, 2024",
    readTime: "7 min read",
    image: "/safari-packing-essentials.png",
    excerpt:
      "Everything you need to pack for comfort, safety, and strict internal flight luggage restrictions on your Tanzanian adventure.",
    metaDescription:
      "Expert packing guide for Tanzania safaris: clothing colors, camera gear, luggage weight limits, electrical plugs, and health essentials.",
    content: `
      <h2>Luggage Essentials: The Golden Rule of Bush Flights</h2>
      <p>If your itinerary includes bush flights between Arusha, Serengeti, or Zanzibar (Coastal Aviation, Auric Air, or Precision Air), luggage is strictly limited to <strong>15 kg (33 lbs) per passenger in soft-sided duffel bags</strong>. Hard suitcases are not permitted in light aircraft baggage holds.</p>

      <h3>Clothing Colors: What to Wear and What to Avoid</h3>
      <ul>
        <li><strong>Wear Khaki, Olive, Beige, and Muted Browns:</strong> Blend naturally into the savanna so animals feel comfortable approaching your vehicle.</li>
        <li><strong>Avoid Dark Blue & Black:</strong> These colors attract Tsetse flies in wooded zones like Tarangire.</li>
        <li><strong>Avoid Bright Whites & Neon:</strong> Draws unnecessary attention and quickly gets covered in red savanna dust.</li>
      </ul>

      <h3>Footwear and Layering</h3>
      <p>Early morning game drives at 6:00 AM in Ngorongoro can drop to 10°C (50°F), while afternoons reach 30°C (86°F). Layering is critical: lightweight fleece, windbreaker jacket, breathable long-sleeve safari shirts, and convertible zip-off trousers.</p>

      <h3>Essential Gear & Electronics</h3>
      <ul>
        <li>Binoculars (8x42 or 10x42 magnification recommended per person)</li>
        <li>Telephoto camera lens (minimum 300mm to 600mm)</li>
        <li>UK Type G three-pin plug adapters (all Kekeo Safaris 4x4 vehicles feature onboard USB/220V charging ports)</li>
        <li>High-SPF sunscreen, wide-brim hat, and polarized sunglasses</li>
      </ul>
    `,
  },
  {
    id: 3,
    slug: "maasai-cultural-experience",
    title: "Meeting the Maasai: A Guide to Authentic & Respectful Cultural Encounters",
    category: "Cultural Experiences",
    author: "Imran Abdallah",
    authorRole: "Maasai Cultural Coordinator",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
    excerpt:
      "How to participate in genuine, respectful cultural exchanges that empower indigenous Maasai communities and preserve ancestral traditions.",
    metaDescription:
      "Discover authentic Maasai cultural visits in the Ngorongoro Highlands. Learn about traditional bomas, the Adumu jumping dance, and community-led tourism.",
    content: `
      <h2>The Living Heritage of East Africa</h2>
      <p>The Maasai people are perhaps Africa's most iconic pastoralist community, having coexisted harmoniously with East Africa's wildlife for centuries without hunting for food. At Kekeo Safaris, we partner directly with elders of authentic traditional bomas in the Ngorongoro Highlands.</p>

      <h3>What to Expect During a Traditional Boma Visit</h3>
      <ul>
        <li><strong>The Welcoming Adumu Dance:</strong> The famous jumping dance where young warriors (Morans) demonstrate their stamina and agility.</li>
        <li><strong>Inside the Manyatta:</strong> Enter traditional earth-and-thatch dwellings constructed entirely by Maasai women.</li>
        <li><strong>Medicinal Bush Walk:</strong> Learn how local plants are used for healing, bush survival, and ceremonial blessings.</li>
        <li><strong>Direct Community Support:</strong> Village entry fees go directly into school funds, borehole clean water systems, and local women's beading cooperatives.</li>
      </ul>
    `,
  },
  {
    id: 4,
    slug: "tanzania-conservation-success",
    title: "Conservation Success Stories: How Responsible Tourism Protects Tanzania's Wildlife",
    category: "Conservation",
    author: "Samuel Msuya",
    authorRole: "Senior Serengeti Guide",
    date: "February 28, 2024",
    readTime: "8 min read",
    image: "/conservation-success-tanzania.jpeg",
    excerpt:
      "How conscious travelers and ethical safari operators are securing the future of Africa's endangered rhinos and big cats.",
    metaDescription:
      "Learn how community-based anti-poaching initiatives, TANAPA conservation fees, and ethical safari tourism protect Tanzania's biodiversity.",
    content: `
      <h2>Tourism as the Frontline of Wildlife Protection</h2>
      <p>Tanzania has dedicated over <strong>38% of its total landmass</strong> to national parks, game reserves, and marine sanctuaries — one of the highest conservation percentages on earth.</p>

      <h3>The Revival of the Black Rhino in Ngorongoro & Serengeti</h3>
      <p>Through round-the-clock ranger patrols, satellite tracking collars, and community intelligence networks funded by park fees, black rhino populations in the Ngorongoro Conservation Area and Serengeti Moru Kopjes have doubled over the past decade.</p>

      <h3>Empowering Local Ranger Units</h3>
      <p>A portion of every safari booked with Kekeo Safaris directly funds local ranger equipment, anti-snare de-snaring teams, and educational field trips for village children living on park borders.</p>
    `,
  },
  {
    id: 5,
    slug: "safari-photography-tips",
    title: "Mastering Safari Photography: Expert Tips from Field Guides",
    category: "Photography",
    author: "Samuel Msuya",
    authorRole: "Senior Serengeti Guide",
    date: "February 20, 2024",
    readTime: "9 min read",
    image: "/safari-photography-tips.png",
    excerpt:
      "Camera settings, focal lengths, beanbag stabilization, and lighting secrets to capture National Geographic-worthy safari images.",
    metaDescription:
      "Top wildlife photography tips for your Tanzania safari. Shutter speeds for predators, eye-level framing, dust protection, and golden hour lighting.",
    content: `
      <h2>1. Understand Animal Behavior Before You Shoot</h2>
      <p>The secret to incredible wildlife photography is anticipation. A hunting cheetah will flick its tail and fix its gaze minutes before sprinting. Our driver-guides position the vehicle with the sun behind you and leave space ahead of the predator's flight path.</p>

      <h3>2. Essential Camera Gear & Settings</h3>
      <ul>
        <li><strong>Focal Length:</strong> 100-400mm or 150-600mm zoom lenses offer the best versatility between landscape context and intimate eye portraits.</li>
        <li><strong>Shutter Speed:</strong> Keep at minimum 1/1600s for running predators or birds in flight; 1/500s for resting animals.</li>
        <li><strong>Aperture:</strong> f/4 to f/5.6 creates pleasing subject separation and creamy background bokeh.</li>
        <li><strong>Vehicle Stabilization:</strong> Use beanbags resting on the safari pop-up roof rather than rigid tripods.</li>
      </ul>
    `,
  },
  {
    id: 6,
    slug: "kilimanjaro-beginners-guide",
    title: "Conquering Kilimanjaro: Which Route is Best for First-Time Climbers?",
    category: "Mount Kilimanjaro",
    author: "Elibariki Basso",
    authorRole: "Lead Mountain Specialist",
    date: "February 15, 2024",
    readTime: "11 min read",
    image: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
    excerpt:
      "Machame vs. Lemosho vs. Marangu — compare summit success rates, scenic profiles, and altitude acclimatization strategies.",
    metaDescription:
      "Complete comparison guide for climbing Mount Kilimanjaro (5,895m). Discover route profiles, summit success rates, fitness preparation, and gear.",
    content: `
      <h2>The Roof of Africa: 5,895 Meters (19,341 Feet)</h2>
      <p>Mount Kilimanjaro is the highest free-standing mountain on planet earth and the easiest of the Seven Summits to trek without technical mountaineering equipment. However, high altitude demands strategic acclimatization.</p>

      <h3>Route Comparison: Summit Success Rates</h3>
      <ul>
        <li><strong>Lemosho Route (7–8 Days): 90%+ Summit Success.</strong> Highly recommended for first-timers. Crosses the Shira Plateau with gradual ascent and breathtaking panoramic vistas.</li>
        <li><strong>Machame 'Whiskey' Route (6–7 Days): 85% Success.</strong> The most popular scenic trail featuring the famous Barranco Wall scramble. Excellent 'climb high, sleep low' profile.</li>
        <li><strong>Marangu 'Coca-Cola' Route (5–6 Days): 65% Success.</strong> The only route with sleeping huts instead of tents. Shorter duration means less acclimatization time and lower summit rates.</li>
        <li><strong>Northern Circuit (9 Days): 95%+ Success.</strong> The longest and most remote trail, circling the quiet northern slopes.</li>
      </ul>
    `,
  },
]

export function getBlogPostBySlug(slug: string): BlogPostItem | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
