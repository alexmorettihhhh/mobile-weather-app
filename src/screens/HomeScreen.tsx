import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { WeatherInfo } from '../components/WeatherInfo';
import { WeatherRecommendations } from '../components/WeatherRecommendations';
import { AstronomicalData } from '../components/AstronomicalData';
import { CitySearch } from '../components/CitySearch';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';

export const HomeScreen: React.FC = () => {
  const { theme: currentTheme } = useApp();
  const { weatherData, loading, refreshWeather, currentCity, setCity } = useWeather();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshWeather}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <CitySearch onCitySelect={setCity} />
      {weatherData && (
        <>
          <WeatherInfo weatherData={weatherData} city={currentCity} />
          <WeatherRecommendations weatherData={weatherData} />
          <AstronomicalData city={currentCity} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 