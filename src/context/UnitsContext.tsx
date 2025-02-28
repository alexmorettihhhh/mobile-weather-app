import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from './LanguageContext';
import { DEFAULT_UNITS, DEFAULT_UNITS_IMPERIAL } from '../config/constants';
import { WeatherAlertService } from '../services/weatherAlertService';

export type UnitSystem = 'metric' | 'imperial';

interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => Promise<void>;
  units: {
    temperature: string;
    speed: string;
    pressure: string;
    precipitation: string;
    distance: string;
  };
  error: string | null;
  clearError: () => void;
  isInitialized: boolean;
}

const defaultContextValue: UnitsContextType = {
  unitSystem: 'metric',
  setUnitSystem: async () => {},
  units: DEFAULT_UNITS,
  error: null,
  clearError: () => {},
  isInitialized: false
};

const UnitsContext = createContext<UnitsContextType>(defaultContextValue);

const UNITS_STORAGE_KEY = 'app_units';

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[UnitsContext] Initializing provider');
  const { translations } = useLanguage();
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('metric');
  const [units, setUnits] = useState(defaultContextValue.units);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('[UnitsContext] Provider mounted, loading unit system');
    loadStoredUnitSystem()
      .then(() => {
        console.log('[UnitsContext] Unit system loaded successfully');
        setInitialized(true);
      })
      .catch(err => {
        console.error('[UnitsContext] Error loading unit system:', err);
        setError('Ошибка загрузки единиц измерения. Используется метрическая система.');
        setInitialized(true);
      });
  }, []);

  // Обновляем единицы измерения при изменении языка или системы единиц
  useEffect(() => {
    updateUnits();
  }, [translations, unitSystem]);

  const loadStoredUnitSystem = async () => {
    try {
      console.log('[UnitsContext] Reading unit system from AsyncStorage');
      const storedUnitSystem = await AsyncStorage.getItem(UNITS_STORAGE_KEY);
      if (storedUnitSystem) {
        console.log('[UnitsContext] Found stored unit system:', storedUnitSystem);
        await setUnitSystem(storedUnitSystem as UnitSystem);
      } else {
        console.log('[UnitsContext] No unit system found, using default (metric)');
        updateUnits();
      }
    } catch (error) {
      console.error('[UnitsContext] Failed to load unit system preference:', error);
      throw error;
    }
  };

  const updateUnits = () => {
    console.log('[UnitsContext] Updating units for system:', unitSystem);
    try {
      if (unitSystem === 'metric') {
        // Используем метрические единицы из текущего языка
        if (translations.units) {
          console.log('[UnitsContext] Using metric units from translations:', translations.units);
          setUnits(translations.units);
        } else {
          // Если в текущем языке нет единиц измерения, используем дефолтные
          console.log('[UnitsContext] No metric units in translations, using defaults:', DEFAULT_UNITS);
          setUnits(DEFAULT_UNITS);
        }
      } else {
        // Используем имперские единицы
        if ('unitsImperial' in translations) {
          console.log('[UnitsContext] Using imperial units from translations:', translations.unitsImperial);
          setUnits(translations.unitsImperial);
        } else {
          // Если в текущем языке нет имперских единиц, используем дефолтные имперские
          console.log('[UnitsContext] No imperial units in translations, using defaults:', DEFAULT_UNITS_IMPERIAL);
          setUnits(DEFAULT_UNITS_IMPERIAL);
        }
      }
    } catch (error) {
      console.error('[UnitsContext] Failed to update units:', error);
      setError('Ошибка обновления единиц измерения');
    }
  };

  const setUnitSystem = async (system: UnitSystem) => {
    console.log('[UnitsContext] Setting unit system to:', system);
    try {
      await AsyncStorage.setItem(UNITS_STORAGE_KEY, system);
      console.log('[UnitsContext] Saved unit system to AsyncStorage:', system);
      setUnitSystemState(system);
      console.log('[UnitsContext] Updated unit system state to:', system);
      
      // Обновляем систему единиц измерения в WeatherAlertService
      WeatherAlertService.updateUnitSystem(system);
      console.log('[UnitsContext] Updated unit system in WeatherAlertService');
      
      // Принудительно вызываем обновление единиц
      updateUnits();
      
      console.log('[UnitsContext] Unit system updated successfully');
    } catch (error) {
      console.error('[UnitsContext] Failed to save unit system preference:', error);
      setError('Не удалось сохранить настройки единиц измерения');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: UnitsContextType = {
    unitSystem,
    setUnitSystem,
    units,
    error,
    clearError,
    isInitialized: initialized
  };

  console.log('[UnitsContext] Rendering provider with unit system:', unitSystem, 'initialized:', initialized);
  return (
    <UnitsContext.Provider value={contextValue}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    console.error('[useUnits] Hook used outside of UnitsProvider!');
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}; 