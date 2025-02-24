import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { darkTheme, lightTheme } from './src/styles/theme';
import { checkEnv } from './src/utils/envCheck';
import { ru } from './src/localization/ru';
import { AppProvider } from './src/context/AppContext';
import { useApp } from './src/context/AppContext';
import { SplashScreen } from './src/screens/SplashScreen';

const AppContent = () => {
  const { theme: currentTheme } = useApp();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Initializing app...');
        await checkEnv();
        console.log('Environment check passed');
        setIsReady(true);
      } catch (err) {
        console.error('Environment configuration error:', err);
        setError(err instanceof Error ? err.message : ru.errors.apiError);
      }
    };

    initApp();
  }, []);

  if (showSplash && !error) {
    return (
      <SplashScreen onFinish={() => setShowSplash(false)} />
    );
  }

  if (!isReady && !error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size={42} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>{ru.common.loading}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
}); 