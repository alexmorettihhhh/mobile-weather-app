import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsSection } from '../components/SettingsSection';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';

export type RootStackParamList = {
  Weather: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

interface TabIconProps {
  color: string;
  size: number;
}

export const AppNavigator = () => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 0,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontSize: theme.typography.h2.fontSize,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Weather"
        component={HomeScreen}
        options={{
          title: 'Погода',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="weather-partly-cloudy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsSection}
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 