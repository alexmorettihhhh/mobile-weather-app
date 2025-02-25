import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { WeatherData } from '../types/weather';
import { ShareService } from '../services/shareService';

interface ShareWeatherProps {
  weatherData: WeatherData;
}

export const ShareWeather: React.FC<ShareWeatherProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [isSharing, setIsSharing] = useState(false);
  
  // Анимация кнопок
  const shareAnimation = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareAnimation.value }]
  }));
  
  // Обработчик нажатия "Поделиться текущей погодой"
  const handleShareCurrentWeather = async () => {
    try {
      setIsSharing(true);
      shareAnimation.value = withRepeat(
        withTiming(1.1, { duration: 300 }), 
        2, 
        true
      );
      
      await ShareService.shareWeather(weatherData);
    } catch (error) {
      console.error('Error sharing weather:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  // Обработчик нажатия "Поделиться прогнозом"
  const handleShareWeatherForecast = async () => {
    try {
      setIsSharing(true);
      shareAnimation.value = withRepeat(
        withTiming(1.1, { duration: 300 }), 
        2, 
        true
      );
      
      await ShareService.shareWeatherForecast(weatherData);
    } catch (error) {
      console.error('Error sharing weather forecast:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
    >
      <LinearGradient
        colors={
          currentTheme === 'dark' 
            ? ['#121212', '#0A0A0A'] 
            : [theme.colors.cardBackground, theme.colors.backgroundSecondary]
        }
        style={[styles.container, styles.shadow]}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {translations.share?.title || 'Поделиться погодой'}
        </Text>
        
        <View style={styles.shareOptionsContainer}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity 
              style={[
                styles.shareOption, 
                { 
                  backgroundColor: currentTheme === 'dark' 
                    ? '#1A1A1A' 
                    : theme.colors.backgroundSecondary 
                }
              ]}
              onPress={handleShareCurrentWeather}
              disabled={isSharing}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.info]}
                style={styles.iconBackground}
              >
                <Icon 
                  name="weather-cloudy" 
                  size={24} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
              <Text style={[styles.shareText, { color: theme.colors.textPrimary }]}>
                {translations.share?.current || 'Текущая погода'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={animatedStyle}>
            <TouchableOpacity 
              style={[
                styles.shareOption, 
                { 
                  backgroundColor: currentTheme === 'dark' 
                    ? '#1A1A1A' 
                    : theme.colors.backgroundSecondary 
                }
              ]}
              onPress={handleShareWeatherForecast}
              disabled={isSharing}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.info]}
                style={styles.iconBackground}
              >
                <Icon 
                  name="calendar-week" 
                  size={24} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
              <Text style={[styles.shareText, { color: theme.colors.textPrimary }]}>
                {translations.share?.forecast || 'Прогноз на неделю'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <Text style={[styles.note, { color: theme.colors.textSecondary }]}>
          {translations.share?.note || 'Поделитесь погодой с друзьями и близкими'}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  shareOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  shareOption: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 150,
  },
  iconBackground: {
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 8,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 