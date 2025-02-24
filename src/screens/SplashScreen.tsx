import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  const scale = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Завершаем сплеш-скрин через 3 секунды
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale },
              { rotate: spin },
            ],
            opacity,
          },
        ]}
      >
        <Icon
          name="weather-partly-cloudy"
          size={120}
          color={theme.colors.primary}
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity,
            transform: [{ scale }],
            color: theme.colors.textPrimary,
          },
        ]}
      >
        Weather App
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
}); 