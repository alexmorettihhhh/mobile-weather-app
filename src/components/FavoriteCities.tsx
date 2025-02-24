import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { weatherService } from '../services/weatherApi';

const FAVORITE_CITIES_KEY = 'favorite_cities';

interface FavoriteCitiesProps {
  onCitySelect: (city: string) => void;
  currentCity: string;
}

export const FavoriteCities: React.FC<FavoriteCitiesProps> = ({
  onCitySelect,
  currentCity,
}) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavoriteCities();
  }, []);

  const loadFavoriteCities = async () => {
    try {
      const cities = await AsyncStorage.getItem(FAVORITE_CITIES_KEY);
      if (cities) {
        setFavoriteCities(JSON.parse(cities));
      }
    } catch (error) {
      console.error('Error loading favorite cities:', error);
    }
  };

  const saveFavoriteCities = async (cities: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(cities));
      setFavoriteCities(cities);
    } catch (error) {
      console.error('Error saving favorite cities:', error);
    }
  };

  const addToFavorites = (city: string) => {
    if (!favoriteCities.includes(city)) {
      saveFavoriteCities([...favoriteCities, city]);
    }
  };

  const removeFromFavorites = (city: string) => {
    saveFavoriteCities(favoriteCities.filter(c => c !== city));
  };

  const handleSearch = async (query: string) => {
    setSearchText(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const cities = await weatherService.searchCities(query);
      setSearchResults(cities);
    } catch (error) {
      console.error('Error searching cities:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const detectCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', translations.errors.locationError);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const cities = await weatherService.searchCities(`${latitude},${longitude}`);
      
      if (cities.length > 0) {
        onCitySelect(cities[0]);
      }
    } catch (error) {
      Alert.alert('Error', translations.errors.locationError);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: translations.locations.currentLocation,
      data: ['location'],
      type: 'location'
    },
    {
      title: translations.locations.favorites,
      data: favoriteCities,
      type: 'favorites'
    },
    ...(searchResults.length > 0 ? [{
      title: translations.common.search,
      data: searchResults,
      type: 'search'
    }] : [])
  ];

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
      {title}
    </Text>
  );

  const renderItem = ({ item, section }: { item: string; section: { type: string } }) => {
    if (section.type === 'location') {
      return (
        <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
          onPress={detectCurrentLocation}
          disabled={loading}
        >
          <Icon name="crosshairs-gps" size={24} color={theme.colors.onPrimary} />
          <Text style={[styles.locationButtonText, { color: theme.colors.onPrimary }]}>
            {translations.locations.detectLocation}
          </Text>
        </TouchableOpacity>
      );
    }

    const isFavorite = favoriteCities.includes(item);
    const isCurrentCity = item === currentCity;

    return (
      <TouchableOpacity
        style={[styles.cityItem, { backgroundColor: theme.colors.cardBackground }]}
        onPress={() => onCitySelect(item)}
      >
        <View style={styles.cityInfo}>
          <Icon
            name={isCurrentCity ? 'map-marker' : 'map-marker-outline'}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.cityName, { color: theme.colors.textPrimary }]}>
            {item}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => isFavorite ? removeFromFavorites(item) : addToFavorites(item)}
          style={styles.favoriteButton}
        >
          <Icon
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color={theme.colors.warning}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <Icon name="magnify" size={24} color={theme.colors.primary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          placeholder={translations.locations.searchPlaceholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchText('');
            setSearchResults([]);
          }}>
            <Icon name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
}); 