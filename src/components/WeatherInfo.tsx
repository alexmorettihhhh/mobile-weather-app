import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  Layout,
  ZoomIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import type { WeatherData } from '../types/weather';

interface WeatherInfoProps {
  weatherData: WeatherData;
  city: string;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData, city }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  // Анимированные значения
  const iconRotation = useSharedValue(0);
  const temperatureScale = useSharedValue(0);
  
  // Обновляем анимации при смене города
  useEffect(() => {
    // Анимация вращения иконки
    iconRotation.value = withSequence(
      withTiming(0.1, { duration: 100 }),
      withTiming(0, { duration: 1000 })
    );
    
    // Анимация масштабирования температуры
    temperatureScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(300, withTiming(1, { duration: 600 }))
    );
  }, [city, weatherData]);
  
  // Стили анимации для иконки
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${iconRotation.value * 360}deg` },
        { scale: interpolate(iconRotation.value, [0, 0.1], [1, 1.2]) }
      ]
    };
  });
  
  // Стили анимации для температуры
  const temperatureAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: temperatureScale.value,
      transform: [
        { scale: interpolate(temperatureScale.value, [0, 1], [0.8, 1]) }
      ]
    };
  });

  const getWeatherIcon = (code: number): string => {
    // Код для определения иконки погоды на основе кода условия
    switch (true) {
      case code === 1000: // Солнечно
        return 'weather-sunny';
      case code === 1003: // Частичная облачность
        return 'weather-partly-cloudy';
      case [1006, 1009].includes(code): // Облачно
        return 'weather-cloudy';
      case [1030, 1135, 1147].includes(code): // Туман
        return 'weather-fog';
      case [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code): // Дождь
        return 'weather-rainy';
      case [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code): // Снег
        return 'weather-snowy';
      case [1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1249, 1252].includes(code): // Град
        return 'weather-hail';
      case [1087, 1273, 1276, 1279, 1282].includes(code): // Гроза
        return 'weather-lightning';
      case [1237, 1261, 1264].includes(code): // Ледяной дождь
        return 'weather-snowy-rainy';
      default:
        return 'weather-cloudy';
    }
  };

  // Определяем градиент в зависимости от погоды
  const getWeatherGradient = () => {
    const code = weatherData.current.condition.code;
    // Предполагаем, что сейчас день для упрощения
    const isDay = true;
    
    // Массивы цветов градиента для разных погодных условий
    if (isDay) {
      // Дневные градиенты
      if (code === 1000) return ['#4DBBFF', '#3690EA']; // Ясно
      if ([1003, 1006, 1009].includes(code)) return ['#62C2FF', '#4A9BE0']; // Облачно
      if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
        return ['#5E9DD8', '#4581B5']; // Дождь
      if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
        return ['#9EBBD2', '#7E9AB0']; // Снег
      if ([1087, 1273, 1276, 1279, 1282].includes(code))
        return ['#6E8CAC', '#556A89']; // Гроза
    } else {
      // Ночные градиенты
      if (code === 1000) return ['#0A1929', '#162F4A']; // Ясно
      if ([1003, 1006, 1009].includes(code)) return ['#0D2136', '#183958']; // Облачно
      if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
        return ['#0C1C2E', '#152C4A']; // Дождь
      if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
        return ['#0E1E2F', '#1B334D']; // Снег
      if ([1087, 1273, 1276, 1279, 1282].includes(code))
        return ['#0A1521', '#162538']; // Гроза
    }

    return currentTheme === 'dark' ? ['#122B40', '#1A3A56'] : ['#4DBBFF', '#3690EA'];
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
      style={styles.outerContainer}
    >
      <AnimatedGradient
        entering={FadeIn.duration(800)}
        colors={getWeatherGradient() as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.cardShadow]}
      >
        <Animated.Text 
          entering={SlideInRight.duration(500)}
          style={[styles.cityName, { color: theme.colors.textPrimary }]}
        >
          {city}
        </Animated.Text>
        
        <View style={styles.mainInfo}>
          <View style={styles.iconBackgroundCircle}>
            <View style={styles.iconGlow}>
              <AnimatedIcon
                style={[iconAnimatedStyle, styles.weatherIcon]}
                name={getWeatherIcon(weatherData.current.condition.code)}
                size={100}
                color="#FFFFFF"
              />
            </View>
          </View>
          <View style={styles.temperatureContainer}>
            <Animated.Text 
              style={[styles.temperature, temperatureAnimatedStyle]}
            >
              {Math.round(weatherData.current.temp_c)}°
            </Animated.Text>
            <Animated.Text 
              entering={FadeIn.delay(300).duration(300)}
              style={[styles.condition, { color: theme.colors.textPrimary }]}
            >
              {weatherData.current.condition.text}
            </Animated.Text>
          </View>
        </View>

        <Animated.View 
          entering={FadeIn.delay(400)} 
          style={styles.detailsGrid}
        >
          <Animated.View 
            entering={ZoomIn.delay(500).duration(300)}
            style={[styles.detailItem, styles.detailItemCard]}
          >
            <Icon name="thermometer" size={24} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.feelsLike}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {Math.round(weatherData.current.feelslike_c)}°C
            </Text>
          </Animated.View>

          <Animated.View 
            entering={ZoomIn.delay(600).duration(300)}
            style={[styles.detailItem, styles.detailItemCard]}
          >
            <Icon name="water-percent" size={24} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.humidity}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {weatherData.current.humidity}%
            </Text>
          </Animated.View>

          <Animated.View 
            entering={ZoomIn.delay(700).duration(300)}
            style={[styles.detailItem, styles.detailItemCard]}
          >
            <Icon name="weather-windy" size={24} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.wind}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {Math.round(weatherData.current.wind_kph)} км/ч
            </Text>
          </Animated.View>

          <Animated.View 
            entering={ZoomIn.delay(800).duration(300)}
            style={[styles.detailItem, styles.detailItemCard]}
          >
            <Icon name="gauge" size={24} color={theme.colors.primary} />
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              {translations.weather.pressure}
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {weatherData.current.pressure_mb} мб
            </Text>
          </Animated.View>
        </Animated.View>
      </AnimatedGradient>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  outerContainer: {
    padding: 16,
  },
  container: {
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cityName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  iconBackgroundCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  weatherIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    overflow: 'visible',
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  condition: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  detailItem: {
    width: (width - 72) / 2,
    alignItems: 'center',
    paddingVertical: 12,
    margin: 5,
  },
  detailItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  iconGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    borderRadius: 50,
  },
}); 