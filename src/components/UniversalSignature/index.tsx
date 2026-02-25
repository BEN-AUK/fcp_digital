/**
 * Native (iOS/Android) entry: exports NativeSignature as UniversalSignature.
 * When building for web, index.web.tsx is used instead so this file is not in the web bundle.
 */
export { NativeSignature as UniversalSignature } from "./NativeSignature";
export type { UniversalSignatureViewRef, UniversalSignatureProps } from "./types";
