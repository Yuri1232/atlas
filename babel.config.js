module.exports = function (api) {
  api.cache(true); // Helps optimize caching in metro bundler
  return {
    presets: ["babel-preset-expo"], // Correct preset for Expo projects
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      "react-native-reanimated/plugin",

      // For using React Native Reanimated
      // For loading environment variables from .env file
    ],
  };
};
