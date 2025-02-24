import { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherApi';
import { CacheService } from '../services/cacheService';
import { LocationService } from '../services/locationService';

export const useWeather = () => {
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Сначала проверяем кэш
        const lastCity = await CacheService.getCachedWeatherData('last_city');
        if (lastCity) {
          setWeatherData(lastCity);
          setCurrentCity(lastCity.location.name);
          setLoading(false);
          return;
        }

        // Если нет кэша, пробуем получить местоположение
        const location = await LocationService.getCurrentLocation();
        if (location) {
          const cityName = await LocationService.getLocationName({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (cityName) {
            const data = await weatherService.getWeather(cityName);
            await CacheService.cacheWeatherData(cityName, data);
            setWeatherData(data);
            setCurrentCity(cityName);
          }
        }
      } catch (error) {
        console.error('Error initializing weather:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize weather data');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем кэш перед запросом к API
      const cachedData = await CacheService.getCachedWeatherData(city);
      if (cachedData) {
        setWeatherData(cachedData);
        setLoading(false);
        return;
      }

      // Если нет в кэше или кэш устарел, делаем запрос
      const data = await weatherService.getWeather(city);
      await CacheService.cacheWeatherData(city, data);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const setCity = async (city: string) => {
    setCurrentCity(city);
    await fetchWeatherData(city);
  };

  return {
    currentCity,
    setCity,
    weatherData,
    loading,
    error,
    refreshWeather: () => currentCity && fetchWeatherData(currentCity),
  };
}; 