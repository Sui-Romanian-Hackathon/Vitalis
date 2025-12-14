// Mock businesses and services data
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  onChainId?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string; // emoji or icon
  location: string;
  rating: number;
  reviewCount: number;
  onChainId?: string;
  services: Service[];
  providers: Provider[];
  openingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
}

export const businesses: Business[] = [
  {
    id: "biz-1",
    name: "Cluj Hair Atelier",
    description: "Signature cuts, color, and treatments by top stylists in Cluj-Napoca",
    category: "Hair & Beauty",
    image: "💇‍♀️",
    location: "Cluj-Napoca, Romania",
    rating: 4.9,
    reviewCount: 324,
    onChainId: "0x6d8e431be903e6c489cbed98c62cdf0268a9d4fd83c3b88d7b977d49c3ffd317",
    openingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "10:00", close: "16:00" },
    },
    services: [
      {
        id: "svc-1-1",
        name: "Precision Haircut",
        description: "Tailored cut with wash and style",
        duration: 45,
        price: 120,
      },
      {
        id: "svc-1-2",
        name: "Balayage & Tone",
        description: "Freehand lightening with custom toner",
        duration: 120,
        price: 380,
      },
      {
        id: "svc-1-3",
        name: "Keratin Smoothing",
        description: "Frizz control and shine boost treatment",
        duration: 120,
        price: 450,
      },
      {
        id: "svc-1-4",
        name: "Consultation",
        description: "Style and color plan with a lead stylist",
        duration: 20,
        price: 0,
      },
    ],
    providers: [
      {
        id: "prov-1-1",
        name: "Andreea Pop",
        specialty: "Color & Balayage",
        rating: 4.9,
        onChainId: "0xcf5b84c1a2926dd35ec1e980ae3cdc29d2140927a6aa5fcb403eb867ec46a582",
      },
      {
        id: "prov-1-2",
        name: "Mihai Ionescu",
        specialty: "Precision Cuts",
        rating: 4.8,
      },
      {
        id: "prov-1-3",
        name: "Elena Radu",
        specialty: "Keratin Treatments",
        rating: 4.7,
      },
    ],
  },
  {
    id: "biz-2",
    name: "Napoca Style Studio",
    description: "Color artistry, blonding, and healthy hair care in the heart of Cluj",
    category: "Hair & Beauty",
    image: "✂️",
    location: "Cluj-Napoca, Romania",
    rating: 4.8,
    reviewCount: 287,
    openingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "21:00" },
      friday: { open: "08:00", close: "21:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { open: "10:00", close: "17:00" },
    },
    services: [
      {
        id: "svc-2-1",
        name: "Signature Blowout",
        description: "Wash, scalp massage, and long-lasting finish",
        duration: 60,
        price: 110,
      },
      {
        id: "svc-2-2",
        name: "Full Color Refresh",
        description: "All-over color with gloss finish",
        duration: 90,
        price: 230,
      },
      {
        id: "svc-2-3",
        name: "Highlights & Toner",
        description: "Foil highlights with toner and bond builder",
        duration: 120,
        price: 340,
      },
      {
        id: "svc-2-4",
        name: "Scalp Spa Ritual",
        description: "Detox scrub, mask, and scalp massage",
        duration: 50,
        price: 150,
      },
      {
        id: "svc-2-5",
        name: "Bridal Trial & Style",
        description: "Consultation, trial updo, and day-of plan",
        duration: 120,
        price: 400,
      },
    ],
    providers: [
      {
        id: "prov-2-1",
        name: "Laura Muresan",
        specialty: "Blonding & Foils",
        rating: 4.9,
      },
      {
        id: "prov-2-2",
        name: "Irina Stan",
        specialty: "Updos & Bridal",
        rating: 4.8,
      },
      {
        id: "prov-2-3",
        name: "Radu Marinescu",
        specialty: "Men's Cuts",
        rating: 4.7,
      },
    ],
  },
  {
    id: "biz-3",
    name: "Transylvanian Glow Salon",
    description: "Glossing, treatments, and vibrant color focused on hair health",
    category: "Hair & Beauty",
    image: "💎",
    location: "Cluj-Napoca, Romania",
    rating: 4.95,
    reviewCount: 412,
    openingHours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "09:00", close: "19:00" },
      sunday: { open: "11:00", close: "18:00" },
    },
    services: [
      {
        id: "svc-3-1",
        name: "Lived-in Blonde",
        description: "Soft balayage with root melt and gloss",
        duration: 150,
        price: 400,
      },
      {
        id: "svc-3-2",
        name: "Color Correction",
        description: "Multi-step correction with bond rebuilding",
        duration: 180,
        price: 600,
      },
      {
        id: "svc-3-3",
        name: "Luxury Hair Spa",
        description: "Mask, steam, scalp massage, and trim",
        duration: 75,
        price: 180,
      },
      {
        id: "svc-3-4",
        name: "Gloss & Haircut",
        description: "Shine gloss with shaping cut",
        duration: 70,
        price: 170,
      },
      {
        id: "svc-3-5",
        name: "Event Waves",
        description: "Heat styling and finishing for events",
        duration: 60,
        price: 130,
      },
    ],
    providers: [
      {
        id: "prov-3-1",
        name: "Alexandra Neves",
        specialty: "Color Correction",
        rating: 4.95,
      },
      {
        id: "prov-3-2",
        name: "Victoria Sterling",
        specialty: "Styling & Waves",
        rating: 4.9,
      },
      {
        id: "prov-3-3",
        name: "James Wilson",
        specialty: "Treatments",
        rating: 4.8,
      },
    ],
  },
  {
    id: "biz-4",
    name: "Central Park Barber & Color",
    description: "Modern barbering, fades, and creative color in Cluj",
    category: "Hair & Beauty",
    image: "💈",
    location: "Cluj-Napoca, Romania",
    rating: 4.7,
    reviewCount: 198,
    openingHours: {
      monday: { open: "11:00", close: "20:00" },
      tuesday: { open: "11:00", close: "20:00" },
      wednesday: { open: "11:00", close: "20:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "21:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "11:00", close: "17:00" },
    },
    services: [
      {
        id: "svc-4-1",
        name: "Skin Fade & Beard",
        description: "Fade, beard sculpt, and hot towel",
        duration: 50,
        price: 100,
      },
      {
        id: "svc-4-2",
        name: "Gray Blending",
        description: "Natural-looking gray camo for men",
        duration: 45,
        price: 130,
      },
      {
        id: "svc-4-3",
        name: "Creative Color",
        description: "Vivid or pastel application with protectant",
        duration: 120,
        price: 300,
      },
    ],
    providers: [
      {
        id: "prov-4-1",
        name: "Sorin Matei",
        specialty: "Fades & Beard",
        rating: 4.7,
      },
      {
        id: "prov-4-2",
        name: "David Kim",
        specialty: "Color & Camouflage",
        rating: 4.6,
      },
    ],
  },
  {
    id: "biz-5",
    name: "Elite Beauty Center",
    description: "Premium facial treatments, skincare, and microblading services",
    category: "Beauty & Aesthetics",
    image: "✨",
    location: "Cluj-Napoca, Romania",
    rating: 4.85,
    reviewCount: 256,
    openingHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "10:00", close: "17:00" },
      sunday: { open: "Closed", close: "Closed" },
    },
    services: [
      {
        id: "svc-5-1",
        name: "HydraFacial Treatment",
        description: "Deep cleansing, extraction, and hydration",
        duration: 60,
        price: 280,
      },
      {
        id: "svc-5-2",
        name: "Microblading",
        description: "Natural-looking eyebrow enhancement",
        duration: 120,
        price: 550,
      },
      {
        id: "svc-5-3",
        name: "Chemical Peel",
        description: "Advanced skin resurfacing treatment",
        duration: 45,
        price: 220,
      },
      {
        id: "svc-5-4",
        name: "LED Light Therapy",
        description: "Anti-aging and acne treatment with LED",
        duration: 30,
        price: 150,
      },
    ],
    providers: [
      {
        id: "prov-5-1",
        name: "Dr. Maria Popescu",
        specialty: "Aesthetic Medicine",
        rating: 4.9,
      },
      {
        id: "prov-5-2",
        name: "Diana Luca",
        specialty: "Microblading",
        rating: 4.8,
      },
    ],
  },
  {
    id: "biz-6",
    name: "Radiant Spa & Wellness",
    description: "Massage therapy, body treatments, and holistic wellness",
    category: "Spa & Wellness",
    image: "🧘‍♀️",
    location: "Cluj-Napoca, Romania",
    rating: 4.75,
    reviewCount: 189,
    openingHours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "09:00", close: "19:00" },
      sunday: { open: "10:00", close: "18:00" },
    },
    services: [
      {
        id: "svc-6-1",
        name: "Deep Tissue Massage",
        description: "Therapeutic massage for muscle tension",
        duration: 60,
        price: 200,
      },
      {
        id: "svc-6-2",
        name: "Hot Stone Therapy",
        description: "Relaxing massage with heated stones",
        duration: 90,
        price: 280,
      },
      {
        id: "svc-6-3",
        name: "Body Scrub & Wrap",
        description: "Exfoliation and nourishing body wrap",
        duration: 75,
        price: 240,
      },
      {
        id: "svc-6-4",
        name: "Aromatherapy Session",
        description: "Essential oil massage for relaxation",
        duration: 60,
        price: 220,
      },
    ],
    providers: [
      {
        id: "prov-6-1",
        name: "Ana Moldovan",
        specialty: "Massage Therapy",
        rating: 4.8,
      },
      {
        id: "prov-6-2",
        name: "Cristian Vasilescu",
        specialty: "Sports Massage",
        rating: 4.7,
      },
    ],
  },
  {
    id: "biz-7",
    name: "Perfect Nails Studio",
    description: "Luxury manicures, pedicures, and nail art design",
    category: "Nails & Beauty",
    image: "💅",
    location: "Cluj-Napoca, Romania",
    rating: 4.9,
    reviewCount: 342,
    openingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "11:00", close: "17:00" },
    },
    services: [
      {
        id: "svc-7-1",
        name: "Gel Manicure",
        description: "Long-lasting gel polish with nail care",
        duration: 45,
        price: 90,
      },
      {
        id: "svc-7-2",
        name: "Luxury Pedicure",
        description: "Spa pedicure with massage and polish",
        duration: 60,
        price: 120,
      },
      {
        id: "svc-7-3",
        name: "Nail Art Design",
        description: "Custom nail art and embellishments",
        duration: 75,
        price: 150,
      },
      {
        id: "svc-7-4",
        name: "Acrylic Extensions",
        description: "Full set of acrylic nail extensions",
        duration: 90,
        price: 180,
      },
    ],
    providers: [
      {
        id: "prov-7-1",
        name: "Ioana Dragomir",
        specialty: "Nail Art",
        rating: 4.95,
      },
      {
        id: "prov-7-2",
        name: "Raluca Petrescu",
        specialty: "Gel Nails",
        rating: 4.85,
      },
    ],
  },
  {
    id: "biz-8",
    name: "Brow & Lash Boutique",
    description: "Eyebrow shaping, lash extensions, and permanent makeup",
    category: "Beauty & Aesthetics",
    image: "👁️",
    location: "Cluj-Napoca, Romania",
    rating: 4.8,
    reviewCount: 267,
    openingHours: {
      monday: { open: "10:00", close: "18:00" },
      tuesday: { open: "10:00", close: "18:00" },
      wednesday: { open: "10:00", close: "18:00" },
      thursday: { open: "10:00", close: "19:00" },
      friday: { open: "10:00", close: "19:00" },
      saturday: { open: "10:00", close: "17:00" },
      sunday: { open: "Closed", close: "Closed" },
    },
    services: [
      {
        id: "svc-8-1",
        name: "Lash Extensions",
        description: "Classic or volume lash extensions",
        duration: 90,
        price: 250,
      },
      {
        id: "svc-8-2",
        name: "Brow Lamination",
        description: "Semi-permanent brow styling",
        duration: 45,
        price: 140,
      },
      {
        id: "svc-8-3",
        name: "Lash Lift & Tint",
        description: "Natural lash enhancement with curl and color",
        duration: 60,
        price: 160,
      },
      {
        id: "svc-8-4",
        name: "Brow Tinting",
        description: "Professional eyebrow tinting",
        duration: 30,
        price: 70,
      },
    ],
    providers: [
      {
        id: "prov-8-1",
        name: "Gabriela Ionita",
        specialty: "Lash Extensions",
        rating: 4.9,
      },
      {
        id: "prov-8-2",
        name: "Simona Gheorghe",
        specialty: "Brow Design",
        rating: 4.75,
      },
    ],
  },
  {
    id: "biz-9",
    name: "Urban Skin Clinic",
    description: "Medical-grade skincare, lasers, and anti-aging treatments",
    category: "Medical Aesthetics",
    image: "🏥",
    location: "Cluj-Napoca, Romania",
    rating: 4.92,
    reviewCount: 301,
    openingHours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "15:00" },
      sunday: { open: "Closed", close: "Closed" },
    },
    services: [
      {
        id: "svc-9-1",
        name: "Laser Hair Removal",
        description: "Safe and effective hair reduction",
        duration: 45,
        price: 190,
      },
      {
        id: "svc-9-2",
        name: "Botox Treatment",
        description: "Wrinkle reduction with botulinum toxin",
        duration: 30,
        price: 400,
      },
      {
        id: "svc-9-3",
        name: "Dermal Fillers",
        description: "Volume restoration and contouring",
        duration: 45,
        price: 550,
      },
      {
        id: "svc-9-4",
        name: "IPL Photo Facial",
        description: "Skin rejuvenation with light therapy",
        duration: 40,
        price: 320,
      },
    ],
    providers: [
      {
        id: "prov-9-1",
        name: "Dr. Andrei Constantin",
        specialty: "Laser Treatments",
        rating: 4.95,
      },
      {
        id: "prov-9-2",
        name: "Dr. Claudia Stanescu",
        specialty: "Injectable Treatments",
        rating: 4.9,
      },
    ],
  },
];

export const getBusinessById = (id: string): Business | undefined => {
  return businesses.find((b) => b.id === id);
};

export const getServiceById = (businessId: string, serviceId: string): Service | undefined => {
  const business = getBusinessById(businessId);
  return business?.services.find((s) => s.id === serviceId);
};

export const getProviderById = (businessId: string, providerId: string): Provider | undefined => {
  const business = getBusinessById(businessId);
  return business?.providers.find((p) => p.id === providerId);
};
