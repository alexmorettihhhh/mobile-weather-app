import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { weatherService } from '../services/weatherApi';

interface CitySearchProps {
  onCitySelect: (city: string) => void;
}

const { width } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Анимационные значения
  const searchBarWidth = useSharedValue(0);
  const searchIconRotation = useSharedValue(0);
  const inputFocusScale = useSharedValue(1);

  // Debounce логика для запросов поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500 мс задержка перед поиском

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Обработка debounced запроса
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else if (debouncedQuery === '') {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // Обновляем анимацию при фокусе
  useEffect(() => {
    searchBarWidth.value = withTiming(isFocused ? 1 : 0.95, { duration: 250 });
    searchIconRotation.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    inputFocusScale.value = withSpring(isFocused ? 1.02 : 1);
  }, [isFocused]);

  // Анимированные стили
  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(searchBarWidth.value, [0, 1], [95, 100])}%`,
      transform: [{ scale: inputFocusScale.value }],
    };
  });

  const searchIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(searchIconRotation.value, [0, 1], [0, 45])}deg` },
      ],
    };
  });

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`[CitySearch] Выполняю поиск: ${query}`);
      const cities = await weatherService.searchCities(query);
      console.log(`[CitySearch] Найдено городов: ${cities?.length || 0}`);
      
      if (Array.isArray(cities) && cities.length > 0) {
        console.log(`[CitySearch] Список городов:`, cities);
        setSearchResults(cities);
      } else {
        console.log('[CitySearch] Города не найдены');
        setSearchResults([]);
      }
    } catch (err) {
      console.error("[CitySearch] Ошибка при поиске городов:", err);
      setError(translations.errors.networkError);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    // Debounce реализован через useEffect
  };

  const handleCitySelect = (city: string) => {
    console.log(`[CitySearch] Выбран город: ${city}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsFocused(false);
    Keyboard.dismiss();
    
    setTimeout(() => {
      console.log(`[CitySearch] Вызываю функцию выбора города: ${city}`);
      onCitySelect(city);
    }, 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const handleOutsidePress = () => {
    if (searchResults.length > 0) {
      setSearchResults([]);
      Keyboard.dismiss();
      setIsFocused(false);
    }
  };

  // Определяем цвета для темного режима в AMOLED-стиле
  const getDarkModeColors = () => {
    return {
      searchContainer: ['#121212', '#0A0A0A'] as readonly [string, string],
      results: ['rgba(18, 18, 18, 0.98)', 'rgba(10, 10, 10, 0.95)'] as readonly [string, string]
    };
  };

  // Определяем цвета для светлого режима
  const getLightModeColors = () => {
    return {
      searchContainer: ['rgba(255, 255, 255, 0.9)', 'rgba(240, 249, 255, 0.95)'] as readonly [string, string],
      results: ['rgba(255, 255, 255, 0.98)', 'rgba(240, 249, 255, 0.95)'] as readonly [string, string]
    };
  };

  const modeColors = currentTheme === 'dark' ? getDarkModeColors() : getLightModeColors();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[searchContainerStyle, styles.searchContainerWrapper]}
      >
        <LinearGradient
          colors={modeColors.searchContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.searchContainer,
            styles.elevation,
            { borderColor: theme.colors.border }
          ]}
        >
          <AnimatedIcon
            name="magnify"
            size={24}
            color={theme.colors.primary}
            style={searchIconStyle}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.textPrimary }]}
            placeholder={translations.locations.searchPlaceholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Задержка, чтобы можно было успеть выбрать город
              setTimeout(() => {
                if (searchResults.length > 0) {
                  setIsFocused(false);
                }
              }, 300);
            }}
          />
          {searchQuery.length > 0 && (
            <AnimatedTouchable
              onPress={clearSearch}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.clearButton}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.info]}
                style={styles.clearButtonGradient}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </LinearGradient>
            </AnimatedTouchable>
          )}
        </LinearGradient>
      </Animated.View>

      {loading && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {error && (
        <Animated.Text 
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={[styles.errorText, { color: theme.colors.error }]}
        >
          {error}
        </Animated.Text>
      )}

      {searchResults.length > 0 && (
        <Animated.View
          entering={SlideInDown.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.resultsOuterContainer,
            { backgroundColor: theme.colors.background + '99' } // Полупрозрачный фон
          ]}
        >
          <View style={[
            styles.resultsContainer, 
            styles.elevation,
            { backgroundColor: theme.colors.surface }
          ]}>
            <FlatList
              data={searchResults}
              keyboardShouldPersistTaps="always"
              keyExtractor={(item, index) => `city-${item}-${index}`}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={FadeIn.delay(index * 50).duration(200)}
                  layout={Layout}
                >
                  <TouchableOpacity
                    style={[
                      styles.resultItem,
                      { 
                        borderBottomColor: theme.colors.border,
                        backgroundColor: theme.colors.cardBackground
                      },
                      index === searchResults.length - 1 && styles.lastResultItem
                    ]}
                    onPress={() => handleCitySelect(item)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.info]}
                      style={styles.iconBackground}
                    >
                      <Icon name="map-marker" size={16} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.resultText, { color: theme.colors.textPrimary }]}>
                      {item}
                    </Text>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
              style={styles.resultsList}
              contentContainerStyle={styles.resultsContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    zIndex: 5,
    position: 'relative',
    minHeight: 80,
  },
  searchContainerWrapper: {
    width: '100%',
    zIndex: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 24,
    borderWidth: 1,
    width: '100%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    padding: 0,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonGradient: {
    borderRadius: 12,
    padding: 4,
  },
  indicatorContainer: {
    position: 'absolute',
    right: 72,
    top: 28,
    zIndex: 6,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    zIndex: 6,
  },
  resultsOuterContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 1000, // Увеличиваем z-index для результатов
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  resultsContainer: {
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 250,
    zIndex: 1000, // Увеличиваем z-index для контейнера результатов
  },
  resultsContent: {
    padding: 8,
  },
  resultsList: {
    width: '100%',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    marginBottom: 4,
    borderRadius: 12,
  },
  lastResultItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  resultText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  iconBackground: {
    padding: 8,
    borderRadius: 12,
  },
  chevronIcon: {
    marginLeft: 8,
  },
}); 