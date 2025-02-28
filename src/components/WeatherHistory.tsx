import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { WeatherHistoryService } from '../services/weatherHistoryService';
import { HistoricalWeatherRecord } from '../types/weatherHistory';
import { useWindowDimensions } from 'react-native';
import { convertTemperature, convertWindSpeed } from '../utils/weatherUtils';

interface WeatherHistoryProps {
  city: string;
}

export const WeatherHistory: React.FC<WeatherHistoryProps> = ({ city }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem, units } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [history, setHistory] = useState<HistoricalWeatherRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const [chartData, setChartData] = useState<any>(null);
  const [humidityData, setHumidityData] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, [city]);

  // Обновляем данные при изменении системы единиц
  useEffect(() => {
    console.log('[WeatherHistory] Unit system changed to:', unitSystem);
    if (history.length > 0) {
      updateChartData();
    }
  }, [unitSystem, history]);

  const loadHistory = async () => {
    const historyData = await WeatherHistoryService.getHistoryForCity(city);
    const sortedData = historyData.sort((a, b) => a.timestamp - b.timestamp);
    setHistory(sortedData);
    
    if (sortedData.length > 0) {
      updateChartData();
    }
  };

  const updateChartData = () => {
    console.log('[WeatherHistory] Updating chart data with unit system:', unitSystem);
    
    // Обновляем данные температуры
    const tempData = {
      labels: history.slice(-7).map(record => {
        const date = new Date(record.timestamp);
        return `${date.getDate()}.${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: history.slice(-7).map(record => 
            unitSystem === 'metric' 
              ? record.temperature 
              : convertTemperature(record.temperature, 'imperial')
          ),
          color: (opacity = 1) => theme.colors.chart.temperature,
          strokeWidth: 2
        }
      ]
    };
    
    // Данные влажности не зависят от системы единиц
    const humData = {
      labels: history.slice(-7).map(record => {
        const date = new Date(record.timestamp);
        return `${date.getDate()}.${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: history.slice(-7).map(record => record.humidity),
          color: (opacity = 1) => theme.colors.chart.humidity,
          strokeWidth: 2
        }
      ]
    };
    
    setChartData(tempData);
    setHumidityData(humData);
  };

  if (history.length === 0 || !chartData || !humidityData) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Получаем температуру в нужных единицах
  const getTemperature = (temp: number) => {
    return unitSystem === 'metric' 
      ? `${temp}${units.temperature}`
      : `${Math.round(convertTemperature(temp, 'imperial'))}${units.temperature}`;
  };

  // Получаем скорость ветра в нужных единицах
  const getWindSpeed = (speed: number) => {
    return unitSystem === 'metric'
      ? `${speed} ${units.speed}`
      : `${Math.round(convertWindSpeed(speed, 'imperial'))} ${units.speed}`;
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
    >
      <TouchableOpacity 
        style={styles.titleContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {translations.history?.title || 'Weather History'}
        </Text>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: theme.colors.textPrimary }]}>
              {translations.history?.temperature || 'Temperature History'}
            </Text>
            <LineChart
              data={chartData}
              width={width - 40}
              height={180}
              chartConfig={{
                backgroundColor: theme.colors.cardBackground,
                backgroundGradientFrom: theme.colors.cardBackground,
                backgroundGradientTo: theme.colors.cardBackground,
                decimalPlaces: 1,
                color: (opacity = 1) => theme.colors.textSecondary,
                labelColor: (opacity = 1) => theme.colors.textSecondary,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: theme.colors.chart.temperature
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              formatYLabel={(value) => `${value}${units.temperature}`}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: theme.colors.textPrimary }]}>
              {translations.history?.humidity || 'Humidity History'}
            </Text>
            <LineChart
              data={humidityData}
              width={width - 40}
              height={180}
              chartConfig={{
                backgroundColor: theme.colors.cardBackground,
                backgroundGradientFrom: theme.colors.cardBackground,
                backgroundGradientTo: theme.colors.cardBackground,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.textSecondary,
                labelColor: (opacity = 1) => theme.colors.textSecondary,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: theme.colors.chart.humidity
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              formatYLabel={(value) => `${value}%`}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recordsScrollView}
          >
            {history.slice(-10).map((record, index) => (
              <View 
                key={index} 
                style={[
                  styles.historyRecord, 
                  { backgroundColor: theme.colors.backgroundSecondary }
                ]}
              >
                <Text style={[styles.recordDate, { color: theme.colors.textPrimary }]}>
                  {formatDate(record.timestamp)}
                </Text>
                <View style={styles.recordItem}>
                  <Icon name="thermometer" size={16} color={theme.colors.chart.temperature} />
                  <Text style={[styles.recordValue, { color: theme.colors.textPrimary }]}>
                    {getTemperature(record.temperature)}
                  </Text>
                </View>
                <View style={styles.recordItem}>
                  <Icon name="water-percent" size={16} color={theme.colors.chart.humidity} />
                  <Text style={[styles.recordValue, { color: theme.colors.textPrimary }]}>
                    {record.humidity}%
                  </Text>
                </View>
                <View style={styles.recordItem}>
                  <Icon name="weather-windy" size={16} color={theme.colors.chart.wind} />
                  <Text style={[styles.recordValue, { color: theme.colors.textPrimary }]}>
                    {getWindSpeed(record.windSpeed)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartContainer: {
    padding: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    marginBottom: 8,
  },
  recordsScrollView: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  historyRecord: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    minWidth: 120,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  recordValue: {
    fontSize: 14,
    marginLeft: 6,
  },
}); 