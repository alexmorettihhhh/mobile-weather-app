import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';

export const SettingsScreen: React.FC = () => {
  const { theme: currentTheme, toggleTheme } = useApp();
  const { language, setLanguage, translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    value: string,
    onPress: () => void,
    isSwitch?: boolean,
    switchValue?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.settingContent}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
        <View style={styles.settingTexts}>
          <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
            {value}
          </Text>
        </View>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onPress}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      ) : (
        <Icon
          name="chevron-right"
          size={24}
          color={theme.colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {translations.settings.appearance.toUpperCase()}
        </Text>
        
        {renderSettingItem(
          'theme-light-dark',
          translations.settings.theme,
          currentTheme === 'dark' ? translations.settings.dark : translations.settings.light,
          toggleTheme,
          true,
          currentTheme === 'dark'
        )}
        
        {renderSettingItem(
          'translate',
          translations.settings.language,
          language === 'en' ? 'English' : 'Русский',
          handleLanguageChange
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, marginTop: 24 }]}>
        {translations.settings.about.toUpperCase()}
      </Text>

      {renderSettingItem(
        'information',
        translations.settings.about,
        'v1.0.0',
        () => {}
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTexts: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
}); 