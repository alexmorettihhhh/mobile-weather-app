import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, Linking } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const LOCATION_CACHE_KEY = 'last_known_location';
const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const LOCATION_HISTORY_KEY = 'location_history';
const MAX_LOCATION_HISTORY = 10;

// New constants for location status
export enum LocationStatus {
  UNKNOWN = 'unknown',
  PERMISSION_DENIED = 'permission_denied',
  LOCATION_DISABLED = 'location_disabled',
  NO_INTERNET = 'no_internet',
  TIMEOUT = 'timeout',
  ERROR = 'error',
  SUCCESS = 'success',
  CACHED = 'cached'
}

interface CachedLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

interface LocationHistoryItem {
  name: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

// New interface for location result with status
export interface LocationResult {
  location: Location.LocationObject | null;
  status: LocationStatus;
  message?: string;
}

export class LocationService {
  // Track the current status of location service
  private static currentStatus: LocationStatus = LocationStatus.UNKNOWN;

  // Get the current status
  static getStatus(): LocationStatus {
    return this.currentStatus;
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        console.warn('Foreground location permission denied');
        this.currentStatus = LocationStatus.PERMISSION_DENIED;
        return false;
      }
      
      // Запрашиваем разрешение на фоновую геолокацию только на iOS
      if (Platform.OS === 'ios') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.warn('Background location permission denied');
          // Возвращаем true, так как переднеплановые разрешения получены
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      this.currentStatus = LocationStatus.ERROR;
      return false;
    }
  }

  static async getCurrentLocation(useCache: boolean = true, highAccuracy: boolean = false): Promise<LocationResult> {
    try {
      // Reset status at the beginning of each request
      this.currentStatus = LocationStatus.UNKNOWN;
      
      // Проверяем подключение к интернету
      const networkState = await NetInfo.fetch();
      const isConnected = networkState.isConnected && networkState.isInternetReachable;
      
      // Если нет подключения, всегда используем кэш
      if (!isConnected) {
        console.log('No internet connection, using cached location');
        this.currentStatus = LocationStatus.NO_INTERNET;
        const cachedLocation = await this.getCachedLocation();
        if (cachedLocation) {
          this.currentStatus = LocationStatus.CACHED;
          return {
            location: cachedLocation,
            status: LocationStatus.CACHED,
            message: 'Using cached location due to no internet connection'
          };
        }
        return {
          location: null,
          status: LocationStatus.NO_INTERNET,
          message: 'No internet connection and no cached location available'
        };
      }
      
      // Проверяем кэш, если разрешено
      if (useCache) {
        const cachedLocation = await this.getCachedLocation();
        if (cachedLocation) {
          this.currentStatus = LocationStatus.CACHED;
          return {
            location: cachedLocation,
            status: LocationStatus.CACHED,
            message: 'Using cached location'
          };
        }
      }

      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        this.currentStatus = LocationStatus.LOCATION_DISABLED;
        this.showLocationServicesAlert();
        return {
          location: null,
          status: LocationStatus.LOCATION_DISABLED,
          message: 'Location services are disabled'
        };
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        this.currentStatus = LocationStatus.PERMISSION_DENIED;
        this.showPermissionDeniedAlert();
        return {
          location: null,
          status: LocationStatus.PERMISSION_DENIED,
          message: 'Location permission denied'
        };
      }

      // Настройки точности в зависимости от параметра highAccuracy
      const accuracy = highAccuracy 
        ? Platform.OS === 'android' ? Location.Accuracy.High : Location.Accuracy.BestForNavigation
        : Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.Balanced;
      
      // Устанавливаем таймаут для получения местоположения
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy,
        }),
        new Promise<null>((resolve) => {
          setTimeout(() => {
            console.warn('Location request timed out');
            this.currentStatus = LocationStatus.TIMEOUT;
            resolve(null);
          }, 15000); // 15 секунд таймаут
        })
      ]) as Location.LocationObject | null;

      if (location) {
        await this.cacheLocation(location);
        this.currentStatus = LocationStatus.SUCCESS;
        return {
          location,
          status: LocationStatus.SUCCESS,
          message: 'Successfully retrieved current location'
        };
      } else {
        // Если не удалось получить местоположение, пробуем с меньшей точностью
        if (highAccuracy) {
          console.log('High accuracy location failed, trying with lower accuracy');
          return this.getCurrentLocation(false, false);
        }
        
        // Если всё ещё не удалось, возвращаем последнее известное местоположение
        const lastLocation = await this.getLastKnownLocation();
        if (lastLocation) {
          this.currentStatus = LocationStatus.CACHED;
          return {
            location: lastLocation,
            status: LocationStatus.CACHED,
            message: 'Using last known location'
          };
        }
        
        this.currentStatus = LocationStatus.ERROR;
        return {
          location: null,
          status: LocationStatus.ERROR,
          message: 'Failed to get current location'
        };
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      this.currentStatus = LocationStatus.ERROR;
      
      // В случае ошибки пробуем получить последнее известное местоположение
      try {
        const lastLocation = await this.getLastKnownLocation();
        if (lastLocation) {
          this.currentStatus = LocationStatus.CACHED;
          return {
            location: lastLocation,
            status: LocationStatus.CACHED,
            message: 'Using last known location due to error'
          };
        }
      } catch (e) {
        console.error('Error getting last known location:', e);
      }
      
      return {
        location: null,
        status: LocationStatus.ERROR,
        message: `Error getting location: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // New method to show a user-friendly alert when location services are disabled
  private static showLocationServicesAlert(): void {
    Alert.alert(
      'Location Services Disabled',
      'Your device location services are turned off. Please enable them to use location features in this app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          } 
        }
      ]
    );
  }

  // New method to show a user-friendly alert when permission is denied
  private static showPermissionDeniedAlert(): void {
    Alert.alert(
      'Location Permission Required',
      'This app needs access to your location to provide accurate weather information. Please grant location permission in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          } 
        }
      ]
    );
  }

  static async getLastKnownLocation(): Promise<Location.LocationObject | null> {
    try {
      const lastLocation = await Location.getLastKnownPositionAsync();
      return lastLocation;
    } catch (error) {
      console.error('Error getting last known location:', error);
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

      // Создаем полный объект LocationObject с необходимыми свойствами
      return {
        coords: {
          latitude: cached.coords.latitude,
          longitude: cached.coords.longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
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
        const locationName = location.city || location.subregion || location.region || null;
        
        // Если получили имя локации, добавляем в историю
        if (locationName) {
          await this.addToLocationHistory(locationName, coords);
        }
        
        return locationName;
      }
      return null;
    } catch (error) {
      console.error('Error getting location name:', error);
      return null;
    }
  }
  
  static async addToLocationHistory(name: string, coords: { latitude: number; longitude: number }): Promise<void> {
    try {
      // Получаем текущую историю
      const historyJson = await AsyncStorage.getItem(LOCATION_HISTORY_KEY);
      let history: LocationHistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
      
      // Проверяем, есть ли уже такая локация в истории
      const existingIndex = history.findIndex(item => item.name === name);
      
      // Если локация уже есть, обновляем timestamp
      if (existingIndex !== -1) {
        history[existingIndex].timestamp = Date.now();
      } else {
        // Добавляем новую локацию
        history.push({
          name,
          coords,
          timestamp: Date.now()
        });
      }
      
      // Сортируем по времени (сначала новые)
      history.sort((a, b) => b.timestamp - a.timestamp);
      
      // Ограничиваем размер истории
      if (history.length > MAX_LOCATION_HISTORY) {
        history = history.slice(0, MAX_LOCATION_HISTORY);
      }
      
      // Сохраняем обновленную историю
      await AsyncStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to location history:', error);
    }
  }
  
  static async getLocationHistory(): Promise<LocationHistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(LOCATION_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }
  
  static async clearLocationHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOCATION_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing location history:', error);
    }
  }
  
  static async watchPositionChanges(
    callback: (location: Location.LocationObject, status: LocationStatus) => void,
    errorCallback?: (error: any, status: LocationStatus) => void
  ): Promise<() => void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        this.currentStatus = LocationStatus.PERMISSION_DENIED;
        if (errorCallback) {
          errorCallback(new Error('Location permission not granted'), LocationStatus.PERMISSION_DENIED);
        }
        return () => {}; // Возвращаем пустую функцию отписки
      }
      
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        this.currentStatus = LocationStatus.LOCATION_DISABLED;
        this.showLocationServicesAlert();
        if (errorCallback) {
          errorCallback(new Error('Location services disabled'), LocationStatus.LOCATION_DISABLED);
        }
        return () => {};
      }
      
      // Настройки для отслеживания местоположения
      const watchId = await Location.watchPositionAsync(
        {
          accuracy: Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.Balanced,
          distanceInterval: 100, // Минимальное расстояние (в метрах) для обновления
          timeInterval: 60000, // Минимальное время (в мс) между обновлениями
        },
        (location) => {
          // Кэшируем новое местоположение
          this.cacheLocation(location);
          // Update status
          this.currentStatus = LocationStatus.SUCCESS;
          // Вызываем колбэк с новым местоположением
          callback(location, LocationStatus.SUCCESS);
        }
      );
      
      // Возвращаем функцию для отписки от отслеживания
      return () => {
        watchId.remove();
      };
    } catch (error) {
      console.error('Error watching position:', error);
      this.currentStatus = LocationStatus.ERROR;
      if (errorCallback) {
        errorCallback(error, LocationStatus.ERROR);
      }
      return () => {}; // Возвращаем пустую функцию отписки
    }
  }
} 