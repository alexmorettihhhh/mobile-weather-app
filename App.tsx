import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { useApp } from './src/context/AppContext';
import { darkTheme, lightTheme } from './src/styles/theme';

const AppContent = () => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar 
          barStyle={currentTheme === 'dark' ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
        <AppNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AppProvider>
  );
} 