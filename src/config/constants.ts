import { ENV } from './env';

export const API_KEY = ENV.WEATHER_API_KEY;
export const API_BASE_URL = ENV.WEATHER_API_BASE_URL;

export const validateApiKey = (key: string): boolean => {
  return typeof key === 'string' && key.length > 0;
};

export const DEFAULT_LOCATION = {
  city: 'Москва',
  country: 'Россия',
  lat: 55.7558,
  lon: 37.6173,
};

export const REFRESH_INTERVAL = 300000;

// Дефолтные единицы измерения (метрическая система)
export const DEFAULT_UNITS = {
  temperature: '°C',
  speed: 'km/h',
  pressure: 'mb',
  precipitation: 'mm',
  distance: 'km',
};

// Дефолтные единицы измерения (имперская система)
export const DEFAULT_UNITS_IMPERIAL = {
  temperature: '°F',
  speed: 'mph',
  pressure: 'inHg',
  precipitation: 'in',
  distance: 'mi',
};

export const API_ENDPOINTS = {
  current: '/current.json',
  forecast: '/forecast.json',
  search: '/search.json',
}; 