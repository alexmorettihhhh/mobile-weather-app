import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, View, StyleSheet, LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/context/AppContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { darkTheme, lightTheme } from './src/styles/theme';

// Игнорируем некоторые предупреждения, которые могут блокировать работу
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews'
]);

// Улучшенный глобальный обработчик ошибок
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Не логируем некоторые ошибки, которые часто вызывают проблемы
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      (args[0].includes('Sending') || 
       args[0].includes('Native') || 
       args[0].includes('Require cycle:'))
    ) {
      return;
    }
    originalConsoleError(...args);
    if (args[0] instanceof Error) {
      console.log('[App Error Details]:', args[0].message, args[0].stack);
    }
  };
}

// Типизированные интерфейсы для ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Компонент для перехвата ошибок в дереве компонентов
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log('[ErrorBoundary] Caught error:', error.message);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.log('[ErrorBoundary] Error details:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Что-то пошло не так</Text>
          <Text style={styles.errorText}>
            {this.state.error ? this.state.error.toString() : 'Неизвестная ошибка'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Основной компонент приложения
export default function App() {
  console.log('[App] Начало инициализации приложения');
  
  // Компонент с провайдерами, который гарантирует правильную вложенность
  const AppWithProviders = () => {
    console.log('[AppWithProviders] Настройка провайдеров');
    
    return (
      <AppProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AppProvider>
    );
  };
  
  // Компонент, который использует контексты - теперь определён ПОСЛЕ объявления AppWithProviders
  const AppContent = () => {
    console.log('[AppContent] Rendering AppContent component');
    const { theme: currentTheme, isInitialized: isAppInitialized } = useApp();
    const { isInitialized: isLanguageInitialized } = useLanguage();
    console.log('[AppContent] Initialization status - App:', isAppInitialized, 'Language:', isLanguageInitialized);
    
    const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
    
    // Показываем загрузочный экран, пока не инициализированы все провайдеры
    if (!isAppInitialized || !isLanguageInitialized) {
      console.log('[AppContent] Showing loading screen while providers initialize');
      return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ color: theme.colors.textPrimary, marginTop: 20 }}>
            Инициализация приложения...
          </Text>
        </View>
      );
    }
    
    console.log('[AppContent] Providers initialized, rendering main content');
    return (
      <NavigationContainer
        onStateChange={(state) => {
          console.log('[Navigation] State changed, current route:', 
            state?.routes[state.index]?.name || 'unknown');
        }}
        onReady={() => {
          console.log('[Navigation] Container is ready');
        }}
        fallback={
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.textPrimary }}>Загрузка навигации...</Text>
          </View>
        }
      >
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

  return (
    <ErrorBoundary>
      <AppWithProviders />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF1F1',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
}); 