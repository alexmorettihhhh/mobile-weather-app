import axios, { AxiosError } from 'axios';
import { WeatherData } from '../types/weather';
import { API_KEY, API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { ENV } from '../config/env';

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
    const apiKey = ENV.WEATHER_API_KEY || API_KEY;
    console.log(`[WeatherAPI] Fetching data for query: ${query}`);
    console.log(`[WeatherAPI] Using API key: ${apiKey.substring(0, 4)}...`);
    console.log(`[WeatherAPI] Base URL: ${API_BASE_URL}`);
    
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.forecast}`, {
        params: {
          key: apiKey,
          q: query,
          aqi: 'yes',
          days: 7
        },
      });

      console.log(`[WeatherAPI] Response status: ${response.status}`);
      console.log(`[WeatherAPI] Location: ${response.data.location.name}`);
      
      if (!response.data.forecast || !response.data.forecast.forecastday) {
        console.error('[WeatherAPI] Error: Forecast data missing in API response');
        throw new Error('Данные прогноза отсутствуют в ответе API');
      }
      
      console.log(`[WeatherAPI] Received forecast for ${response.data.forecast.forecastday.length} days`);
      
      return this.transformApiResponse(response.data);
    } catch (error) {
      console.error('[WeatherAPI] Error fetching weather data:', error);
      
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error(`[WeatherAPI] Status: ${axiosError.response.status}`);
        console.error('[WeatherAPI] Response data:', axiosError.response.data);
        
        // Проверяем специфические коды ошибок
        if (axiosError.response.status === 401 || axiosError.response.status === 403) {
          throw new Error('Недействительный API ключ. Пожалуйста, проверьте настройки приложения.');
        }
      }
      
      if (axiosError.request) {
        console.error('[WeatherAPI] No response received');
        throw new Error('Не удалось получить ответ от сервера погоды. Проверьте подключение к интернету.');
      }
      
      throw new Error(`Ошибка при получении данных о погоде: ${(error as Error).message}`);
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

  async searchCities(query: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const data = await response.json();
      return data.map((item: any) => item.name);
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }

  private transformApiResponse(data: any): WeatherData {
    // Трансформируем данные из API в формат WeatherData
    return data;
  }
}

export const weatherService = new WeatherService(); 