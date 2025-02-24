import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '../hooks/useSettings';

interface AppContextType {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  followSystem: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ru' | 'en') => void;
  setFollowSystem: (followSystem: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const settings = useSettings();

  return (
    <AppContext.Provider value={settings}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 