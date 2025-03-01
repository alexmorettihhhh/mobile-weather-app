import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';

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

export const ExtendedWeatherInfo: React.FC<ExtendedWeatherInfoProps> = ({ data }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  console.log('[ExtendedWeatherInfo] Rendering with unit system:', unitSystem);

  const getUVDescription = (uv: number): string => {
    if (uv <= 2) return translations.weather.uvLow;
    if (uv <= 5) return translations.weather.uvModerate;
    if (uv <= 7) return translations.weather.uvHigh;
    if (uv <= 10) return translations.weather.uvVeryHigh;
    return translations.weather.uvExtreme;
  };

  const getUVColor = (uv: number): string => {
    if (uv <= 2) return theme.colors.success;
    if (uv <= 5) return theme.colors.warning;
    if (uv <= 7) return theme.colors.error;
    if (uv <= 10) return theme.colors.error;
    return '#6B0000'; // Экстремальный УФ
  };

  const getAirQualityDescription = (pm25: number): string => {
    if (pm25 <= 12) return translations.airQuality.good;
    if (pm25 <= 35.4) return translations.airQuality.moderate;
    if (pm25 <= 55.4) return translations.airQuality.unhealthyForSensitive;
    if (pm25 <= 150.4) return translations.airQuality.unhealthy;
    if (pm25 <= 250.4) return translations.airQuality.veryUnhealthy;
    return translations.airQuality.hazardous;
  };

  const getWindDirection = (degree: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 22.5) % 16;
    return translations.directions[directions[index] as keyof typeof translations.directions];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {translations.weather.uvIndex}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.uvIndicator}>
            <Icon name="white-balance-sunny" size={32} color={getUVColor(data.uv)} />
            <View style={styles.uvInfo}>
              <Text style={[styles.uvValue, { color: getUVColor(data.uv) }]}>
                {data.uv.toFixed(1)}
              </Text>
              <Text style={[styles.uvDescription, { color: theme.colors.textSecondary }]}>
                {getUVDescription(data.uv)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {translations.airQuality.title}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.airQualityGrid}>
            <View style={styles.airQualityItem}>
              <Text style={[styles.aqiLabel, { color: theme.colors.textSecondary }]}>PM2.5</Text>
              <Text style={[styles.aqiValue, { color: theme.colors.textPrimary }]}>
                {Math.round(data.air_quality.pm2_5)}
              </Text>
            </View>
            <View style={styles.airQualityItem}>
              <Text style={[styles.aqiLabel, { color: theme.colors.textSecondary }]}>PM10</Text>
              <Text style={[styles.aqiValue, { color: theme.colors.textPrimary }]}>
                {Math.round(data.air_quality.pm10)}
              </Text>
            </View>
            <View style={styles.airQualityItem}>
              <Text style={[styles.aqiLabel, { color: theme.colors.textSecondary }]}>O₃</Text>
              <Text style={[styles.aqiValue, { color: theme.colors.textPrimary }]}>
                {Math.round(data.air_quality.o3)}
              </Text>
            </View>
            <View style={styles.airQualityItem}>
              <Text style={[styles.aqiLabel, { color: theme.colors.textSecondary }]}>NO₂</Text>
              <Text style={[styles.aqiValue, { color: theme.colors.textPrimary }]}>
                {Math.round(data.air_quality.no2)}
              </Text>
            </View>
          </View>
          <Text style={[styles.airQualityDescription, { color: theme.colors.textSecondary }]}>
            {getAirQualityDescription(data.air_quality.pm2_5)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {translations.weather.wind}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.windDirection}>
            <Icon
              name="compass"
              size={48}
              color={theme.colors.primary}
              style={{ transform: [{ rotate: `${data.wind_degree}deg` }] }}
            />
            <View style={styles.windInfo}>
              <Text style={[styles.windDirText, { color: theme.colors.textPrimary }]}>
                {getWindDirection(data.wind_degree)}
              </Text>
              <Text style={[styles.windDegree, { color: theme.colors.textSecondary }]}>
                {data.wind_degree}°
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          {translations.weather.precipitation}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.precipChance}>
            <Icon name="water" size={32} color={theme.colors.info} />
            <Text style={[styles.precipValue, { color: theme.colors.textPrimary }]}>
              {data.precip_chance}%
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
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  uvIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  uvInfo: {
    flex: 1,
  },
  uvValue: {
    fontSize: 32,
    fontWeight: '600',
  },
  uvDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  airQualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  airQualityItem: {
    alignItems: 'center',
  },
  aqiLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  aqiValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  airQualityDescription: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  windDirection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  windInfo: {
    flex: 1,
  },
  windDirText: {
    fontSize: 18,
    fontWeight: '600',
  },
  windDegree: {
    fontSize: 14,
    marginTop: 4,
  },
  precipChance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  precipValue: {
    fontSize: 24,
    fontWeight: '600',
  },
}); 