import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { WeatherAlertService, WeatherAlert } from '../services/weatherAlertService';

interface WeatherAlertsProps {
  refreshTrigger: number;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ refreshTrigger }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const activeAlerts = WeatherAlertService.getActiveAlerts();
    setAlerts(activeAlerts);
  }, [refreshTrigger]);

  if (alerts.length === 0) {
    return null;
  }

  const handleAlertPress = (alert: WeatherAlert) => {
    Alert.alert(
      alert.title,
      alert.description,
      [{ text: translations.common.ok, onPress: () => console.log('Alert closed') }]
    );
  };

  const dismissAlert = (alertId: string) => {
    WeatherAlertService.dismissAlert(alertId);
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <TouchableOpacity 
        style={styles.headerContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Icon name="alert-circle" size={24} color={theme.colors.warning} />
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            {translations.common.error} ({alerts.length})
          </Text>
        </View>
        <Icon 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <ScrollView 
          style={styles.alertsContainer}
          showsVerticalScrollIndicator={false}
        >
          {alerts.map(alert => (
            <Animated.View 
              key={alert.id}
              entering={FadeIn.duration(300).delay(100)}
              style={[
                styles.alertItem, 
                { 
                  backgroundColor: theme.colors.cardBackground,
                  borderLeftColor: getAlertColor(alert.severity, theme)
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.alertContent}
                onPress={() => handleAlertPress(alert)}
              >
                <Icon 
                  name={getAlertIcon(alert.type)} 
                  size={24} 
                  color={getAlertColor(alert.severity, theme)} 
                />
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertTitle, { color: theme.colors.textPrimary }]}>
                    {alert.title}
                  </Text>
                  <Text style={[styles.alertDescription, { color: theme.colors.textSecondary }]}>
                    {alert.description}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dismissButton}
                onPress={() => dismissAlert(alert.id)}
              >
                <Icon name="close" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};

const getAlertIcon = (type: string): string => {
  switch (type) {
    case 'temperature':
      return 'thermometer';
    case 'wind':
      return 'weather-windy';
    case 'precipitation':
      return 'weather-pouring';
    case 'uv':
      return 'weather-sunny-alert';
    default:
      return 'alert-circle';
  }
};

const getAlertColor = (severity: 'low' | 'medium' | 'high', theme: any): string => {
  switch (severity) {
    case 'high':
      return theme.colors.error;
    case 'medium':
      return theme.colors.warning;
    case 'low':
      return theme.colors.info;
    default:
      return theme.colors.info;
  }
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  alertsContainer: {
    maxHeight: 300,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
  },
  dismissButton: {
    padding: 8,
  },
}); 