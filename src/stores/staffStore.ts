import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StaffContext } from "@/types/auth";

const STAFF_STORAGE_KEY = "fcp_staff_context";

/** Staff layer: persisted to local storage so it survives device restart. */
type StaffState = {
  staff: StaffContext | null;
  setStaff: (staff: StaffContext | null) => void;
  clearStaff: () => void;
};

export const useStaffStore = create<StaffState>()(
  persist(
    (set) => ({
      staff: null,
      setStaff: (staff) => set({ staff }),
      clearStaff: () => set({ staff: null }),
    }),
    {
      name: STAFF_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
