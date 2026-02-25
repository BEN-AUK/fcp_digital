module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Transform import.meta so web bundle works when loaded as classic script (fixes zustand ESM / "Cannot use 'import.meta' outside a module").
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [],
  };
};
