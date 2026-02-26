export default {
  expo: {
    name: "fcp-digital",
    slug: "fcp-digital",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    scheme: "fcp-digital",
    icon: "./assets/images/icon.png",
    web: {
      bundler: "metro",
      output: "static",
      backgroundColor: "#F5F7F8",
      themeColor: "#008080",
      favicon: "./assets/images/favicon.png",
      description: "FCP Digital Management System",
      display: "standalone",
      orientation: "portrait",
      name: "FCP Digital",
      short_name: "FCP-D",
      config: {
        favicons: ["./assets/images/favicon.png"],
      },
    },
    plugins: ["expo-router", "expo-secure-store", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
  },
};
