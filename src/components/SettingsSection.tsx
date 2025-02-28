import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

const SettingItem: React.FC<{
  icon: string;
  title: string;
  description?: string;
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}> = ({ icon, title, description, onPress, value, onValueChange }) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.settingItem,
          { 
            backgroundColor: theme.colors.surface,
            transform: [{ scale }] 
          },
        ]}
      >
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.background }]}>
          <Icon name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
        {onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: theme.colors.surface,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.onPrimary}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const SettingsSection: React.FC = () => {
  const { theme: currentTheme, setTheme } = useApp();
  const { language, setLanguage } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
  };

  const handleLanguageChange = (lang: 'ru' | 'en') => {
    setLanguage(lang);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Внешний вид
        </Text>
        <SettingItem
          icon="weather-sunny"
          title="Светлая тема"
          onPress={() => handleThemeChange('light')}
        />
        <SettingItem
          icon="weather-night"
          title="Тёмная тема"
          onPress={() => handleThemeChange('dark')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Язык
        </Text>
        <SettingItem
          icon="translate"
          title="Русский"
          onPress={() => handleLanguageChange('ru')}
        />
        <SettingItem
          icon="translate"
          title="English"
          onPress={() => handleLanguageChange('en')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          О приложении
        </Text>
        <SettingItem
          icon="information"
          title="Версия"
          description="1.0.0"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
}); 