import { Share, Platform } from 'react-native';
import { WeatherData } from '../types/weather';

export class ShareService {
  /**
   * Поделиться текущей погодой
   */
  static async shareWeather(weatherData: WeatherData): Promise<void> {
    try {
      const { location, current } = weatherData;
      
      // Форматируем текст для обмена
      const shareText = `Погода в ${location.name}, ${location.country}\n`
        + `🌡️ ${Math.round(current.temp_c)}°C, ощущается как ${Math.round(current.feelslike_c)}°C\n`
        + `${current.condition.text}\n`
        + `💧 Влажность: ${current.humidity}%\n`
        + `💨 Ветер: ${current.wind_kph} км/ч, ${current.wind_dir}\n`
        + `👁️ Видимость: ${current.vis_km} км\n\n`
        + `Отправлено из приложения MobileWeatherApp`;
      
      // Открываем диалог обмена
      await Share.share({
        message: shareText,
        title: `Погода в ${location.name}`
      });
    } catch (error) {
      console.error('Error sharing weather data:', error);
      throw error;
    }
  }

  /**
   * Поделиться погодой со скриншотом
   */
  static async shareWeatherWithScreenshot(weatherData: WeatherData, screenshotUri: string): Promise<void> {
    try {
      const { location, current } = weatherData;
      
      // Форматируем текст для обмена
      const shareText = `Погода в ${location.name}, ${location.country}\n`
        + `🌡️ ${Math.round(current.temp_c)}°C (${current.condition.text})\n`
        + `Отправлено из приложения MobileWeatherApp`;
      
      // Определяем, как делиться в зависимости от платформы
      if (Platform.OS === 'ios') {
        // iOS может делиться и текстом, и изображением одновременно
        await Share.share({
          message: shareText,
          title: `Погода в ${location.name}`,
          url: screenshotUri
        });
      } else {
        // Android требует, чтобы был указан только url для изображения
        await Share.share({
          message: shareText,
          title: `Погода в ${location.name}`,
          url: screenshotUri
        });
      }
    } catch (error) {
      console.error('Error sharing weather data with screenshot:', error);
      throw error;
    }
  }

  /**
   * Поделиться прогнозом погоды
   */
  static async shareWeatherForecast(weatherData: WeatherData): Promise<void> {
    try {
      const { location, forecast } = weatherData;
      
      // Заголовок
      let shareText = `Прогноз погоды для ${location.name}, ${location.country}\n\n`;
      
      // Добавляем прогноз на каждый день
      forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('ru-RU', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
        
        shareText += `📅 ${formattedDate}\n`
          + `🌡️ ${Math.round(day.day.maxtemp_c)}°C / ${Math.round(day.day.mintemp_c)}°C\n`
          + `${day.day.condition.text}\n`
          + `💧 Влажность: ${day.day.avghumidity}%\n`
          + `💨 Ветер: до ${day.day.maxwind_kph} км/ч\n`
          + `☔ Вероятность осадков: ${day.day.daily_chance_of_rain}%\n\n`;
      });
      
      // Добавляем подпись
      shareText += `Отправлено из приложения MobileWeatherApp`;
      
      // Открываем диалог обмена
      await Share.share({
        message: shareText,
        title: `Прогноз погоды для ${location.name}`
      });
    } catch (error) {
      console.error('Error sharing weather forecast:', error);
      throw error;
    }
  }
} 