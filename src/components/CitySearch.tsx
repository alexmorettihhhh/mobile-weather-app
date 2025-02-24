import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { weatherService } from '../services/weatherApi';

interface CitySearchProps {
  onCitySelect: (city: string) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cities = await weatherService.searchCities(query);
      setSearchResults(cities);
    } catch (err) {
      setError(translations.errors.networkError);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    onCitySelect(city);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Icon name="magnify" size={24} color={theme.colors.primary} />
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholder={translations.locations.searchPlaceholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            <Icon name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item}
          style={[styles.resultsList, { backgroundColor: theme.colors.surface }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => handleCitySelect(item)}
            >
              <Icon name="map-marker" size={20} color={theme.colors.primary} />
              <Text style={[styles.resultText, { color: theme.colors.textPrimary }]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  resultsList: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  resultText: {
    fontSize: 16,
  },
}); 