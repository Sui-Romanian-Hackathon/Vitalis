// TypeScript types for Vitalis on-chain objects
export interface CompanyProfile {
  id: string;
  name: string;
  owner: string;
  created_at: number;
  status: number;
}

export interface ProviderNFT {
  id: string;
  name: string;
  company_id: string;
  wallet: string;
  role: string;
  active: boolean;
  created_at: number;
}

export interface ClientNFT {
  id: string;
  wallet: string;
  display_name: string;
  email: string;
  created_at: number;
}

export interface Appointment {
  id: string;
  company_id: string;
  provider_id: string;
  client_id: string;
  start_time: number;
  end_time: number;
  status: number;
  created_at: number;
}

export interface LightAppointment {
  id: string;
  client_id: string;
  provider_name: string;
  start_time: number;
  end_time: number;
  status: number;
  created_at: number;
}

export type UserRole = "company" | "provider" | "client" | null;

export interface AuthState {
  address: string | null;
  role: UserRole;
  company?: CompanyProfile;
  provider?: ProviderNFT;
  client?: ClientNFT;
  loading: boolean;
  error: string | null;
}

export interface ReservationData {
  serviceId: string;
  providerId?: string; // optional
  timeSlot: string;
  date: string;
  clientName?: string;
  providerName?: string;
}

export interface ReservationNFT {
  id: string;
  client_id: string;
  company_id: string;
  service_id: string;
  provider_id?: string;
  time_slot: string;
  date: string;
  status: number;
  created_at: number;
}
