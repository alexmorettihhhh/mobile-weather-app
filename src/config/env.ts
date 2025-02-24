import Constants from 'expo-constants';

interface ExtraConfig {
  weatherApiKey: string;
  weatherApiBaseUrl: string;
}

const extra = Constants.expoConfig?.extra as ExtraConfig;

if (!extra?.weatherApiKey) {
  throw new Error('Weather API key is not configured in app.config.ts');
}

export const ENV = {
  WEATHER_API_KEY: extra.weatherApiKey,
  WEATHER_API_BASE_URL: extra.weatherApiBaseUrl,
}; 