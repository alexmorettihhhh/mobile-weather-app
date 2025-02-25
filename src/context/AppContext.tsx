import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => void;
  error: string | null;
  clearError: () => void;
  isInitialized: boolean;
}

// Создаем начальное дефолтное значение для контекста
const defaultContextValue: AppContextType = {
  theme: 'dark',
  setTheme: async () => {},
  toggleTheme: () => {},
  error: null,
  clearError: () => {},
  isInitialized: false
};

const AppContext = createContext<AppContextType>(defaultContextValue);

const THEME_STORAGE_KEY = 'app_theme';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[AppContext] Initializing provider');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('[AppContext] Provider mounted, loading saved theme');
    loadSavedTheme()
      .then(() => {
        console.log('[AppContext] Theme loaded successfully');
        setInitialized(true);
      })
      .catch(err => {
        console.error('[AppContext] Error loading theme:', err);
        setError('Ошибка загрузки темы. Используется тема по умолчанию.');
        setInitialized(true);
      });
  }, []);

  const loadSavedTheme = async () => {
    try {
      console.log('[AppContext] Reading theme from AsyncStorage');
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        console.log('[AppContext] Found saved theme:', savedTheme);
        setThemeState(savedTheme as Theme);
      } else {
        console.log('[AppContext] No theme found, using default');
      }
    } catch (error) {
      console.error('[AppContext] Error in loadSavedTheme:', error);
      throw error;
    }
  };

  const handleSetTheme = async (newTheme: Theme) => {
    console.log('[AppContext] Setting theme to:', newTheme);
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      console.log('[AppContext] Theme saved to AsyncStorage');
    } catch (error) {
      console.error('[AppContext] Error saving theme:', error);
      setError('Не удалось сохранить настройки темы.');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('[AppContext] Toggling theme from', theme, 'to', newTheme);
    handleSetTheme(newTheme);
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AppContextType = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme,
    error,
    clearError,
    isInitialized: initialized
  };

  // ВАЖНОЕ ИЗМЕНЕНИЕ: Всегда оборачиваем в Provider, даже если не инициализирован
  console.log('[AppContext] Rendering provider with theme:', theme, 'initialized:', initialized);
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.error('[useApp] Hook used outside of AppProvider!');
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 