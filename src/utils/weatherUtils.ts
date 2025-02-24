import { WeatherData } from '../types/weather';
import { WEATHER_UNITS } from '../config/constants';

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}${WEATHER_UNITS.temperature}`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)} ${WEATHER_UNITS.speed}`;
};

export const formatPressure = (pressure: number): string => {
  return `${pressure} ${WEATHER_UNITS.pressure}`;
};

export const formatDistance = (distance: number): string => {
  return `${distance} ${WEATHER_UNITS.distance}`;
};

export const getWeatherDescription = (weatherData: WeatherData): string => {
  const { temp_c, condition, humidity, wind_kph } = weatherData.current;
  return `${condition.text}. Temperature: ${formatTemperature(temp_c)}, Humidity: ${humidity}%, Wind: ${formatWindSpeed(wind_kph)}`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVIndexDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

export const getAirQualityDescription = (aqiIndex: number): string => {
  switch (aqiIndex) {
    case 1:
      return 'Good';
    case 2:
      return 'Moderate';
    case 3:
      return 'Unhealthy for Sensitive Groups';
    case 4:
      return 'Unhealthy';
    case 5:
      return 'Very Unhealthy';
    case 6:
      return 'Hazardous';
    default:
      return 'Unknown';
  }
};

export const formatTime = (time: string): string => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getPrecipitationProbability = (chanceOfRain: number, chanceOfSnow: number): string => {
  if (chanceOfRain > chanceOfSnow) {
    return `${chanceOfRain}% chance of rain`;
  }
  if (chanceOfSnow > chanceOfRain) {
    return `${chanceOfSnow}% chance of snow`;
  }
  return 'No precipitation expected';
}; 