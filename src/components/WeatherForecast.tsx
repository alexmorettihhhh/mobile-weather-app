import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import { weatherService } from '../services/weatherApi';
import { WeatherData, Hour, ForecastDay } from '../types/weather';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';

interface WeatherForecastProps {
  city: string;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ city }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getWeather(city);
        setForecast(data as WeatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : ru.errors.apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
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

  if (!forecast) {
    return null;
  }

  const renderHourlyForecast = (hours: Hour[]) => {
    const currentHour = new Date().getHours();
    const futureHours = hours.filter((hour) => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime > currentHour;
    });

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.hourlyContainer}
      >
        {futureHours.map((hour, index) => (
          <View 
            key={index} 
            style={[
              styles.hourlyItem,
              { backgroundColor: theme.colors.cardBackground }
            ]}
          >
            <Text style={[styles.hourlyTime, { color: theme.colors.textSecondary }]}>
              {new Date(hour.time).getHours()}:00
            </Text>
            <Image
              source={{ uri: `https:${hour.condition.icon}` }}
              style={styles.hourlyIcon as ImageStyle}
            />
            <Text style={[styles.hourlyTemp, { color: theme.colors.textPrimary }]}>
              {Math.round(hour.temp_c)}{ru.units.temperature}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderDailyForecast = (days: ForecastDay[]) => {
    return (
      <View style={styles.dailyContainer}>
        {days.map((day, index) => (
          <View 
            key={index} 
            style={[
              styles.dailyItem,
              { backgroundColor: theme.colors.cardBackground }
            ]}
          >
            <Text style={[styles.dailyDate, { color: theme.colors.textPrimary }]}>
              {new Date(day.date).toLocaleDateString('ru-RU', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <View style={styles.dailyDetails}>
              <Image
                source={{ uri: `https:${day.day.condition.icon}` }}
                style={styles.dailyIcon as ImageStyle}
              />
              <View style={styles.dailyTemps}>
                <Text style={[styles.dailyHighTemp, { color: theme.colors.textPrimary }]}>
                  {Math.round(day.day.maxtemp_c)}{ru.units.temperature}
                </Text>
                <Text style={[styles.dailyLowTemp, { color: theme.colors.textSecondary }]}>
                  {Math.round(day.day.mintemp_c)}{ru.units.temperature}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {ru.weather.hourlyForecast}
      </Text>
      {renderHourlyForecast(forecast.forecast.forecastday[0].hour)}
      
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {ru.weather.dailyForecast}
      </Text>
      {renderDailyForecast(forecast.forecast.forecastday)}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  hourlyContainer: {
    marginBottom: 24,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 24,
    padding: 16,
    borderRadius: 8,
    minWidth: 80,
  },
  hourlyTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  hourlyIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 14,
  },
  dailyContainer: {
    gap: 16,
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  dailyDate: {
    fontSize: 14,
    width: '40%',
  },
  dailyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dailyIcon: {
    width: 40,
    height: 40,
  },
  dailyTemps: {
    flexDirection: 'row',
    gap: 8,
    width: 80,
  },
  dailyHighTemp: {
    fontSize: 14,
  },
  dailyLowTemp: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 