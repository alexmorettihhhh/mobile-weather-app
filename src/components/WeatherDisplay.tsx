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
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';

interface WeatherDisplayProps {
  city: string;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city }) => {
  const { theme: currentTheme } = useApp();
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
        setError(err instanceof Error ? err.message : ru.errors.apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

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
            {Math.round(weather.current.temp_c)}°C
          </Text>
          <Text style={[styles.feelsLike, { color: theme.colors.textSecondary }]}>
            {ru.weather.feelsLike} {Math.round(weather.current.feelslike_c)}°C
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
            {ru.weather.wind}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weather.current.wind_kph} {ru.units.speed}
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {ru.weather.humidity}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weather.current.humidity}%
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {ru.weather.pressure}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weather.current.pressure_mb} {ru.units.pressure}
          </Text>
        </View>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {ru.weather.uvIndex}
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