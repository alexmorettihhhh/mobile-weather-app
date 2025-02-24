import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { ru } from '../localization/ru';

interface CitySearchProps {
  onSearch: (city: string) => void;
  onLocationPress: () => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSearch,
  onLocationPress,
}) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [searchText, setSearchText] = useState('');

  const handleSubmit = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
      setSearchText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Icon name="search" size={24} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholder={ru.search.placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
      </View>
      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
        onPress={onLocationPress}
        activeOpacity={0.7}
      >
        <Icon name="my-location" size={24} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    marginLeft: 8,
  },
  locationButton: {
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
}); 