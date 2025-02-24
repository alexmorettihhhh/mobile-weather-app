import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';

interface Settings {
  theme: Theme;
  language: Language;
  followSystem: boolean;
}

const STORAGE_KEY = '@settings';

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'ru',
  followSystem: true,
};

export const useSettings = () => {
  const systemTheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings.followSystem && systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme, settings.followSystem]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const setTheme = (theme: Theme) => {
    saveSettings({ ...settings, theme });
  };

  const setLanguage = (language: Language) => {
    saveSettings({ ...settings, language });
  };

  const setFollowSystem = (followSystem: boolean) => {
    saveSettings({ ...settings, followSystem });
  };

  const getCurrentTheme = (): Theme => {
    if (settings.followSystem && systemTheme) {
      return systemTheme;
    }
    return settings.theme;
  };

  return {
    theme: getCurrentTheme(),
    language: settings.language,
    followSystem: settings.followSystem,
    setTheme,
    setLanguage,
    setFollowSystem,
  };
}; 