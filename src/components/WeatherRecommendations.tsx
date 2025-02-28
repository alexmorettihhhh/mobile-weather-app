import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WeatherData } from '../types/weather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';

interface WeatherRecommendationsProps {
  weatherData: WeatherData;
}

export const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { unitSystem } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  // Выбираем температуру в зависимости от системы единиц
  const temp = unitSystem === 'metric' ? weatherData.current.temp_c : weatherData.current.temp_f;

  const getClothingRecommendation = (temp: number): string => {
    // Пороговые значения для метрической и имперской систем
    const thresholds = unitSystem === 'metric' 
      ? { freezing: 0, cold: 10, mild: 20 }
      : { freezing: 32, cold: 50, mild: 68 };
      
    if (temp <= thresholds.freezing) {
      return translations.recommendations.clothing.winter;
    } else if (temp <= thresholds.cold) {
      return translations.recommendations.clothing.warm;
    } else if (temp <= thresholds.mild) {
      return translations.recommendations.clothing.warm;
    } else {
      return translations.recommendations.clothing.light;
    }
  };

  const needUmbrella = (condition: string): boolean => {
    const rainConditions = [
      'rain', 'light rain', 'moderate rain', 'heavy rain',
      'shower', 'drizzle', 'thunderstorm'
    ];
    return rainConditions.some(rainCond => condition.toLowerCase().includes(rainCond));
  };

  const getActivityRecommendation = (temp: number, condition: string): string => {
    // Пороговые значения для метрической и имперской систем
    const thresholds = unitSystem === 'metric' 
      ? { hot: 30, freezing: -10 }
      : { hot: 86, freezing: 14 };
      
    if (needUmbrella(condition)) {
      return translations.recommendations.activities.rain;
    } else if (temp > thresholds.hot) {
      return translations.recommendations.activities.indoor;
    } else if (temp < thresholds.freezing) {
      return translations.recommendations.activities.cold;
    } else {
      return translations.recommendations.activities.perfect;
    }
  };

  const current = weatherData.current;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {translations.recommendations.title}
      </Text>

      <View style={styles.recommendationsContainer}>
        <View style={[styles.recommendationItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="hanger" size={24} color={theme.colors.primary} />
          <Text style={[styles.recommendationText, { color: theme.colors.textPrimary }]}>
            {getClothingRecommendation(temp)}
          </Text>
        </View>

        <View style={[styles.recommendationItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon 
            name={needUmbrella(current.condition.text) ? "umbrella" : "umbrella-outline"} 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.recommendationText, { color: theme.colors.textPrimary }]}>
            {needUmbrella(current.condition.text) 
              ? translations.recommendations.clothing.raincoat
              : translations.recommendations.activities.perfect}
          </Text>
        </View>

        <View style={[styles.recommendationItem, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="run" size={24} color={theme.colors.primary} />
          <Text style={[styles.recommendationText, { color: theme.colors.textPrimary }]}>
            {getActivityRecommendation(temp, current.condition.text)}
          </Text>
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
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
  },
}); 