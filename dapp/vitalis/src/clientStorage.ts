// Client-side storage utilities for managing user data locally
import { ClientNFT } from "./types";

const CLIENT_STORAGE_KEY = "vitalis_client";
const RESERVATIONS_KEY = "vitalis_reservations";

export interface LocalClient extends ClientNFT {
  wallet: string;
}

export const saveClientData = (client: LocalClient) => {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client));
  } catch (e) {
    console.error("Failed to save client data:", e);
  }
};

export const getClientData = (): LocalClient | null => {
  try {
    const data = localStorage.getItem(CLIENT_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to retrieve client data:", e);
    return null;
  }
};

export const clearClientData = () => {
  try {
    localStorage.removeItem(CLIENT_STORAGE_KEY);
    localStorage.removeItem(RESERVATIONS_KEY);
  } catch (e) {
    console.error("Failed to clear client data:", e);
  }
};

export interface Reservation {
  id: string;
  appointmentId?: string;
  businessId: string;
  serviceId: string;
  providerId?: string;
  providerName?: string;
  date: string;
  timeSlot: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: number;
}

export const saveReservation = (reservation: Reservation) => {
  try {
    const existing = getReservations();
    existing.push(reservation);
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save reservation:", e);
  }
};

export const getReservations = (): Reservation[] => {
  try {
    const data = localStorage.getItem(RESERVATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to retrieve reservations:", e);
    return [];
  }
};

export const updateReservation = (id: string, updates: Partial<Reservation>) => {
  try {
    const reservations = getReservations();
    const idx = reservations.findIndex((r) => r.id === id);
    if (idx >= 0) {
      reservations[idx] = { ...reservations[idx], ...updates };
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    }
  } catch (e) {
    console.error("Failed to update reservation:", e);
  }
};

export const cancelReservation = (id: string) => {
  updateReservation(id, { status: "cancelled" });
};
