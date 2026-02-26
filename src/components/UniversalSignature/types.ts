/**
 * Shared ref interface for UniversalSignature (Native + Web).
 * Join page uses readSignature() and clearSignature() only.
 */
export type UniversalSignatureViewRef = {
  readSignature: () => void;
  clearSignature: () => void;
};

export type UniversalSignatureProps = {
  onOK?: (signature: string) => void;
  onEmpty?: () => void;
  /** Called when signature fails density validation (e.g. too simple). Parent should reset submitting state. */
  onTooSimple?: () => void;
};
