// Mock data for demo/video - 3 companies with 2 providers each
export interface MockService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: string;
}

export interface MockProvider {
  id: string;
  name: string;
  specialty: string;
  image?: string;
  rating: number;
}

export interface MockCompany {
  id: string;
  name: string;
  description: string;
  image?: string;
  services: MockService[];
  providers: MockProvider[];
}

export interface TimeSlot {
  id: string;
  time: string; // "HH:MM" format
  available: boolean;
}

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      slots.push({
        id: time,
        time,
        available: Math.random() > 0.3, // 70% slots available
      });
    }
  }
  return slots;
};

export const mockCompanies: MockCompany[] = [
  {
    id: "company-1",
    name: "Cluj Hair Atelier",
    description: "Signature cuts, color, and treatments by top stylists in Cluj-Napoca",
    image: "💇‍♀️",
    services: [
      {
        id: "service-1-1",
        name: "Precision Haircut",
        description: "Tailored cut with wash and style",
        duration: 45,
        price: "180 RON",
      },
      {
        id: "service-1-2",
        name: "Balayage & Tone",
        description: "Freehand lightening with custom toner",
        duration: 120,
        price: "520 RON",
      },
      {
        id: "service-1-3",
        name: "Keratin Smoothing",
        description: "Frizz control and shine boost treatment",
        duration: 120,
        price: "650 RON",
      },
    ],
    providers: [
      {
        id: "provider-1-1",
        name: "Andreea Pop",
        specialty: "Color & Balayage",
        rating: 4.9,
      },
      {
        id: "provider-1-2",
        name: "Mihai Ionescu",
        specialty: "Precision Cuts",
        rating: 4.8,
      },
    ],
  },
  {
    id: "company-2",
    name: "Napoca Style Studio",
    description: "Color artistry, blonding, and healthy hair care in the heart of Cluj",
    image: "✂️",
    services: [
      {
        id: "service-2-1",
        name: "Signature Blowout",
        description: "Wash, scalp massage, and long-lasting finish",
        duration: 60,
        price: "160 RON",
      },
      {
        id: "service-2-2",
        name: "Full Color Refresh",
        description: "All-over color with gloss finish",
        duration: 90,
        price: "320 RON",
      },
      {
        id: "service-2-3",
        name: "Highlights & Toner",
        description: "Foil highlights with toner and bond builder",
        duration: 120,
        price: "480 RON",
      },
    ],
    providers: [
      {
        id: "provider-2-1",
        name: "Laura Muresan",
        specialty: "Blonding & Foils",
        rating: 4.7,
      },
      {
        id: "provider-2-2",
        name: "Irina Stan",
        specialty: "Updos & Bridal",
        rating: 4.9,
      },
    ],
  },
  {
    id: "company-3",
    name: "Transylvanian Glow Salon",
    description: "Glossing, treatments, and vibrant color focused on hair health",
    image: "💎",
    services: [
      {
        id: "service-3-1",
        name: "Lived-in Blonde",
        description: "Soft balayage with root melt and gloss",
        duration: 150,
        price: "560 RON",
      },
      {
        id: "service-3-2",
        name: "Color Correction",
        description: "Multi-step correction with bond rebuilding",
        duration: 180,
        price: "820 RON",
      },
      {
        id: "service-3-3",
        name: "Luxury Hair Spa",
        description: "Mask, steam, scalp massage, and trim",
        duration: 75,
        price: "260 RON",
      },
    ],
    providers: [
      {
        id: "provider-3-1",
        name: "Alexandra Neves",
        specialty: "Color Correction",
        rating: 4.95,
      },
      {
        id: "provider-3-2",
        name: "Victoria Sterling",
        specialty: "Styling & Waves",
        rating: 4.8,
      },
    ],
  },
];

export const getMockCompanyById = (companyId: string): MockCompany | undefined => {
  return mockCompanies.find((c) => c.id === companyId);
};

export const getMockProvider = (companyId: string, providerId: string): MockProvider | undefined => {
  const company = getMockCompanyById(companyId);
  return company?.providers.find((p) => p.id === providerId);
};

export const getMockService = (companyId: string, serviceId: string): MockService | undefined => {
  const company = getMockCompanyById(companyId);
  return company?.services.find((s) => s.id === serviceId);
};
