import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WeatherData } from '../types/weather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

interface WeatherInfoProps {
  weatherData: WeatherData;
  city: string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData, city }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const { current } = weatherData;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.cityName, { color: theme.colors.textPrimary }]}>
        {city}
      </Text>
      <View style={styles.mainInfo}>
        <Text style={[styles.temperature, { color: theme.colors.textPrimary }]}>
          {Math.round(current.temp_c)}°C
        </Text>
        <Text style={[styles.condition, { color: theme.colors.textSecondary }]}>
          {current.condition.text}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="water-percent" size={24} color={theme.colors.primary} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.humidity}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {current.humidity}%
            </Text>
          </View>
        </View>

        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="weather-windy" size={24} color={theme.colors.primary} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.wind}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {Math.round(current.wind_kph)} км/ч
            </Text>
          </View>
        </View>

        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="thermometer" size={24} color={theme.colors.primary} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.feelsLike}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {Math.round(current.feelslike_c)}°C
            </Text>
          </View>
        </View>

        <View style={[styles.detailItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="gauge" size={24} color={theme.colors.primary} />
          <View>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.pressure}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {current.pressure_mb} мб
            </Text>
          </View>
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
  mainInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '600',
  },
  condition: {
    fontSize: 20,
    marginTop: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
}); 