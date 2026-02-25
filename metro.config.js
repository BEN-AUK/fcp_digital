const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("mjs");

// On web, resolve zustand to CJS build so we avoid ESM that uses import.meta (not valid when bundle loads as classic script).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "web" &&
    (moduleName === "zustand" || moduleName.startsWith("zustand/"))
  ) {
    try {
      const cjsPath = require.resolve(moduleName, {
        paths: [context.originModulePath || __dirname],
      });
      return { type: "sourceFile", filePath: cjsPath };
    } catch {
      // fall through to default
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
