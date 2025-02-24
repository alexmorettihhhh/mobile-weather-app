import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherApi';

const CURRENT_CITY_KEY = 'current_city';
const DEFAULT_CITY = 'Moscow';

export const useWeather = () => {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedCity();
  }, []);

  useEffect(() => {
    if (currentCity) {
      fetchWeatherData();
      AsyncStorage.setItem(CURRENT_CITY_KEY, currentCity);
    }
  }, [currentCity]);

  const loadSavedCity = async () => {
    try {
      const savedCity = await AsyncStorage.getItem(CURRENT_CITY_KEY);
      if (savedCity) {
        setCurrentCity(savedCity);
      }
    } catch (error) {
      console.error('Error loading saved city:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeather(currentCity);
      setWeatherData(data as WeatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const setCity = (city: string) => {
    setCurrentCity(city);
  };

  return {
    currentCity,
    setCity,
    weatherData,
    loading,
    error,
    refreshWeather: fetchWeatherData,
  };
}; 