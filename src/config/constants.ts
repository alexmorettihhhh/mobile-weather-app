import { ru } from '../localization/ru';
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

export const WEATHER_UNITS = ru.units;

export const API_ENDPOINTS = {
  current: '/current.json',
  forecast: '/forecast.json',
  search: '/search.json',
};

export const ERROR_MESSAGES = ru.errors; 