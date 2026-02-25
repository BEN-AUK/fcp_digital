/**
 * Polyfill for import.meta when using unstable_transformImportMeta (Babel replaces
 * import.meta with globalThis.__ExpoImportMetaRegistry). Must run before any code
 * that uses it (e.g. zustand ESM). Required for web when bundle is not loaded as type="module".
 */
if (typeof globalThis !== "undefined" && !globalThis.__ExpoImportMetaRegistry) {
  globalThis.__ExpoImportMetaRegistry = {
    get url() {
      return typeof document !== "undefined" && document.currentScript?.src
        ? document.currentScript.src
        : "";
    },
    get env() {
      return typeof process !== "undefined" && process.env
        ? { MODE: process.env.NODE_ENV }
        : undefined;
    },
  };
}

require("expo-router/entry");
