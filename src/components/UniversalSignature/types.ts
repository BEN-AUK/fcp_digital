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
};
