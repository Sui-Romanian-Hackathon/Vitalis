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
