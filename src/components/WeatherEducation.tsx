import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { WeatherEducationService } from '../services/weatherEducationService';
import { WeatherData } from '../types/weather';
import { darkTheme, lightTheme } from '../styles/theme';

interface WeatherEducationProps {
  weatherData: WeatherData;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - (CARD_MARGIN * 2);

export const WeatherEducation: React.FC<WeatherEducationProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0));
  const [currentFact, setCurrentFact] = useState(WeatherEducationService.getWeatherFact(weatherData));
  const [currentExplanation, setCurrentExplanation] = useState(WeatherEducationService.getWeatherExplanation(weatherData));

  useEffect(() => {
    // Анимация пульсации
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const updateFacts = useCallback(() => {
    setCurrentFact(WeatherEducationService.getWeatherFact(weatherData));
    setCurrentExplanation(WeatherEducationService.getWeatherExplanation(weatherData));
  }, [weatherData]);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 180;
    
    Animated.parallel([
      Animated.spring(flipAnimation, {
        toValue,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Обновляем факты только когда карточка перевернута обратно на переднюю сторону
      if (!isFlipped) {
        updateFacts();
      }
    });

    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Интересные факты о погоде
      </Text>
      
      <TouchableOpacity onPress={flipCard} activeOpacity={0.95}>
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnimation }] }]}>
          <Animated.View
            style={[
              styles.card,
              { transform: [{ rotateY: frontInterpolate }] },
              { backgroundColor: theme.colors.cardBackground },
            ]}
          >
            <Animated.View style={[styles.iconContainer, { opacity: glowOpacity }]}>
              <Icon name={currentFact.icon} size={48} color={theme.colors.primary} />
            </Animated.View>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              {currentFact.title}
            </Text>
            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              {currentFact.description}
            </Text>
            <View style={styles.flipHint}>
              <Icon name="rotate-3d" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.flipText, { color: theme.colors.textSecondary }]}>
                Нажмите, чтобы узнать больше
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] },
              { backgroundColor: theme.colors.cardBackground },
            ]}
          >
            <Animated.View style={[styles.iconContainer, { opacity: glowOpacity }]}>
              <Icon name={currentExplanation.icon} size={48} color={theme.colors.primary} />
            </Animated.View>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              {currentExplanation.phenomenon}
            </Text>
            <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
              {currentExplanation.explanation}
            </Text>
            <View style={styles.flipHint}>
              <Icon name="rotate-3d" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.flipText, { color: theme.colors.textSecondary }]}>
                Нажмите, чтобы вернуться
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: CARD_MARGIN,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH - 32,
    height: 280,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'space-between',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxHeight: 80,
  },
  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    padding: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  flipText: {
    fontSize: 12,
  },
}); 