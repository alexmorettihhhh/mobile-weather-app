import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "MobileWeatherApp",
  slug: "MobileWeatherApp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.mobileweatherapp"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.yourcompany.mobileweatherapp",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-location"
  ],
  extra: {
    weatherApiKey: process.env.WEATHER_API_KEY,
    weatherApiBaseUrl: process.env.WEATHER_API_BASE_URL
  },
  sdkVersion: "52.0.0"
}); 