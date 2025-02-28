import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  ImageStyle,
} from 'react-native';
import { weatherService } from '../services/weatherApi';
import { WeatherData } from '../types/weather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { formatTemperature, formatWindSpeed, formatPressure } from '../utils/weatherUtils';

interface WeatherDisplayProps {
  city: string;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem, units } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getWeather(city);
        setWeather(data as WeatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : translations.errors.apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, translations.errors.apiError]);

  // Добавляем эффект для отслеживания изменений в системе единиц
  useEffect(() => {
    console.log('[WeatherDisplay] Unit system changed to:', unitSystem);
    // Если данные уже загружены, принудительно обновляем компонент
    if (weather) {
      console.log('[WeatherDisplay] Forcing update with new unit system');
      // Создаем копию объекта weather, чтобы вызвать перерисовку
      setWeather({...weather});
    }
  }, [unitSystem]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator size={42} color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  if (!weather) {
    return null;
  }

  // Выбираем температуру в зависимости от системы единиц
  const temp = unitSystem === 'metric' ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike = unitSystem === 'metric' ? weather.current.feelslike_c : weather.current.feelslike_f;
  const windSpeed = unitSystem === 'metric' ? weather.current.wind_kph : weather.current.wind_mph;
  const pressure = unitSystem === 'metric' ? weather.current.pressure_mb : weather.current.pressure_in;
  const visibility = unitSystem === 'metric' ? weather.current.vis_km : weather.current.vis_miles;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.mainInfo}>
        <Text style={[styles.cityName, { color: theme.colors.textPrimary }]}>
          {weather.location.name}
        </Text>
        <Text style={[styles.countryName, { color: theme.colors.textSecondary }]}>
          {weather.location.country}
        </Text>
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: theme.colors.textPrimary }]}>
            {formatTemperature(temp, units, unitSystem)}
          </Text>
          <Text style={[styles.feelsLike, { color: theme.colors.textSecondary }]}>
            {translations.weather.feelsLike} {formatTemperature(feelsLike, units, unitSystem)}
          </Text>
        </View>
        <View style={styles.conditionContainer}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={styles.conditionIcon as ImageStyle}
          />
          <Text style={[styles.conditionText, { color: theme.colors.textPrimary }]}>
            {weather.current.condition.text}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.wind}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {formatWindSpeed(windSpeed, units)}
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.humidity}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weather.current.humidity}%
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.pressure}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {formatPressure(pressure, units)}
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.uvIndex}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weather.current.uv}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  mainInfo: {
    alignItems: 'center',
  },
  cityName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 16,
    marginBottom: 16,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
  },
  feelsLike: {
    fontSize: 14,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  conditionIcon: {
    width: 50,
    height: 50,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 