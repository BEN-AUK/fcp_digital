import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * System-level device type definition (industry standard).
 * Stored at: systemConfig/deviceSettings/deviceTypes/{id}
 */
export interface SystemDeviceType {
  id: string;
  label: string;
  icon: string;
  fcpCategory: string;
  isActive: boolean;
}

/**
 * Device type classification for FCP Digital.
 * Used in venues/{venueId}/devices subcollection.
 */
export type DeviceType =
  | "CHILLER"
  | "FREEZER"
  | "HOT_HOLDING"
  | "DISHWASHER";

/**
 * Firestore document shape for the devices subcollection.
 * Path: venues/{venueId}/devices/{deviceId}
 * `type` corresponds to SystemDeviceType.id.
 */
export interface Device {
  deviceId: string;
  venueId: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  installedAt: string;
  isActive: boolean;
  createdAt: Timestamp;
  metadata: {
    addedBy: string;
  };
}

/** Write payload: createdAt may be serverTimestamp() (FieldValue). */
export type DeviceWrite = Omit<Device, "createdAt"> & {
  createdAt: FieldValue;
};
