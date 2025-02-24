import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { weatherService } from '../services/weatherApi';
import { WeatherData } from '../types/weather';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';

interface AstronomicalDataProps {
  city?: string;
}

export const AstronomicalData: React.FC<AstronomicalDataProps> = ({ city = 'Moscow' }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstronomicalData = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await weatherService.getWeather(city);
        setData(weatherData as WeatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : ru.errors.apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchAstronomicalData();
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

  if (!data) {
    return null;
  }

  const astro = data.forecast.forecastday[0].astro;
  const moonPhaseIcon = () => {
    switch (astro.moon_phase.toLowerCase()) {
      case 'new moon':
        return 'moon-new';
      case 'waxing crescent':
        return 'moon-waxing-crescent';
      case 'first quarter':
        return 'moon-first-quarter';
      case 'waxing gibbous':
        return 'moon-waxing-gibbous';
      case 'full moon':
        return 'moon-full';
      case 'waning gibbous':
        return 'moon-waning-gibbous';
      case 'last quarter':
        return 'moon-last-quarter';
      case 'waning crescent':
        return 'moon-waning-crescent';
      default:
        return 'moon-full';
    }
  };

  const getMoonPhaseText = (phase: string): string => {
    switch (phase.toLowerCase()) {
      case 'new moon':
        return ru.astronomical.newMoon;
      case 'waxing crescent':
        return ru.astronomical.waxingCrescent;
      case 'first quarter':
        return ru.astronomical.firstQuarter;
      case 'waxing gibbous':
        return ru.astronomical.waxingGibbous;
      case 'full moon':
        return ru.astronomical.fullMoon;
      case 'waning gibbous':
        return ru.astronomical.waningGibbous;
      case 'last quarter':
        return ru.astronomical.lastQuarter;
      case 'waning crescent':
        return ru.astronomical.waningCrescent;
      default:
        return phase;
    }
  };

  const renderAstroItem = (
    label: string,
    value: string,
    icon: string
  ) => (
    <View style={[styles.astroItem, { backgroundColor: theme.colors.cardBackground }]}>
      <Icon name={icon} size={24} color={theme.colors.textPrimary} />
      <View>
        <Text style={[styles.astroLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.astroValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{ru.astronomical.title}</Text>

      <View style={styles.astroContainer}>
        {renderAstroItem(ru.astronomical.sunrise, astro.sunrise, 'weather-sunset-up')}
        {renderAstroItem(ru.astronomical.sunset, astro.sunset, 'weather-sunset-down')}
        {renderAstroItem(ru.astronomical.moonrise, astro.moonrise, 'moon-waxing-crescent')}
        {renderAstroItem(ru.astronomical.moonset, astro.moonset, 'moon-waning-crescent')}
      </View>

      <View style={[styles.moonPhaseContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <Icon
          name={moonPhaseIcon()}
          size={48}
          color={theme.colors.textPrimary}
        />
        <View style={styles.moonPhaseInfo}>
          <Text style={[styles.moonPhaseText, { color: theme.colors.textPrimary }]}>
            {getMoonPhaseText(astro.moon_phase)}
          </Text>
          <Text style={[styles.moonIllumination, { color: theme.colors.textSecondary }]}>
            {ru.astronomical.illumination}: {astro.moon_illumination}%
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  astroContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  astroItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
  },
  astroLabel: {
    fontSize: 12,
  },
  astroValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  moonPhaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    padding: 24,
    borderRadius: 8,
  },
  moonPhaseInfo: {
    flex: 1,
  },
  moonPhaseText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  moonIllumination: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 