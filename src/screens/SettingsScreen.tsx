import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal, FlatList } from 'react-native';
import Animated, { 
  FadeIn,
  Layout,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { darkTheme, lightTheme } from '../styles/theme';

type Language = 'en' | 'ru' | 'es' | 'de';

export const SettingsScreen: React.FC = () => {
  const { theme: currentTheme, toggleTheme } = useApp();
  const { language, setLanguage, translations } = useLanguage();
  const { unitSystem, setUnitSystem } = useUnits();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);

  const renderSettingItem = (
    title: string,
    value: string,
    onPress: () => void,
    icon: string,
    index: number
  ) => (
    <Animated.View
      entering={SlideInRight.delay(index * 200)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
        onPress={onPress}
      >
        <View style={styles.settingLeft}>
          <Icon name={icon} size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
        </View>
        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
            {value}
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const getLanguageName = (lang: Language): string => {
    switch (lang) {
      case 'en': return 'English';
      case 'ru': return 'Русский';
      case 'es': return 'Español';
      case 'de': return 'Deutsch';
      default: return 'English';
    }
  };

  const getUnitSystemName = (): string => {
    const hasMetricLabel = translations.settings && 'metric' in translations.settings;
    const hasImperialLabel = translations.settings && 'imperial' in translations.settings;
    
    if (hasMetricLabel && hasImperialLabel) {
      return unitSystem === 'metric' 
        ? (translations.settings as any).metric 
        : (translations.settings as any).imperial;
    }
    
    return unitSystem === 'metric' ? 'Metric' : 'Imperial';
  };

  const renderLanguageModal = () => (
    <Modal
      visible={languageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
            {translations.settings.language}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              language === 'en' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              setLanguage('en');
              setLanguageModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>English</Text>
            {language === 'en' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              language === 'ru' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              setLanguage('ru');
              setLanguageModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>Русский</Text>
            {language === 'ru' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              language === 'es' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              setLanguage('es');
              setLanguageModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>Español</Text>
            {language === 'es' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              language === 'de' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              setLanguage('de');
              setLanguageModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>Deutsch</Text>
            {language === 'de' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setLanguageModalVisible(false)}
          >
            <Text style={{ color: '#fff' }}>{translations.common.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUnitsModal = () => (
    <Modal
      visible={unitsModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setUnitsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
            {'units' in translations.settings ? translations.settings.units as string : 'Units'}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              unitSystem === 'metric' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              console.log('Switching to metric units');
              setUnitSystem('metric');
              setUnitsModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>
              {'metric' in translations.settings ? translations.settings.metric as string : 'Metric'} (°C, km/h)
            </Text>
            {unitSystem === 'metric' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modalItem,
              unitSystem === 'imperial' && { backgroundColor: theme.colors.primaryLight }
            ]}
            onPress={() => {
              console.log('Switching to imperial units');
              setUnitSystem('imperial');
              setUnitsModalVisible(false);
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>
              {'imperial' in translations.settings ? translations.settings.imperial as string : 'Imperial'} (°F, mph)
            </Text>
            {unitSystem === 'imperial' && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setUnitsModalVisible(false)}
          >
            <Text style={{ color: '#fff' }}>{translations.common.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {renderSettingItem(
        translations.settings.theme,
        currentTheme === 'dark' ? translations.settings.dark : translations.settings.light,
        toggleTheme,
        'theme-light-dark',
        0
      )}
      
      {renderSettingItem(
        translations.settings.language,
        getLanguageName(language),
        () => setLanguageModalVisible(true),
        'translate',
        1
      )}
      
      {renderSettingItem(
        'units' in translations.settings ? translations.settings.units as string : 'Units',
        getUnitSystemName(),
        () => setUnitsModalVisible(true),
        'ruler',
        2
      )}
      
      {renderLanguageModal()}
      {renderUnitsModal()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
}); 