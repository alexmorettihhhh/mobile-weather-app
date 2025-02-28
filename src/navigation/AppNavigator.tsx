import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoriteCitiesScreen } from '../screens/FavoriteCitiesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import Animated, { 
  FadeIn, 
  FadeOut
} from 'react-native-reanimated';
import { Translations } from '../types/translations';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  // Type assertion to make TypeScript recognize the common.weather property
  const trans = translations as Translations;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingHorizontal: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.textPrimary,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: trans.common.weather,
          tabBarIcon: ({ color, size }) => (
            <Icon name="weather-partly-cloudy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoriteCitiesScreen}
        options={{
          title: trans.locations.favorites,
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: trans.common.settings,
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 