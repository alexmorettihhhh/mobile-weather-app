export interface HistoricalWeatherRecord {
  id: string;
  city: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  conditionCode: number;
} 