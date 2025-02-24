import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherApi';

const CURRENT_CITY_KEY = 'current_city';
const LOCATION_PERMISSION_KEY = 'location_permission_asked';

export const useWeather = () => {
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (currentCity) {
      fetchWeatherData();
      AsyncStorage.setItem(CURRENT_CITY_KEY, currentCity);
    }
  }, [currentCity]);

  const initializeLocation = async () => {
    try {
      // Проверяем, запрашивали ли мы уже разрешение на геолокацию
      const permissionAsked = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);
      
      // Проверяем сохраненный город
      const savedCity = await AsyncStorage.getItem(CURRENT_CITY_KEY);
      
      if (!permissionAsked) {
        // Если разрешение еще не запрашивали, пробуем получить геолокацию
        const { status } = await Location.requestForegroundPermissionsAsync();
        await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'true');
        
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          
          // Получаем название города по координатам
          const cities = await weatherService.searchCities(`${latitude},${longitude}`);
          if (cities.length > 0) {
            setCurrentCity(cities[0]);
            return;
          }
        }
      }
      
      // Если есть сохраненный город, используем его
      if (savedCity) {
        setCurrentCity(savedCity);
      } else {
        // Если нет ни сохраненного города, ни геолокации, используем поиск
        setCurrentCity(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      // В случае ошибки просто показываем поиск города
      setCurrentCity(null);
      setLoading(false);
    }
  };

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
    if (!currentCity) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeather(currentCity);
      console.log('Weather data:', data);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Error fetching weather data:', err);
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