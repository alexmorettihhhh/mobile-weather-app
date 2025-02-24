import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';
import { Hour } from '../types/weather';

interface TemperatureChartProps {
  hours: Hour[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ hours }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const currentHour = new Date().getHours();
  const futureHours = hours.filter((hour) => {
    const hourTime = new Date(hour.time).getHours();
    return hourTime >= currentHour;
  });

  const data = {
    labels: futureHours.map((hour) => `${new Date(hour.time).getHours()}:00`),
    datasets: [
      {
        data: futureHours.map((hour) => hour.temp_c),
        color: () => theme.colors.chart.line,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {ru.weather.temperatureChart}
      </Text>
      <LineChart
        data={data}
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