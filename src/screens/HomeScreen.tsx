import React from 'react';
import { SectionList, RefreshControl, StyleSheet, View, Text, Platform, ActivityIndicator } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut,
  Layout,
  SlideInUp
} from 'react-native-reanimated';
import { WeatherInfo } from '../components/WeatherInfo';
import { WeatherRecommendations } from '../components/WeatherRecommendations';
import { AstronomicalData } from '../components/AstronomicalData';
import { CitySearch } from '../components/CitySearch';
import { HourlyForecast } from '../components/HourlyForecast';
import { ExtendedWeatherInfo } from '../components/ExtendedWeatherInfo';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export const HomeScreen: React.FC = () => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { weatherData, loading, refreshWeather, currentCity, setCity, error } = useWeather();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  if (loading && !weatherData) {
    return (
      <View 
        style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary}
        />
      </View>
    );
  }

  if (!currentCity) {
    return (
      <View 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.welcomeContainer}>
          <Text 
            style={[styles.welcomeText, { color: theme.colors.textPrimary }]}
          >
            {translations.locations.searchPlaceholder}
          </Text>
          <CitySearch onCitySelect={setCity} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View 
        style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}
      >
        <Text 
          style={[styles.errorText, { color: theme.colors.error }]}
        >
          {error}
        </Text>
        <CitySearch onCitySelect={setCity} />
      </View>
    );
  }

  const sections = weatherData ? [
    { title: 'search', data: [{ type: 'search' }] },
    { title: 'weather', data: [{ type: 'weather' }] },
    { title: 'hourly', data: [{ type: 'hourly' }] },
    { title: 'extended', data: [{ type: 'extended' }] },
    { title: 'recommendations', data: [{ type: 'recommendations' }] },
    { title: 'astronomical', data: [{ type: 'astronomical' }] },
  ] : [{ title: 'search', data: [{ type: 'search' }] }];

  const renderItem = ({ item }: { item: { type: string } }) => {
    if (!weatherData && item.type !== 'search') return null;

    switch (item.type) {
      case 'search':
        return <CitySearch onCitySelect={setCity} />;
      case 'weather':
        return weatherData && <WeatherInfo weatherData={weatherData} city={currentCity} />;
      case 'hourly':
        return weatherData && <HourlyForecast hourlyData={weatherData.forecast.forecastday[0].hour} />;
      case 'extended':
        return weatherData && (
          <ExtendedWeatherInfo
            data={{
              uv: weatherData.current.uv,
              air_quality: weatherData.current.air_quality,
              wind_degree: weatherData.current.wind_degree,
              wind_dir: weatherData.current.wind_dir,
              precip_chance: weatherData.forecast.forecastday[0].day.daily_chance_of_rain || 0,
            }}
          />
        );
      case 'recommendations':
        return weatherData && <WeatherRecommendations weatherData={weatherData} />;
      case 'astronomical':
        return <AstronomicalData city={currentCity} />;
      default:
        return null;
    }
  };

  return (
    <SectionList
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={() => null}
      keyExtractor={(item, index) => item.type + index}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshWeather}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeContainer: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
}); 