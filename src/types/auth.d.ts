/** Venue context: from Firebase Auth, persisted via browserLocalPersistence */
export type VenueContext = {
  venueId: string;
  uid: string;
  email: string | null;
};

/** Staff context: from local storage, persisted across restarts */
export type StaffContext = {
  staffId: string;
  displayName: string;
  venueId: string;
};
