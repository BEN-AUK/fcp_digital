import { create } from "zustand";
import type { VenueContext } from "@/types/auth";

/** Venue layer: hydrated from Firebase Auth on init; not persisted by Zustand (Firebase handles it). */
type VenueState = {
  venue: VenueContext | null;
  isReady: boolean;
  /** True when venue is set (owner logged in). Used for route guard. */
  isAuthenticated: boolean;
  setVenue: (venue: VenueContext | null) => void;
  setReady: (ready: boolean) => void;
};

export const useVenueStore = create<VenueState>((set) => ({
  venue: null,
  isReady: false,
  isAuthenticated: false,
  setVenue: (venue) => set({ venue, isAuthenticated: venue !== null }),
  setReady: (ready) => set({ isReady: ready }),
}));
