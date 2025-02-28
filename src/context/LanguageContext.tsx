import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { en } from '../localization/en';
import { ru } from '../localization/ru';
import { es } from '../localization/es';
import { de } from '../localization/de';

type Language = 'en' | 'ru' | 'es' | 'de';
type Translations = typeof en | typeof ru | typeof es | typeof de;

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

// Функция для определения языка устройства
const getDeviceLanguage = (): Language => {
  console.log('[LanguageContext] Detecting device language');
  
  // Получаем локаль устройства
  let deviceLanguage = 'en';
  
  try {
    if (Platform.OS === 'ios') {
      deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale || 
                       NativeModules.SettingsManager.settings.AppleLanguages[0] || 
                       'en';
    } else if (Platform.OS === 'android') {
      deviceLanguage = NativeModules.I18nManager.localeIdentifier || 'en';
    }
    
    console.log('[LanguageContext] Device language detected:', deviceLanguage);
    
    // Извлекаем основной код языка (первые 2 символа)
    const languageCode = deviceLanguage.substring(0, 2).toLowerCase();
    
    // Проверяем, поддерживается ли язык в приложении
    if (['en', 'ru', 'es', 'de'].includes(languageCode)) {
      return languageCode as Language;
    }
  } catch (error) {
    console.error('[LanguageContext] Error detecting device language:', error);
  }
  
  // Возвращаем английский по умолчанию, если не удалось определить язык
  return 'en';
};

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
        console.log('[LanguageContext] No language found, detecting device language');
        // Определяем язык устройства и устанавливаем его
        const deviceLanguage = getDeviceLanguage();
        console.log('[LanguageContext] Using device language:', deviceLanguage);
        await setLanguage(deviceLanguage);
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
      
      // Выбираем соответствующие переводы в зависимости от языка
      switch (lang) {
        case 'en':
          setTranslations(en);
          break;
        case 'ru':
          setTranslations(ru);
          break;
        case 'es':
          setTranslations(es);
          break;
        case 'de':
          setTranslations(de);
          break;
        default:
          console.error('[LanguageContext] Unknown language:', lang);
          setTranslations(en);
          setError(`Язык ${lang} недоступен, используется английский`);
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