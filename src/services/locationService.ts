import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LOCATION_CACHE_KEY = 'last_known_location';
const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  static async getCurrentLocation(useCache: boolean = true): Promise<Location.LocationObject | null> {
    try {
      if (useCache) {
        const cachedLocation = await this.getCachedLocation();
        if (cachedLocation) return cachedLocation;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Оптимизированные настройки для геолокации
      const location = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' 
          ? Location.Accuracy.Balanced 
          : Location.Accuracy.Lowest,
        maximumAge: 10000, // Использовать кэшированное значение если оно не старше 10 секунд
      });

      if (location) {
        await this.cacheLocation(location);
      }

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  static async getCachedLocation(): Promise<Location.LocationObject | null> {
    try {
      const cachedData = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (!cachedData) return null;

      const cached: CachedLocation = JSON.parse(cachedData);
      const isExpired = Date.now() - cached.timestamp > LOCATION_CACHE_EXPIRY;

      if (isExpired) {
        await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
        return null;
      }

      return {
        coords: cached.coords,
        timestamp: cached.timestamp,
        mocked: false,
      };
    } catch (error) {
      console.error('Error getting cached location:', error);
      return null;
    }
  }

  private static async cacheLocation(location: Location.LocationObject): Promise<void> {
    try {
      const locationData: CachedLocation = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(locationData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  static async getLocationName(coords: { latitude: number; longitude: number }): Promise<string | null> {
    try {
      const [location] = await Location.reverseGeocodeAsync(coords);
      if (location) {
        return location.city || location.subregion || location.region || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting location name:', error);
      return null;
    }
  }
} 