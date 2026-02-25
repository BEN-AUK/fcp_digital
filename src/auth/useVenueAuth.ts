import { useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useShallow } from "zustand/react/shallow";
import { getFirebaseAuth, getFirestoreDb } from "@/config/firebase";
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

  const signUp = useCallback(
    async (email: string, password: string, shopName: string): Promise<void> => {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "venues", user.uid), {
        venueId: user.uid,
        email: user.email ?? email,
        shopName: shopName.trim() || null,
        createdAt: serverTimestamp(),
      });
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    const auth = getFirebaseAuth();
    await fbSignOut(auth);
    useVenueStore.getState().setVenue(null);
    useStaffStore.getState().clearStaff();
  }, []);

  const state = useVenueStore(
    useShallow((s) => ({ venue: s.venue, isReady: s.isReady }))
  );

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}

/** @deprecated Use useVenueAuth().signIn instead. */
export async function signInVenue(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

/** @deprecated Use useVenueAuth().signOut instead. */
export async function signOutVenue(): Promise<void> {
  const auth = getFirebaseAuth();
  await fbSignOut(auth);
  useVenueStore.getState().setVenue(null);
  useStaffStore.getState().clearStaff();
}
