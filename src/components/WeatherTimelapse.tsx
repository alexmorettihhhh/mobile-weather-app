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
import type { Hour, WeatherData } from '../types/weather';

const { width } = Dimensions.get('window');
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface WeatherTimelapseProps {
  weatherData: WeatherData;
}

export const WeatherTimelapse: React.FC<WeatherTimelapseProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  const hourlyData = weatherData.forecast.forecastday[0].hour;
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentHourIndex, setCurrentHourIndex] = useState(getCurrentHourIndex());
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Анимированные значения
  const progressValue = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const playButtonScale = useSharedValue(1);
  
  // Получаем индекс текущего часа
  function getCurrentHourIndex(): number {
    const currentHour = new Date().getHours();
    return hourlyData.findIndex(hour => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime === currentHour;
    });
  }
  
  // Эффект для автоматической прокрутки к текущему часу
  useEffect(() => {
    if (scrollViewRef.current && currentHourIndex >= 0) {
      // Небольшая задержка для уверенности, что компонент отрендерился
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: currentHourIndex * (width / 6), // Ширина каждого элемента
          animated: true,
        });
      }, 500);
    }
  }, [currentHourIndex]);
  
  // Запуск/остановка воспроизведения
  useEffect(() => {
    if (isPlaying) {
      // Начать анимацию
      progressValue.value = 0;
      progressValue.value = withTiming(1, {
        duration: 24000 / playbackSpeed, // 24 часа со скоростью воспроизведения
        easing: Easing.linear,
      }, (finished) => {
        if (finished) {
          runOnJS(handlePlaybackComplete)();
        }
      });
      
      // Анимация иконки воспроизведения
      iconRotation.value = withRepeat(
        withTiming(360, { 
          duration: 2000, 
          easing: Easing.linear 
        }),
        -1,
        false
      );
    } else {
      // Остановить анимацию
      cancelAnimation(progressValue);
      cancelAnimation(iconRotation);
    }
    
    return () => {
      cancelAnimation(progressValue);
      cancelAnimation(iconRotation);
    };
  }, [isPlaying, playbackSpeed]);
  
  // Функция обработки завершения воспроизведения
  const handlePlaybackComplete = () => {
    setIsPlaying(false);
    setCurrentHourIndex(getCurrentHourIndex());
  };
  
  // Функция для переключения воспроизведения
  const togglePlayback = () => {
    // Анимация кнопки воспроизведения
    playButtonScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    
    setIsPlaying(!isPlaying);
  };
  
  // Изменение скорости воспроизведения
  const changePlaybackSpeed = () => {
    const speeds = [1, 2, 4, 8];
    const nextSpeedIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextSpeedIndex]);
  };
  
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
  
  // Получение градиента для часа в зависимости от времени и погоды
  const getHourGradient = (hour: Hour) => {
    const code = hour.condition.code;
    const hourTime = new Date(hour.time).getHours();
    const isDay = hourTime >= 6 && hourTime < 20;
    
    if (isDay) {
      if (code === 1000) return ['#4DBBFF', '#3690EA']; // Ясно днем
      if ([1003, 1006, 1009].includes(code)) return ['#62C2FF', '#4A9BE0']; // Облачно днем
      if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
        return ['#5E9DD8', '#4581B5']; // Дождь днем
      if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
        return ['#9EBBD2', '#7E9AB0']; // Снег днем
      if ([1087, 1273, 1276, 1279, 1282].includes(code))
        return ['#6E8CAC', '#556A89']; // Гроза днем
    } else {
      if (code === 1000) return ['#0A1929', '#162F4A']; // Ясно ночью
      if ([1003, 1006, 1009].includes(code)) return ['#0D2136', '#183958']; // Облачно ночью
      if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
        return ['#0C1C2E', '#152C4A']; // Дождь ночью
      if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
        return ['#0E1E2F', '#1B334D']; // Снег ночью
      if ([1087, 1273, 1276, 1279, 1282].includes(code))
        return ['#0A1521', '#162538']; // Гроза ночью
    }
    
    return currentTheme === 'dark' ? ['#0A1929', '#162F4A'] : ['#4DBBFF', '#3690EA'];
  };
  
  // Анимированные стили
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value * 100}%`,
    };
  });
  
  const playIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: playButtonScale.value },
        { rotate: `${iconRotation.value}deg` }
      ],
    };
  });
  
  // Отображение времени в формате часы:минуты
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Отображение элемента часа
  const renderHourItem = (hour: Hour, index: number) => {
    const hourTime = formatTime(hour.time);
    const isCurrentHour = index === currentHourIndex;
    
    return (
      <View key={`hour-${index}`} style={styles.hourItem}>
        <Text style={[styles.hourTime, { color: theme.colors.textSecondary }]}>
          {hourTime}
        </Text>
        <LinearGradient
          colors={getHourGradient(hour) as [string, string]}
          style={[
            styles.hourCard,
            isCurrentHour && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
        >
          <Icon
            name={getWeatherIcon(hour.condition.code)}
            size={22}
            color="#FFFFFF"
          />
          <Text style={styles.tempText}>{Math.round(hour.temp_c)}°</Text>
        </LinearGradient>
        <Text 
          style={[
            styles.precipText, 
            { color: hour.chance_of_rain > 30 ? theme.colors.info : theme.colors.textSecondary }
          ]}
        >
          {hour.chance_of_rain}%
        </Text>
      </View>
    );
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
          {(translations.common as any).dailyForecast || 'Daily Forecast'}
        </Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={changePlaybackSpeed}
            style={[styles.speedButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={togglePlayback}
            style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          >
            <AnimatedIcon
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="#FFFFFF"
              style={playIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.timelineContainer}>
        <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.border }]}>
          <Animated.View
            style={[
              progressBarStyle,
              styles.progressBar,
              { backgroundColor: theme.colors.primary }
            ]}
          />
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hoursContainer}
        >
          {hourlyData.map((hour, index) => renderHourItem(hour, index))}
        </ScrollView>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {(translations.common as any).swipeToExplore || 'Swipe to explore all hours'}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  speedButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  timelineContainer: {
    paddingHorizontal: 16,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  hoursContainer: {
    paddingVertical: 8,
  },
  hourItem: {
    alignItems: 'center',
    marginRight: 10,
    width: width / 6 - 10, // 6 элементов в строке с небольшим отступом
  },
  hourTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  hourCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  tempText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 4,
  },
  precipText: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
}); 