import axios from 'axios';
import { WeatherData } from '../types/weather';
import { API_KEY, API_BASE_URL, API_ENDPOINTS } from '../config/constants';

class WeatherService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    params: {
      key: API_KEY,
      aqi: 'yes',
      days: 7,
    },
  });

  async getWeather(query: string): Promise<WeatherData> {
    try {
      const response = await this.api.get<WeatherData>(API_ENDPOINTS.forecast, {
        params: {
          q: query,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
        if (error.response?.status === 403) {
          throw new Error('API key error. Please check your configuration.');
        }
        throw new Error(error.response?.data?.error?.message || 'Failed to fetch weather data');
      }
      throw error;
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    return this.getWeather(`${lat},${lon}`);
  }

  async searchLocations(query: string) {
    try {
      const response = await this.api.get(API_ENDPOINTS.search, {
        params: {
          q: query,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Location search error:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService(); 