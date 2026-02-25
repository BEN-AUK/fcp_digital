/**
 * Log entry types for NZ Food Safety compliance.
 * All Firestore log documents must conform to these shapes and include venueId.
 */
export type LogEntry = {
  venueId: string;
  measured_at: number;
  created_at: number;
  is_backdated?: boolean;
  [key: string]: unknown;
};
