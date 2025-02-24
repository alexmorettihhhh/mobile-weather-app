import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  FadeIn,
  Layout,
  SlideInRight
} from 'react-native-reanimated';
import { FavoriteCities } from '../components/FavoriteCities';
import { useApp } from '../context/AppContext';
import { useWeather } from '../hooks/useWeather';
import { darkTheme, lightTheme } from '../styles/theme';

export const FavoriteCitiesScreen: React.FC = () => {
  const { theme: currentTheme } = useApp();
  const { currentCity, setCity } = useWeather();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FavoriteCities
        currentCity={currentCity || ''}
        onCitySelect={setCity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 