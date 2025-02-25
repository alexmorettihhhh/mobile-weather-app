import { WeatherData } from '../types/weather';
import { generateUniqueId } from '../utils/idGenerator';

// Define the WeatherAlert interface
export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  created: number;
  expires: number;
}

// Набор активных предупреждений
let activeAlerts: WeatherAlert[] = [];

export class WeatherAlertService {
  /**
   * Проверка на наличие погодных предупреждений
   */
  static checkForAlerts(weatherData: WeatherData): void {
    this.removeExpiredAlerts();
    this.checkTemperature(weatherData);
    this.checkWind(weatherData);
    this.checkPrecipitation(weatherData);
    this.checkUVIndex(weatherData);
    
    // Проверка качества воздуха, если данные доступны
    if (weatherData.current.air_quality) {
      this.checkAirQuality(weatherData);
    }
  }

  /**
   * Получить все активные предупреждения
   */
  static getActiveAlerts(): WeatherAlert[] {
    this.removeExpiredAlerts();
    return [...activeAlerts];
  }

  /**
   * Закрыть предупреждение
   */
  static dismissAlert(alertId: string): void {
    activeAlerts = activeAlerts.filter(alert => alert.id !== alertId);
  }

  /**
   * Очистить все предупреждения
   */
  static clearAllAlerts(): void {
    activeAlerts = [];
  }

  /**
   * Проверка на экстремальные температуры
   */
  private static checkTemperature(weatherData: WeatherData): void {
    const temp = weatherData.current.temp_c;
    const feelsLike = weatherData.current.feelslike_c;
    
    // Сильная жара
    if (temp >= 35) {
      this.createAlert({
        title: 'Экстремальная жара',
        description: `Температура ${Math.round(temp)}°C. Избегайте длительного пребывания на солнце.`,
        type: 'temperature',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Жара
    else if (temp >= 30 && temp < 35) {
      this.createAlert({
        title: 'Высокая температура',
        description: `Температура ${Math.round(temp)}°C. Пейте больше воды и ограничьте физическую активность.`,
        type: 'temperature',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    
    // Сильный холод
    if (temp <= -15) {
      this.createAlert({
        title: 'Экстремальный холод',
        description: `Температура ${Math.round(temp)}°C. Избегайте длительного пребывания на улице.`,
        type: 'temperature',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Холод
    else if (temp <= -10 && temp > -15) {
      this.createAlert({
        title: 'Низкая температура',
        description: `Температура ${Math.round(temp)}°C. Одевайтесь теплее.`,
        type: 'temperature',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    
    // Большая разница между реальной и ощущаемой температурой
    if (Math.abs(temp - feelsLike) >= 5) {
      const feelingColder = feelsLike < temp;
      this.createAlert({
        title: feelingColder ? 'Холоднее, чем кажется' : 'Теплее, чем кажется',
        description: `Температура ${Math.round(temp)}°C, но ощущается как ${Math.round(feelsLike)}°C.`,
        type: 'temperature',
        severity: 'low',
        expires: Date.now() + 3600000 // 1 час
      });
    }
  }

  /**
   * Проверка на сильный ветер
   */
  private static checkWind(weatherData: WeatherData): void {
    const windSpeed = weatherData.current.wind_kph;
    
    // Ураганный ветер
    if (windSpeed >= 90) {
      this.createAlert({
        title: 'Ураганный ветер',
        description: `Скорость ветра ${Math.round(windSpeed)} км/ч. Опасно находиться на открытых пространствах.`,
        type: 'wind',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Сильный ветер
    else if (windSpeed >= 60 && windSpeed < 90) {
      this.createAlert({
        title: 'Сильный ветер',
        description: `Скорость ветра ${Math.round(windSpeed)} км/ч. Будьте осторожны на улице.`,
        type: 'wind',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Умеренный ветер
    else if (windSpeed >= 40 && windSpeed < 60) {
      this.createAlert({
        title: 'Умеренный ветер',
        description: `Скорость ветра ${Math.round(windSpeed)} км/ч.`,
        type: 'wind',
        severity: 'low',
        expires: Date.now() + 3600000 // 1 час
      });
    }
  }

  /**
   * Проверка на осадки
   */
  private static checkPrecipitation(weatherData: WeatherData): void {
    const condition = weatherData.current.condition.text.toLowerCase();
    const conditionCode = weatherData.current.condition.code;
    
    // Сильный дождь
    if (
      condition.includes('heavy rain') ||
      condition.includes('torrential') ||
      conditionCode === 1195 || 
      conditionCode === 1192
    ) {
      this.createAlert({
        title: 'Сильный дождь',
        description: 'Сильные осадки могут привести к затоплению. Будьте осторожны на дорогах.',
        type: 'precipitation',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Гроза
    else if (
      condition.includes('thunder') || 
      condition.includes('lightning') ||
      (conditionCode >= 1273 && conditionCode <= 1282)
    ) {
      this.createAlert({
        title: 'Гроза',
        description: 'Возможны молнии и сильный дождь. Избегайте открытых пространств.',
        type: 'precipitation',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Снегопад
    else if (
      condition.includes('snow') || 
      condition.includes('blizzard') ||
      (conditionCode >= 1210 && conditionCode <= 1264)
    ) {
      this.createAlert({
        title: 'Снегопад',
        description: 'Возможно затруднение движения транспорта и гололедица.',
        type: 'precipitation',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Туман
    else if (
      condition.includes('fog') || 
      condition.includes('mist') ||
      conditionCode === 1135 || 
      conditionCode === 1147
    ) {
      this.createAlert({
        title: 'Туман',
        description: 'Ограниченная видимость. Будьте осторожны при вождении.',
        type: 'precipitation',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
  }

  /**
   * Проверка УФ-индекса
   */
  private static checkUVIndex(weatherData: WeatherData): void {
    const uvIndex = weatherData.current.uv;
    
    // Экстремальный УФ-индекс
    if (uvIndex >= 11) {
      this.createAlert({
        title: 'Экстремальный УФ-индекс',
        description: `УФ-индекс: ${uvIndex}. Избегайте нахождения на солнце с 10:00 до 16:00.`,
        type: 'uv',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Очень высокий УФ-индекс
    else if (uvIndex >= 8 && uvIndex < 11) {
      this.createAlert({
        title: 'Очень высокий УФ-индекс',
        description: `УФ-индекс: ${uvIndex}. Используйте солнцезащитный крем и ограничьте пребывание на солнце.`,
        type: 'uv',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Высокий УФ-индекс
    else if (uvIndex >= 6 && uvIndex < 8) {
      this.createAlert({
        title: 'Высокий УФ-индекс',
        description: `УФ-индекс: ${uvIndex}. Используйте защиту от солнца.`,
        type: 'uv',
        severity: 'low',
        expires: Date.now() + 3600000 // 1 час
      });
    }
  }

  /**
   * Проверка на качество воздуха
   */
  private static checkAirQuality(weatherData: WeatherData): void {
    if (!weatherData.current.air_quality) return;
    
    const pm2_5 = weatherData.current.air_quality.pm2_5;
    const pm10 = weatherData.current.air_quality.pm10;
    
    // Опасное качество воздуха PM2.5
    if (pm2_5 > 100) {
      this.createAlert({
        title: 'Критическое загрязнение воздуха',
        description: `Концентрация PM2.5: ${Math.round(pm2_5)}. Рекомендуется оставаться в помещении.`,
        type: 'wind',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Плохое качество воздуха PM2.5
    else if (pm2_5 > 35) {
      this.createAlert({
        title: 'Плохое качество воздуха',
        description: `Концентрация PM2.5: ${Math.round(pm2_5)}. Ограничьте активность на открытом воздухе.`,
        type: 'wind',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    
    // Опасное качество воздуха PM10
    if (pm10 > 150) {
      this.createAlert({
        title: 'Критическое загрязнение воздуха',
        description: `Концентрация PM10: ${Math.round(pm10)}. Рекомендуется оставаться в помещении.`,
        type: 'wind',
        severity: 'high',
        expires: Date.now() + 3600000 // 1 час
      });
    }
    // Плохое качество воздуха PM10
    else if (pm10 > 50) {
      this.createAlert({
        title: 'Плохое качество воздуха',
        description: `Концентрация PM10: ${Math.round(pm10)}. Ограничьте активность на открытом воздухе.`,
        type: 'wind',
        severity: 'medium',
        expires: Date.now() + 3600000 // 1 час
      });
    }
  }

  /**
   * Создание нового предупреждения
   */
  private static createAlert(alert: Omit<WeatherAlert, 'id' | 'created'>): void {
    // Проверяем, существует ли уже подобное предупреждение
    const existingSimilarAlert = activeAlerts.find(
      a => a.title === alert.title && a.severity === alert.severity
    );
    
    if (!existingSimilarAlert) {
      const newAlert: WeatherAlert = {
        ...alert,
        id: generateUniqueId(),
        created: Date.now(),
      };
      
      activeAlerts.push(newAlert);
    }
  }

  /**
   * Удаление просроченных предупреждений
   */
  private static removeExpiredAlerts(): void {
    const now = Date.now();
    activeAlerts = activeAlerts.filter(alert => alert.expires > now);
  }
} 