import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';

const CACHE_KEYS = {
  WEATHER_DATA: 'weather_data_cache_',
  LAST_UPDATE: 'last_update_',
  WEATHER_FACTS: 'weather_facts_',
  WEATHER_EXPLANATIONS: 'weather_explanations_',
};

const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

export class CacheService {
  static async cacheWeatherData(city: string, data: WeatherData): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.WEATHER_DATA + city, JSON.stringify(data));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE + city, Date.now().toString());
    } catch (error) {
      console.error('Error caching weather data:', error);
    }
  }

  static async getCachedWeatherData(city: string): Promise<WeatherData | null> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.WEATHER_DATA + city);
      const lastUpdate = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE + city);

      if (!data || !lastUpdate) return null;

      const isExpired = Date.now() - parseInt(lastUpdate) > CACHE_EXPIRY;
      if (isExpired) {
        await this.clearCacheForCity(city);
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting cached weather data:', error);
      return null;
    }
  }

  static async clearCacheForCity(city: string): Promise<void> {
    try {
      console.log(`[CacheService] Clearing cache for city: ${city}`);
      await AsyncStorage.multiRemove([
        CACHE_KEYS.WEATHER_DATA + city,
        CACHE_KEYS.LAST_UPDATE + city,
      ]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static async clearAllCache(): Promise<void> {
    try {
      console.log('[CacheService] Clearing all cache');
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        Object.values(CACHE_KEYS).some(cacheKey => key.startsWith(cacheKey))
      );
      
      console.log(`[CacheService] Found ${cacheKeys.length} cache keys to remove`);
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('[CacheService] Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }
  
  // Принудительно очищает кэш для указанного города, игнорируя срок его истечения
  static async forceRefreshCacheForCity(city: string): Promise<void> {
    try {
      console.log(`[CacheService] Force refreshing cache for city: ${city}`);
      await this.clearCacheForCity(city);
    } catch (error) {
      console.error(`[CacheService] Error force refreshing cache for ${city}:`, error);
    }
  }
} 