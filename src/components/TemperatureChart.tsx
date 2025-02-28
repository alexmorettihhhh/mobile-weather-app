import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { Hour } from '../types/weather';

interface TemperatureChartProps {
  hours: Hour[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ hours }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem, units } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [chartData, setChartData] = useState<any>(null);

  const currentHour = new Date().getHours();
  const futureHours = hours.filter((hour) => {
    const hourTime = new Date(hour.time).getHours();
    return hourTime >= currentHour;
  });

  useEffect(() => {
    console.log('[TemperatureChart] Unit system changed to:', unitSystem);
    updateChartData();
  }, [unitSystem, hours]);

  const updateChartData = () => {
    console.log('[TemperatureChart] Updating chart data with unit system:', unitSystem);
    const data = {
      labels: futureHours.map((hour) => `${new Date(hour.time).getHours()}:00`),
      datasets: [
        {
          // Используем temp_c для метрической системы и temp_f для имперской
          data: futureHours.map((hour) => unitSystem === 'metric' ? hour.temp_c : hour.temp_f),
          color: () => theme.colors.chart.line,
          strokeWidth: 2,
        },
      ],
    };
    setChartData(data);
  };

  if (!chartData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {translations.weather.temperatureChart || 'Temperature Chart'}
      </Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 1,
          color: () => theme.colors.chart.text,
          labelColor: () => theme.colors.chart.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.chart.point,
          },
          propsForBackgroundLines: {
            stroke: theme.colors.chart.grid,
          },
        }}
        bezier
        style={styles.chart}
        formatYLabel={(value) => `${value}${units.temperature}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
}); 