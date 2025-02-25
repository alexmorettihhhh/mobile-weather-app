import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '../localization/en';
import { ru } from '../localization/ru';

type Language = 'en' | 'ru';
type Translations = typeof en | typeof ru;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => Promise<void>;
  error: string | null;
  clearError: () => void;
  isInitialized: boolean;
}

// Создаем начальное дефолтное значение для контекста
const defaultContextValue: LanguageContextType = {
  language: 'en',
  translations: en,
  setLanguage: async () => {},
  error: null,
  clearError: () => {},
  isInitialized: false
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

const LANGUAGE_STORAGE_KEY = 'app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[LanguageContext] Initializing provider');
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(en);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('[LanguageContext] Provider mounted, loading language');
    loadStoredLanguage()
      .then(() => {
        console.log('[LanguageContext] Language loaded successfully');
        setInitialized(true);
      })
      .catch(err => {
        console.error('[LanguageContext] Error loading language:', err);
        setError('Ошибка загрузки языка. Используется язык по умолчанию.');
        setInitialized(true);
      });
  }, []);

  const loadStoredLanguage = async () => {
    try {
      console.log('[LanguageContext] Reading language from AsyncStorage');
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage) {
        console.log('[LanguageContext] Found stored language:', storedLanguage);
        await setLanguage(storedLanguage as Language);
      } else {
        console.log('[LanguageContext] No language found, using default (en)');
      }
    } catch (error) {
      console.error('[LanguageContext] Failed to load language preference:', error);
      throw error;
    }
  };

  const setLanguage = async (lang: Language) => {
    console.log('[LanguageContext] Setting language to:', lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      
      console.log('[LanguageContext] Loading translations for:', lang);
      // Защитное условие на случай, если ru не определен
      if (lang === 'ru' && typeof ru === 'undefined') {
        console.error('[LanguageContext] Russian translations not found, fallback to English');
        setTranslations(en);
        setError('Русский язык недоступен, используется английский');
      } else {
        setTranslations(lang === 'en' ? en : ru);
      }
      
      console.log('[LanguageContext] Language updated successfully');
    } catch (error) {
      console.error('[LanguageContext] Failed to save language preference:', error);
      setError('Не удалось сохранить языковые настройки');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Для отладки выведем доступные секции переводов
  useEffect(() => {
    console.log('[LanguageContext] Available translation sections:', 
      Object.keys(translations).length > 0 
        ? Object.keys(translations) 
        : 'No translations available');
  }, [translations]);

  const contextValue: LanguageContextType = {
    language,
    translations,
    setLanguage,
    error,
    clearError,
    isInitialized: initialized
  };

  // ВАЖНОЕ ИЗМЕНЕНИЕ: Всегда оборачиваем в Provider, даже если не инициализирован
  console.log('[LanguageContext] Rendering provider with language:', language, 'initialized:', initialized);
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('[useLanguage] Hook used outside of LanguageProvider!');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 