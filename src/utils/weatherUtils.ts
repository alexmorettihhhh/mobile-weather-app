import { WeatherData } from '../types/weather';
import { UnitSystem } from '../context/UnitsContext';

export const formatTemperature = (temp: number, units: { temperature: string }, unitSystem: UnitSystem): string => {
  return `${Math.round(temp)}${units.temperature}`;
};

export const formatWindSpeed = (speed: number, units: { speed: string }): string => {
  return `${Math.round(speed)} ${units.speed}`;
};

export const formatPressure = (pressure: number, units: { pressure: string }): string => {
  return `${pressure} ${units.pressure}`;
};

export const formatDistance = (distance: number, units: { distance: string }): string => {
  return `${distance} ${units.distance}`;
};

export const formatPrecipitation = (precipitation: number, units: { precipitation: string }): string => {
  return `${precipitation} ${units.precipitation}`;
};

export const getWeatherDescription = (
  weatherData: WeatherData, 
  units: { temperature: string; speed: string; }, 
  unitSystem: UnitSystem
): string => {
  const temp = unitSystem === 'metric' ? weatherData.current.temp_c : weatherData.current.temp_f;

  const windSpeed = unitSystem === 'metric' ? weatherData.current.wind_kph : weatherData.current.wind_mph;
  
  const { condition, humidity } = weatherData.current;
  
  return `${condition.text}. Temperature: ${formatTemperature(temp, units, unitSystem)}, Humidity: ${humidity}%, Wind: ${formatWindSpeed(windSpeed, units)}`;
};


export const convertTemperature = (value: number, toUnit: UnitSystem): number => {
  if (toUnit === 'metric') {
    return (value - 32) * 5 / 9;
  } else {
    return (value * 9 / 5) + 32;
  }
};

export const convertWindSpeed = (value: number, toUnit: UnitSystem): number => {
  if (toUnit === 'metric') {
    return value * 1.60934;
  } else {
    return value / 1.60934;
  }
};

export const convertPressure = (value: number, toUnit: UnitSystem): number => {
  if (toUnit === 'metric') {
    return value * 33.8639;
  } else {
    return value / 33.8639;
  }
};

export const convertDistance = (value: number, toUnit: UnitSystem): number => {
  if (toUnit === 'metric') {
    return value * 1.60934;
  } else {
    return value / 1.60934;
  }
};

export const convertPrecipitation = (value: number, toUnit: UnitSystem): number => {
  if (toUnit === 'metric') {
    return value * 25.4;
  } else {
    return value / 25.4;
  }
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