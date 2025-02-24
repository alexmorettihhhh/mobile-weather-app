declare module '../components/WeatherInfo' {
  import { FC } from 'react';
  import { WeatherData } from './weather';
  
  interface WeatherInfoProps {
    weatherData: WeatherData;
    city: string;
  }
  
  export const WeatherInfo: FC<WeatherInfoProps>;
}

declare module '../components/WeatherRecommendations' {
  import { FC } from 'react';
  import { WeatherData } from './weather';
  
  interface WeatherRecommendationsProps {
    weatherData: WeatherData;
  }
  
  export const WeatherRecommendations: FC<WeatherRecommendationsProps>;
}

declare module '../components/AstronomicalData' {
  import { FC } from 'react';
  
  interface AstronomicalDataProps {
    city?: string;
  }
  
  export const AstronomicalData: FC<AstronomicalDataProps>;
}

declare module '../components/CitySearch' {
  import { FC } from 'react';
  
  interface CitySearchProps {
    onCitySelect: (city: string) => void;
  }
  
  export const CitySearch: FC<CitySearchProps>;
}

declare module '../components/HourlyForecast' {
  import { FC } from 'react';
  import { Hour } from './weather';
  
  interface HourlyForecastProps {
    hourlyData: Hour[];
  }
  
  export const HourlyForecast: FC<HourlyForecastProps>;
}

declare module '../components/ExtendedWeatherInfo' {
  import { FC } from 'react';
  
  interface ExtendedWeatherInfoProps {
    data: {
      uv: number;
      air_quality: {
        pm2_5: number;
        pm10: number;
        o3: number;
        no2: number;
        so2: number;
        co: number;
      };
      wind_degree: number;
      wind_dir: string;
      precip_chance: number;
    };
  }
  
  export const ExtendedWeatherInfo: FC<ExtendedWeatherInfoProps>;
} 