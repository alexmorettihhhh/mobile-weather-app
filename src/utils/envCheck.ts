import { ENV } from '../config/env';
import { validateApiKey } from '../config/constants';

export const checkEnv = async (): Promise<void> => {
  console.log('Checking environment variables...');
  console.log('WEATHER_API_KEY:', ENV.WEATHER_API_KEY ? '(exists)' : '(missing)');
  
  if (!ENV.WEATHER_API_KEY) {
    console.error('WEATHER_API_KEY is missing');
    throw new Error('WEATHER_API_KEY is not configured. Please check app.config.ts file.');
  }

  if (!validateApiKey(ENV.WEATHER_API_KEY)) {
    console.error('WEATHER_API_KEY validation failed');
    throw new Error('WEATHER_API_KEY is not properly configured. Please check app.config.ts file.');
  }

  console.log('Environment check completed successfully');
};

export const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}; 