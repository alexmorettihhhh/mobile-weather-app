import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { LocationStatus } from '../services/locationService';
import { Translations } from '../types/translations';

interface LocationStatusIndicatorProps {
  status: LocationStatus;
  message?: string;
  onRetry?: () => void;
}

export const LocationStatusIndicator: React.FC<LocationStatusIndicatorProps> = ({
  status,
  message,
  onRetry
}) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const trans = translations as Translations;

  const getStatusInfo = () => {
    switch (status) {
      case LocationStatus.SUCCESS:
        return {
          icon: 'map-marker-check',
          color: theme.colors.success,
          text: trans.location?.success || 'Location found'
        };
      case LocationStatus.CACHED:
        return {
          icon: 'map-marker-check-outline',
          color: theme.colors.warning,
          text: trans.location?.cached || 'Using cached location'
        };
      case LocationStatus.PERMISSION_DENIED:
        return {
          icon: 'map-marker-off',
          color: theme.colors.error,
          text: trans.location?.permissionDenied || 'Location permission denied'
        };
      case LocationStatus.LOCATION_DISABLED:
        return {
          icon: 'map-marker-off',
          color: theme.colors.error,
          text: trans.location?.disabled || 'Location services disabled'
        };
      case LocationStatus.NO_INTERNET:
        return {
          icon: 'wifi-off',
          color: theme.colors.error,
          text: trans.location?.noInternet || 'No internet connection'
        };
      case LocationStatus.TIMEOUT:
        return {
          icon: 'timer-sand-empty',
          color: theme.colors.warning,
          text: trans.location?.timeout || 'Location request timed out'
        };
      case LocationStatus.ERROR:
        return {
          icon: 'alert-circle',
          color: theme.colors.error,
          text: trans.location?.error || 'Error getting location'
        };
      case LocationStatus.UNKNOWN:
      default:
        return {
          icon: 'help-circle',
          color: theme.colors.textSecondary,
          text: trans.location?.unknown || 'Location status unknown'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (status === LocationStatus.SUCCESS && !message) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <Icon name={statusInfo.icon} size={24} color={statusInfo.color} />
        <View style={styles.textContainer}>
          <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
            {statusInfo.text}
          </Text>
          {message && (
            <Text style={[styles.messageText, { color: theme.colors.textSecondary }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
      
      {onRetry && (status === LocationStatus.ERROR || status === LocationStatus.TIMEOUT) && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: theme.colors.onPrimary }]}>
            {translations.common.retry}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 12,
    marginTop: 2,
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 