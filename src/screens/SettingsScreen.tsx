import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { 
  FadeIn,
  Layout,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

export const SettingsScreen: React.FC = () => {
  const { theme: currentTheme, toggleTheme } = useApp();
  const { language, setLanguage, translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const renderSettingItem = (
    title: string,
    value: string,
    onPress: () => void,
    icon: string,
    index: number
  ) => (
    <Animated.View
      entering={SlideInRight.delay(index * 200)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
        onPress={onPress}
      >
        <View style={styles.settingLeft}>
          <Icon name={icon} size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
        </View>
        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
            {value}
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {renderSettingItem(
        translations.settings.theme,
        currentTheme === 'dark' ? translations.settings.dark : translations.settings.light,
        toggleTheme,
        'theme-light-dark',
        0
      )}
      {renderSettingItem(
        translations.settings.language,
        language === 'ru' ? 'Русский' : 'English',
        () => setLanguage(language === 'ru' ? 'en' : 'ru'),
        'translate',
        1
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
}); 