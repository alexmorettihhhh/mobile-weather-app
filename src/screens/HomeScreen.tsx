import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { CitySearch } from '../components/CitySearch';
import { WeatherDisplay } from '../components/WeatherDisplay';
import { WeatherForecast } from '../components/WeatherForecast';
import { AirQuality } from '../components/AirQuality';
import { AstronomicalData } from '../components/AstronomicalData';
import { DEFAULT_LOCATION, ERROR_MESSAGES } from '../config/constants';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';

export const HomeScreen = () => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [currentCity, setCurrentCity] = useState(DEFAULT_LOCATION.city);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (city: string) => {
    setCurrentCity(city);
  };

  const handleLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(ERROR_MESSAGES.locationPermission);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentCity(`${latitude},${longitude}`);
    } catch (error) {
      console.error('Error getting location:', error);
      setError(ERROR_MESSAGES.locationUnavailable);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await handleLocation();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={42} color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          progressBackgroundColor={theme.colors.surface}
        />
      }
    >
      <CitySearch onSearch={handleSearch} onLocationPress={handleLocation} />
      <WeatherDisplay city={currentCity} />
      <WeatherForecast city={currentCity} />
      <AstronomicalData city={currentCity} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
}); 