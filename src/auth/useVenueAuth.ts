import { useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth";
import { useShallow } from "zustand/react/shallow";
import { getFirebaseAuth } from "@/config/firebase";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import type { VenueContext } from "@/types/auth";

function userToVenueContext(uid: string, email: string | null): VenueContext {
  return {
    venueId: uid,
    uid,
    email,
  };
}

/** Subscribes to Firebase Auth and syncs Venue context to store. Ensures persistence via browserLocalPersistence. */
export function useVenueAuth() {
  const { setVenue, setReady } = useVenueStore();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setVenue(userToVenueContext(user.uid, user.email ?? null));
      } else {
        setVenue(null);
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, [setVenue, setReady]);

  return useVenueStore(
    useShallow((s) => ({ venue: s.venue, isReady: s.isReady }))
  );
}

export async function signInVenue(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutVenue(): Promise<void> {
  const auth = getFirebaseAuth();
  await fbSignOut(auth);
  useVenueStore.getState().setVenue(null);
  useStaffStore.getState().setStaff(null);
}
