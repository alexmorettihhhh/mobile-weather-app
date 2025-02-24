import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirQuality as AirQualityType } from '../types/weather';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';

interface AirQualityProps {
  data: AirQualityType;
}

const getAirQualityStatus = (epaIndex: number) => {
  switch (epaIndex) {
    case 1:
      return { text: ru.airQuality.good, color: '#4CAF50' };
    case 2:
      return { text: ru.airQuality.moderate, color: '#FFC107' };
    case 3:
      return { text: ru.airQuality.unhealthyForSensitive, color: '#FF9800' };
    case 4:
      return { text: ru.airQuality.unhealthy, color: '#F44336' };
    case 5:
      return { text: ru.airQuality.veryUnhealthy, color: '#9C27B0' };
    case 6:
      return { text: ru.airQuality.hazardous, color: '#7B1FA2' };
    default:
      return { text: ru.airQuality.unknown, color: '#666666' };
  }
};

export const AirQuality: React.FC<AirQualityProps> = ({ data }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const status = getAirQualityStatus(data['us-epa-index']);

  const renderPollutant = (
    name: string,
    value: number,
    icon: string,
    unit: string
  ) => (
    <View style={[styles.pollutantItem, { backgroundColor: theme.colors.cardBackground }]}>
      <Icon name={icon} size={24} color={theme.colors.textPrimary} />
      <Text style={[styles.pollutantName, { color: theme.colors.textSecondary }]}>{name}</Text>
      <Text style={[styles.pollutantValue, { color: theme.colors.textPrimary }]}>
        {value.toFixed(1)} {unit}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{ru.airQuality.title}</Text>
      
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.text}
        </Text>
        <Text style={[styles.indexText, { color: theme.colors.textSecondary }]}>
          {ru.airQuality.index}: {data['us-epa-index']}
        </Text>
      </View>

      <View style={styles.pollutantsContainer}>
        {renderPollutant('CO', data.co, 'molecule-co', 'мкг/м³')}
        {renderPollutant('NO₂', data.no2, 'molecule', 'мкг/м³')}
        {renderPollutant('O₃', data.o3, 'weather-sunny', 'мкг/м³')}
        {renderPollutant('SO₂', data.so2, 'molecule', 'мкг/м³')}
        {renderPollutant('PM2.5', data.pm2_5, 'air-filter', 'мкг/м³')}
        {renderPollutant('PM10', data.pm10, 'air-filter', 'мкг/м³')}
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
    marginBottom: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  indexText: {
    fontSize: 14,
  },
  pollutantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  pollutantItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  pollutantName: {
    fontSize: 12,
  },
  pollutantValue: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 