import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WeatherData } from '../types/weather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

interface WeatherRecommendationsProps {
  weatherData: WeatherData;
}

export const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const getClothingRecommendation = (temp: number): string => {
    if (temp <= 0) {
      return translations.recommendations.clothing.winter;
    } else if (temp <= 10) {
      return translations.recommendations.clothing.warm;
    } else if (temp <= 20) {
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
    if (needUmbrella(condition)) {
      return translations.recommendations.activities.rain;
    } else if (temp > 30) {
      return translations.recommendations.activities.indoor;
    } else if (temp < -10) {
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
            {getClothingRecommendation(current.temp_c)}
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
            {getActivityRecommendation(current.temp_c, current.condition.text)}
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