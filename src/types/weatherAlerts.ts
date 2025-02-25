export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  created: number;
  expires: number;
} 