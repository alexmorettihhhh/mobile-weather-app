import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WeatherData } from '../types/weather';
import { weatherService } from '../services/weatherApi';
import { CacheService } from '../services/cacheService';
import { LocationService } from '../services/locationService';

export const useWeather = () => {
  if (__DEV__) console.log('[useWeather] Hook initialized');
  
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Проверка состояния сети
  const checkNetworkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected && state.isInternetReachable;
      
      if (__DEV__) console.log(`[useWeather] Network state: connected=${isConnected}`);
      
      setIsOffline(!isConnected);
      return isConnected;
    } catch (err) {
      if (__DEV__) console.error('[useWeather] Error checking network:', err);
      setIsOffline(true);
      return false;
    }
  }, []);

  // Отслеживаем изменение состояния сети
  useEffect(() => {
    // Первоначальная проверка
    checkNetworkConnection();
    
    // Переменная для отслеживания последнего обновления при смене сети
    let lastNetworkRefresh = 0;
    
    // Подписываемся на изменения сети
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = !!state.isConnected && !!state.isInternetReachable;
      if (__DEV__) console.log(`[useWeather] Network changed: connected=${isConnected}`);
      setIsOffline(!isConnected);
      
      // Если соединение восстановлено и есть город, обновляем данные
      // Добавляем проверку на время последнего обновления, чтобы избежать слишком частых обновлений
      const now = Date.now();
      if (isConnected && currentCity && !loading && (now - lastNetworkRefresh > 10000)) {
        if (__DEV__) console.log('[useWeather] Network restored, refreshing data');
        lastNetworkRefresh = now;
        fetchWeatherData(currentCity, true).catch(() => {});
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [currentCity]); // Убираем loading из зависимостей, чтобы избежать циклических обновлений

  // Используем useCallback для предотвращения циклической зависимости
  const fetchWeatherData = useCallback(async (city: string, skipCache = false) => {
    if (__DEV__) console.log(`[useWeather] Fetching weather for ${city}, skipCache=${skipCache}`);
    
    try {
      setLoading(true);
      setError(null);
      
      // Проверяем состояние сети
      const isConnected = await checkNetworkConnection();
      
      let data: WeatherData | null = null;
      
      // Проверяем кэш всегда, но особенно важно для офлайн-режима
      if (__DEV__) console.log('[useWeather] Checking cache');
      const cachedData = await CacheService.getCachedWeatherData(city);
      
      // В офлайн-режиме используем только кэш
      if (!isConnected) {
        if (cachedData) {
          if (__DEV__) console.log('[useWeather] Offline mode - using cached data');
          data = cachedData;
          setIsOffline(true);
        } else {
          if (__DEV__) console.log('[useWeather] Offline mode - no cached data available');
          setError('Нет подключения к сети. Кешированные данные отсутствуют.');
          setIsOffline(true);
          setLoading(false);
          return;
        }
      } 
      // Если онлайн и не нужно пропускать кэш, и есть кешированные данные
      else if (!skipCache && cachedData) {
        if (__DEV__) console.log('[useWeather] Using cached data');
        data = cachedData;
      }
      // Если нет данных в кэше или пропускаем кэш и есть сеть, запрашиваем API
      else if (isConnected) {
        try {
          if (__DEV__) console.log('[useWeather] Fetching fresh data from API');
          data = await weatherService.getWeather(city);
          if (__DEV__) console.log('[useWeather] Successfully received API data');
          
          // Устанавливаем время последнего обновления
          setLastUpdated(new Date());
          
          // Кэшируем полученные данные
          if (data) {
            if (__DEV__) console.log('[useWeather] Caching new data');
            await CacheService.cacheWeatherData(city, data);
          }
        } catch (apiError: any) {
          if (__DEV__) console.error('[useWeather] API fetch error:', apiError);
          
          // Если есть кешированные данные, используем их в случае ошибки API
          if (cachedData) {
            if (__DEV__) console.log('[useWeather] Using cached data after API error');
            data = cachedData;
            setError(`Ошибка обновления данных. Показаны сохраненные данные.`);
          } else {
            // Более понятные сообщения об ошибках
            if (apiError.message?.includes('Network Error')) {
              setError('Ошибка сети. Проверьте подключение к интернету.');
            } else if (apiError.response?.status === 401 || apiError.response?.status === 403) {
              setError('Ошибка авторизации в API погоды. Проверьте ключ API.');
            } else if (apiError.response?.status === 404) {
              setError(`Город "${city}" не найден. Проверьте название города.`);
            } else if (apiError.response?.status >= 500) {
              setError('Сервер погоды временно недоступен. Повторите попытку позже.');
            } else {
              setError(`Ошибка загрузки данных: ${apiError.message || 'Неизвестная ошибка'}`);
            }
            setLoading(false);
            return;
          }
        }
      }
      
      if (data) {
        if (__DEV__) console.log('[useWeather] Setting weather data');
        setWeatherData(data);
      } else {
        if (__DEV__) console.error('[useWeather] No data received');
        setError('Не удалось получить данные о погоде');
      }
    } catch (e: any) {
      if (__DEV__) console.error('[useWeather] Unexpected error:', e);
      setError(`Ошибка: ${e?.message || 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  }, [checkNetworkConnection]);

  const initialize = useCallback(async () => {
    if (__DEV__) console.log('[useWeather] Initializing');
    try {
      setIsInitialized(false);
      setLoading(true);
      
      // Проверяем состояние сети
      const isConnected = await checkNetworkConnection();
      
      // Очищаем кэш только если есть сеть
      if (isConnected) {
        await CacheService.clearAllCache();
      }
      
      // Для отладки используем фиксированный город
      const defaultCity = 'Moscow';
      if (__DEV__) console.log(`[useWeather] Setting default city: ${defaultCity}`);
      setCurrentCity(defaultCity);
      
      // Запрашиваем данные при инициализации (skipCache=true для обхода кэша, если онлайн)
      // Исправляем ошибку типов - явно преобразуем isConnected в boolean
      await fetchWeatherData(defaultCity, isConnected === true);
    } catch (error: any) {
      if (__DEV__) console.error('[useWeather] Initialization error:', error);
      Alert.alert(
        'Ошибка инициализации',
        'Не удалось загрузить данные о погоде. Проверьте подключение к интернету.'
      );
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [fetchWeatherData, checkNetworkConnection]);

  // Эффект для инициализации, запустится только один раз при монтировании
  useEffect(() => {
    let isMounted = true;
    
    if (__DEV__) console.log('[useWeather] Running init effect');
    
    // Инициализация с проверкой, что компонент все еще смонтирован
    initialize().catch(err => {
      if (isMounted && __DEV__) {
        console.error('[useWeather] Init effect error:', err);
      }
    });
    
    // Функция очистки для предотвращения обновления состояния в размонтированном компоненте
    return () => {
      isMounted = false;
    };
  }, []); // Убираем initialize из зависимостей для запуска только при монтировании

  const setCity = useCallback(async (city: string) => {
    if (__DEV__) console.log(`[useWeather] Setting city to: ${city}`);
    setCurrentCity(city);
    await fetchWeatherData(city);
  }, [fetchWeatherData]);

  const refreshWeather = useCallback(async (skipCache = true) => {
    if (__DEV__) console.log('[useWeather] Refreshing weather data, skipCache =', skipCache);
    if (currentCity) {
      await fetchWeatherData(currentCity, skipCache);
    } else {
      if (__DEV__) console.warn('[useWeather] Cannot refresh: No current city set');
      // На случай, если город не установлен, пробуем инициализировать заново
      initialize();
    }
  }, [currentCity, fetchWeatherData, initialize]);

  return {
    currentCity,
    setCity,
    weatherData,
    loading,
    error,
    refreshWeather,
    isInitialized,
    isOffline,
    lastUpdated
  };
}; 