import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import type { WeatherData } from '../types/weather';

interface WeatherInfoProps {
  weatherData: WeatherData;
  city: string;
}

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData, city }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const getWeatherIcon = (code: number): string => {
    const iconMap: { [key: number]: string } = {
      1000: 'weather-sunny',
      1003: 'weather-partly-cloudy',
      1006: 'weather-cloudy',
      1009: 'weather-cloudy',
      1030: 'weather-fog',
      1063: 'weather-partly-rainy',
      1066: 'weather-snowy',
      1069: 'weather-snowy-rainy',
      1072: 'weather-hail',
      1087: 'weather-lightning',
      1114: 'weather-snowy',
      1117: 'weather-snowy-heavy',
      1135: 'weather-fog',
      1147: 'weather-fog',
      1150: 'weather-rainy',
      1153: 'weather-rainy',
      1168: 'weather-snowy-rainy',
      1171: 'weather-snowy-rainy',
      1180: 'weather-rainy',
      1183: 'weather-rainy',
      1186: 'weather-rainy',
      1189: 'weather-rainy',
      1192: 'weather-pouring',
      1195: 'weather-pouring',
      1198: 'weather-snowy-rainy',
      1201: 'weather-snowy-rainy',
      1204: 'weather-snowy',
      1207: 'weather-snowy-heavy',
      1210: 'weather-snowy',
      1213: 'weather-snowy',
      1216: 'weather-snowy',
      1219: 'weather-snowy',
      1222: 'weather-snowy-heavy',
      1225: 'weather-snowy-heavy',
      1237: 'weather-hail',
      1240: 'weather-rainy',
      1243: 'weather-pouring',
      1246: 'weather-pouring',
      1249: 'weather-snowy-rainy',
      1252: 'weather-snowy-rainy',
      1255: 'weather-snowy',
      1258: 'weather-snowy-heavy',
      1261: 'weather-hail',
      1264: 'weather-hail',
      1273: 'weather-lightning',
      1276: 'weather-lightning',
      1279: 'weather-lightning-rainy',
      1282: 'weather-lightning-rainy',
    };
    return iconMap[code] || 'weather-cloudy';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.cityName, { color: theme.colors.textPrimary }]}>
        {city}
      </Text>
      
      <View style={styles.mainInfo}>
        <Icon
          name={getWeatherIcon(weatherData.current.condition.code)}
          size={64}
          color={theme.colors.primary}
        />
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: theme.colors.textPrimary }]}>
            {Math.round(weatherData.current.temp_c)}°C
          </Text>
          <Text style={[styles.condition, { color: theme.colors.textSecondary }]}>
            {weatherData.current.condition.text}
          </Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Icon name="thermometer" size={24} color={theme.colors.primary} />
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.feelsLike}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {Math.round(weatherData.current.feelslike_c)}°C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="water-percent" size={24} color={theme.colors.primary} />
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.humidity}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weatherData.current.humidity}%
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="weather-windy" size={24} color={theme.colors.primary} />
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.wind}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {Math.round(weatherData.current.wind_kph)} км/ч
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="speedometer" size={24} color={theme.colors.primary} />
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            {translations.weather.pressure}
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {weatherData.current.pressure_mb} мб
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
  cityName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
  },
  condition: {
    fontSize: 16,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 