/**
 * Web entry: exports WebSignature as UniversalSignature.
 * This file is used by Metro when building for web — react-native-signature-canvas is never loaded.
 */
export { WebSignature as UniversalSignature } from "./WebSignature";
export type { UniversalSignatureViewRef, UniversalSignatureProps } from "./types";
