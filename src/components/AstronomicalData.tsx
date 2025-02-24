import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { weatherService } from '../services/weatherApi';

interface AstronomicalDataProps {
  city?: string;
}

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_WIDTH = (width - CARD_PADDING * 4) / 2;

export const AstronomicalData: React.FC<AstronomicalDataProps> = ({ city = 'Moscow' }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getWeather(city);
      setData(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error || translations.errors.apiError}
        </Text>
      </View>
    );
  }

  const astro = data.forecast.forecastday[0].astro;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {translations.astronomical.title}
      </Text>

      <View style={styles.cardsContainer}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Icon name="white-balance-sunny" size={32} color={theme.colors.warning} />
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              {translations.weather.sunrise}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.textPrimary }]}>
              {convertTo24Hour(astro.sunrise)}
            </Text>
            <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
              {translations.astronomical.sunrise}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.textPrimary }]}>
              {convertTo24Hour(astro.sunset)}
            </Text>
            <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
              {translations.astronomical.sunset}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Icon name="moon-waning-crescent" size={32} color={theme.colors.primary} />
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              {translations.astronomical.moonrise}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.textPrimary }]}>
              {convertTo24Hour(astro.moonrise)}
            </Text>
            <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
              {translations.astronomical.moonrise}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.textPrimary }]}>
              {convertTo24Hour(astro.moonset)}
            </Text>
            <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
              {translations.astronomical.moonset}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.moonPhaseCard, { backgroundColor: theme.colors.cardBackground }]}>
        <Icon name="moon-waning-crescent" size={48} color={theme.colors.primary} />
        <View style={styles.moonPhaseInfo}>
          <Text style={[styles.moonPhaseText, { color: theme.colors.textPrimary }]}>
            {astro.moon_phase}
          </Text>
          <Text style={[styles.illuminationText, { color: theme.colors.textSecondary }]}>
            {translations.astronomical.illumination}: {astro.moon_illumination}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeContainer: {
    marginVertical: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
  },
  timeLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  moonPhaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  moonPhaseInfo: {
    flex: 1,
  },
  moonPhaseText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  illuminationText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 