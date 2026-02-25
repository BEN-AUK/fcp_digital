export default {
  expo: {
    name: "fcp-digital",
    slug: "fcp-digital",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    scheme: "fcp-digital",
    web: {
      bundler: "metro",
      output: "single",
    },
    plugins: ["expo-router", "expo-secure-store", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
  },
};
