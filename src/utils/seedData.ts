import { getDocs, writeBatch, doc } from "firebase/firestore";
import { getSystemDeviceTypesCol } from "@/config/dbPaths";
import type { SystemDeviceType } from "@/types/Device";

const DEFAULT_DEVICE_TYPES: SystemDeviceType[] = [
  {
    id: "CHILLER",
    label: "Chiller",
    icon: "fridge",
    fcpCategory: "Cold Chain",
    isActive: true,
  },
  {
    id: "FREEZER",
    label: "Freezer",
    icon: "thermometer-snow",
    fcpCategory: "Cold Chain",
    isActive: true,
  },
  {
    id: "HOT_HOLDING",
    label: "Hot Holding",
    icon: "flame",
    fcpCategory: "Hot Holding",
    isActive: true,
  },
  {
    id: "DISHWASHER",
    label: "Dishwasher",
    icon: "waves",
    fcpCategory: "Sanitation",
    isActive: true,
  },
];

const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;

/**
 * Initializes system settings: if the device types collection is empty,
 * batch-writes the default industry-standard device types. Idempotent.
 * Path: systemConfig/deviceSettings/deviceTypes
 */
export async function initializeSystemSettings(): Promise<void> {
  try {
    const col = getSystemDeviceTypesCol();
    const snapshot = await getDocs(col);

    // TEMPORARY: force run once – restore idempotency after confirming Firebase has data
    // if (snapshot.size !== 0) {
    //   return;
    // }

    const batch = writeBatch(col.firestore);
    for (const item of DEFAULT_DEVICE_TYPES) {
      const docRef = doc(col, item.id);
      batch.set(docRef, item);
    }
    await batch.commit();

    if (isDev) {
      console.log("System data initialized.");
    }
  } catch (err) {
    if (isDev) {
      console.error("System data initialization failed.", err);
    }
  }
}
