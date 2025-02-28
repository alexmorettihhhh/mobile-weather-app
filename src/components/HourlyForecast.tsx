import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';
import type { Hour } from '../types/weather';

interface HourlyForecastProps {
  hourlyData: Hour[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = 90;
const CARD_MARGIN = 8;

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem, units } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  console.log('[HourlyForecast] Rendering with unit system:', unitSystem);

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

  const formatHour = (timeString: string): string => {
    const hour = new Date(timeString).getHours();
    return `${hour}:00`;
  };

  // Получаем температуру в зависимости от выбранной системы единиц
  const getTemperature = (hour: Hour): string => {
    const temp = unitSystem === 'metric' ? hour.temp_c : hour.temp_f;
    return `${Math.round(temp)}${units.temperature}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {translations.weather.hourlyForecast}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyData.map((hour, index) => (
          <View
            key={index}
            style={[styles.hourCard, { backgroundColor: theme.colors.cardBackground }]}
          >
            <Text style={[styles.hourText, { color: theme.colors.textPrimary }]}>
              {formatHour(hour.time)}
            </Text>
            <Icon
              name={getWeatherIcon(hour.condition.code)}
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text style={[styles.tempText, { color: theme.colors.textPrimary }]}>
              {getTemperature(hour)}
            </Text>
            <View style={styles.infoRow}>
              <Icon name="water-percent" size={12} color={theme.colors.info} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {hour.humidity}%
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="weather-sunny" size={12} color={theme.colors.warning} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                UV {Math.round(hour.uv)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="water" size={12} color={theme.colors.info} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {hour.chance_of_rain}%
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 16,
  },
  hourCard: {
    width: CARD_WIDTH,
    padding: 12,
    borderRadius: 12,
    marginRight: CARD_MARGIN,
    alignItems: 'center',
  },
  hourText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  icon: {
    marginVertical: 8,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
  },
}); 