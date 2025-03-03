import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';
import { HistoricalWeatherRecord } from '../types/weatherHistory';
import { generateUniqueId } from '../utils/idGenerator';

const HISTORY_STORAGE_KEY = 'weather_history';
const HISTORY_LIMIT = 30;
const SEARCH_HISTORY_STORAGE_KEY = 'search_history';

export class WeatherHistoryService {
  private static searchHistory: string[] = [];

  /**
   * Записать данные о погоде в историю
   */
  static async recordWeatherData(weatherData: WeatherData): Promise<void> {
    if (!weatherData) return;

    try {
      const city = weatherData.location.name;
      const currentDate = new Date();
      
      // Создаем новую запись
      const newRecord: HistoricalWeatherRecord = {
        id: generateUniqueId(),
        city,
        timestamp: currentDate.getTime(),
        temperature: weatherData.current.temp_c,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        condition: weatherData.current.condition.text,
        conditionCode: weatherData.current.condition.code
      };
      
      const existingHistory = await this.getAllHistory();
      
      const todayStart = new Date(currentDate);
      todayStart.setHours(0, 0, 0, 0);
      
      const existingTodayRecord = existingHistory.find(record => 
        record.city === city && 
        new Date(record.timestamp).getTime() >= todayStart.getTime()
      );
      
      let updatedHistory;
      
      if (existingTodayRecord) {
        updatedHistory = existingHistory.map(record => 
          record.id === existingTodayRecord.id ? newRecord : record
        );
      } else {
        updatedHistory = [...existingHistory, newRecord];
        
        const cityRecords = updatedHistory.filter(record => record.city === city);
        if (cityRecords.length > HISTORY_LIMIT) {
          // Сортируем по времени и удаляем старые записи
          const sortedCityRecords = cityRecords.sort((a, b) => a.timestamp - b.timestamp);
          const recordsToRemove = sortedCityRecords.slice(0, cityRecords.length - HISTORY_LIMIT);
          
          updatedHistory = updatedHistory.filter(record => 
            !(record.city === city && recordsToRemove.some(r => r.id === record.id))
          );
        }
      }
      
      // Сохраняем обновленную историю
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error recording weather history:', error);
    }
  }

  /**
   * Получить всю историю погоды
   */
  static async getAllHistory(): Promise<HistoricalWeatherRecord[]> {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (!storedHistory) return [];
      return JSON.parse(storedHistory);
    } catch (error) {
      console.error('Error getting weather history:', error);
      return [];
    }
  }

  /**
   * Получить историю погоды для конкретного города
   */
  static async getHistoryForCity(city: string): Promise<HistoricalWeatherRecord[]> {
    try {
      const allHistory = await this.getAllHistory();
      return allHistory.filter(record => record.city === city);
    } catch (error) {
      console.error(`Error getting weather history for ${city}:`, error);
      return [];
    }
  }

  /**
   * Очистить историю погоды для конкретного города
   */
  static async clearHistoryForCity(city: string): Promise<void> {
    try {
      const allHistory = await this.getAllHistory();
      const updatedHistory = allHistory.filter(record => record.city !== city);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error(`Error clearing weather history for ${city}:`, error);
    }
  }

  /**
   * Очистить всю историю погоды
   */
  static async clearAllHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing all weather history:', error);
    }
  }

  static async recordSearchCity(city: string): Promise<void> {
    if (!this.searchHistory.includes(city)) {
      this.searchHistory.push(city);
      if (this.searchHistory.length > 5) {
        this.searchHistory.shift(); // Удаляем самый старый город
      }
    }
  }

  static async getSearchHistory(): Promise<string[]> {
    return this.searchHistory;
  }
} 