import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import type { ForecastDay, WeatherData } from '../types/weather';

const { width } = Dimensions.get('window');
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface WeatherTimelapseProps {
  weatherData: WeatherData;
}

export const WeatherTimelapse: React.FC<WeatherTimelapseProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  const dailyData = weatherData.forecast.forecastday;
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Получение иконки погоды по коду
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
  
  // Получение градиента для дня в зависимости от погоды
  const getDayGradient = (forecastDay: ForecastDay) => {
    const code = forecastDay.day.condition.code;
    
    if (code === 1000) return ['#4DBBFF', '#3690EA']; // Ясно
    if ([1003, 1006, 1009].includes(code)) return ['#62C2FF', '#4A9BE0']; // Облачно
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
      return ['#5E9DD8', '#4581B5']; // Дождь
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
      return ['#9EBBD2', '#7E9AB0']; // Снег
    if ([1087, 1273, 1276, 1279, 1282].includes(code))
      return ['#6E8CAC', '#556A89']; // Гроза
    
    return currentTheme === 'dark' ? ['#0A1929', '#162F4A'] : ['#4DBBFF', '#3690EA'];
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('ru-RU', options);
  };
  
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {translations.weather.dailyForecast}
        </Text>
      </View>
      
      <View style={styles.daysContainer}>
        {dailyData.map((day, index) => (
          <View 
            key={`day-${index}`} 
            style={styles.dayItem}
          >
            <Text style={[styles.dayDate, { color: theme.colors.textSecondary }]}>
              {index === 0 ? 'Сегодня' : formatDate(day.date)}
            </Text>
            <LinearGradient
              colors={getDayGradient(day) as [string, string]}
              style={[
                styles.dayCard,
                index === 0 && { borderColor: theme.colors.primary, borderWidth: 1.5 }
              ]}
            >
              <Icon
                name={getWeatherIcon(day.day.condition.code)}
                size={28}
                color="#FFFFFF"
                style={styles.weatherIcon}
              />
              <View style={styles.tempContainer}>
                <Text style={styles.maxTempText}>{Math.round(day.day.maxtemp_c)}°</Text>
                <Text style={styles.minTempText}>{Math.round(day.day.mintemp_c)}°</Text>
              </View>
              <Text style={styles.conditionText}>{day.day.condition.text}</Text>
            </LinearGradient>
            <Text 
              style={[
                styles.precipText, 
                { color: day.day.daily_chance_of_rain > 30 ? theme.colors.info : theme.colors.textSecondary }
              ]}
            >
              {day.day.daily_chance_of_rain}%
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {dailyData.length > 3 ? 'Проведите для просмотра всех дней' : ' '}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysContainer: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    width: width / 3.5,
  },
  dayDate: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '500',
  },
  dayCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  maxTempText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginRight: 4,
  },
  minTempText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 14,
    opacity: 0.8,
  },
  precipText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  weatherIcon: {
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
}); 