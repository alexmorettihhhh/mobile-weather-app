export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number;
}

export interface Current {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: Condition;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  vis_km: number;
  uv: number;
  gust_kph: number;
  air_quality: AirQuality;
}

export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
}

export interface Day {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avghumidity: number;
  condition: Condition;
  uv: number;
}

export interface Hour {
  time: string;
  temp_c: number;
  condition: Condition;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  windchill_c: number;
  chance_of_rain: number;
}

export interface ForecastDay {
  date: string;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface WeatherData {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export interface WeatherError {
  code: number;
  message: string;
} 