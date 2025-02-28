import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { SectionList, RefreshControl, StyleSheet, View, Text, Platform, ActivityIndicator } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut,
  Layout,
  SlideInUp
} from 'react-native-reanimated';
import { WeatherInfo } from '../components/WeatherInfo';
import { WeatherRecommendations } from '../components/WeatherRecommendations';
import { AstronomicalData } from '../components/AstronomicalData';
import { CitySearch } from '../components/CitySearch';
import { HourlyForecast } from '../components/HourlyForecast';
import { ExtendedWeatherInfo } from '../components/ExtendedWeatherInfo';
import { WeatherEducation } from '../components/WeatherEducation';
import { WeatherAlerts } from '../components/WeatherAlerts';
import { WeatherHistory } from '../components/WeatherHistory';
import { ActivityRecommendations } from '../components/ActivityRecommendations';
import { ShareWeather } from '../components/ShareWeather';
import { WeatherBackground } from '../components/WeatherBackground';
import { WeatherTimelapse } from '../components/WeatherTimelapse';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { WeatherAlertService } from '../services/weatherAlertService';
import { WeatherHistoryService } from '../services/weatherHistoryService';
import { LocationService, LocationStatus } from '../services/locationService';
import { LocationStatusIndicator } from '../components/LocationStatusIndicator';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export const HomeScreen: React.FC = () => {
  if (__DEV__) console.log('HomeScreen render started');
  
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const { weatherData, loading, refreshWeather, currentCity, setCity, error, isOffline } = useWeather();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>(LocationStatus.UNKNOWN);
  const [locationMessage, setLocationMessage] = useState<string | undefined>(undefined);
  
  const handleCitySelect = useCallback((city: string) => {
    console.log(`[HomeScreen] Город выбран: '${city}'`);
    
    if (!city || city.trim() === '') {
      console.warn('[HomeScreen] Пустое название города, игнорирую выбор');
      return;
    }
    
    // Проверка на изменение города
    if (city === currentCity) {
      console.log(`[HomeScreen] Город не изменился: ${city}`);
      return;
    }
    
    console.log(`[HomeScreen] Устанавливаю новый город: ${city}`);
    setCity(city);
  }, [currentCity, setCity]);
  
  // Используем useMemo для вычисления темы и проверки данных
  const theme = useMemo(() => 
    currentTheme === 'dark' ? darkTheme : lightTheme, 
    [currentTheme]
  );
  
  // Проверка целостности данных
  const isDataValid = useMemo(() => 
    !!weatherData && 
    !!weatherData.forecast && 
    !!weatherData.forecast.forecastday && 
    weatherData.forecast.forecastday.length > 0,
    [weatherData]
  );

  // Оптимизированный обработчик обновления
  const handleRefresh = useCallback(() => {
    if (__DEV__) console.log('Manually refreshing weather data');
    refreshWeather(true); // Принудительное обновление, пропуская кэш
  }, [refreshWeather]);

  // Функция для определения местоположения пользователя
  const detectUserLocation = useCallback(async () => {
    if (__DEV__) console.log('Detecting user location');
    
    try {
      setLocationStatus(LocationStatus.UNKNOWN);
      setLocationMessage('Determining your location...');
      
      const result = await LocationService.getCurrentLocation(false, true);
      setLocationStatus(result.status);
      setLocationMessage(result.message);
      
      if (result.location && result.status !== LocationStatus.ERROR) {
        const coords = {
          latitude: result.location.coords.latitude,
          longitude: result.location.coords.longitude
        };
        
        const cityName = await LocationService.getLocationName(coords);
        
        if (cityName) {
          handleCitySelect(cityName);
          if (result.status === LocationStatus.SUCCESS) {
            // Если успешно получили местоположение, скрываем индикатор через 3 секунды
            setTimeout(() => {
              if (locationStatus === LocationStatus.SUCCESS) {
                setLocationStatus(LocationStatus.UNKNOWN);
                setLocationMessage(undefined);
              }
            }, 3000);
          }
        } else {
          setLocationStatus(LocationStatus.ERROR);
          setLocationMessage('Could not determine city name from coordinates');
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setLocationStatus(LocationStatus.ERROR);
      setLocationMessage('Unexpected error detecting location');
    }
  }, [handleCitySelect, locationStatus]);

  // Инициализация компонента
  useEffect(() => {
    if (__DEV__) console.log('HomeScreen mounted');
    
    // Проверяем текущий статус местоположения
    const currentStatus = LocationService.getStatus();
    setLocationStatus(currentStatus);
    
    return () => {
      if (__DEV__) console.log('HomeScreen unmounted');
    };
  }, []);

  // Эффект обработки полученных данных о погоде
  useEffect(() => {
    if (weatherData && !loading) {
      if (__DEV__) {
        console.log('WeatherData received, location:', weatherData.location.name);
        console.log('Weather data structure valid:', isDataValid);
        if (weatherData.forecast) {
          console.log('Forecast days available:', weatherData.forecast.forecastday?.length || 0);
        } else {
          console.log('Forecast data is missing');
        }
      }
      
      // Активируем сервисы для обработки данных о погоде
      // Используем setTimeout, чтобы отложить выполнение и избежать блокировки интерфейса
      setTimeout(() => {
        if (isDataValid) {
          WeatherAlertService.checkForAlerts(weatherData);
          WeatherHistoryService.recordWeatherData(weatherData);
        }
      }, 100);
      
      // Избегаем обновления, если данные не изменились
      if (isDataValid) {
        setRefreshTrigger(prev => prev + 1);
      }
    }
  }, [weatherData, isDataValid, loading]);

  // Мемоизируем секции для оптимизации рендеринга
  const sections = useMemo(() => {
    if (__DEV__) console.log('Computing sections');
    
    const hourlyData = isDataValid && weatherData
      ? weatherData.forecast.forecastday[0].hour.filter(
          (_, index) => index % 2 === 0 || index > new Date().getHours()
        ).slice(0, 12)
      : [];
  
    return [
      {
        title: 'search',
        data: [{ type: 'search' }],
      },
      {
        title: 'current',
        data: [{ type: 'current' }],
      },
      {
        title: 'hourly',
        data: hourlyData.length > 0 ? [{ type: 'hourly', hourlyData }] : [],
      },
      {
        title: 'timelapse',
        data: [{ type: 'timelapse' }],
      },
      {
        title: 'extended',
        data: [{ type: 'extended' }],
      },
      {
        title: 'recommendations',
        data: [{ type: 'recommendations' }],
      },
      {
        title: 'astronomical',
        data: [{ type: 'astronomical' }],
      },
      {
        title: 'education',
        data: [{ type: 'education' }],
      },
      {
        title: 'share',
        data: [{ type: 'share' }],
      },
    ];
  }, [weatherData, isDataValid]);

  if (loading && !weatherData) {
    return (
      <View 
        style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary}
        />
      </View>
    );
  }

  if (!currentCity) {
    return (
      <View 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.welcomeContainer}>
          <Text 
            style={[styles.welcomeText, { color: theme.colors.textPrimary }]}
          >
            {translations.locations.searchPlaceholder}
          </Text>
          <CitySearch onCitySelect={handleCitySelect} />
          
          {/* Добавляем кнопку для определения местоположения */}
          <View style={styles.locationButtonContainer}>
            <Text 
              style={[styles.locationButtonText, { color: theme.colors.primary }]}
              onPress={detectUserLocation}
            >
              {translations.locations.detectLocation}
            </Text>
          </View>
          
          {/* Показываем индикатор статуса местоположения */}
          {locationStatus !== LocationStatus.UNKNOWN && (
            <LocationStatusIndicator 
              status={locationStatus}
              message={locationMessage}
              onRetry={detectUserLocation}
            />
          )}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View 
        style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
        <CitySearch onCitySelect={handleCitySelect} />
        
        {/* Добавляем кнопку для определения местоположения */}
        <View style={styles.locationButtonContainer}>
          <Text 
            style={[styles.locationButtonText, { color: theme.colors.primary }]}
            onPress={detectUserLocation}
          >
            {translations.locations.detectLocation}
          </Text>
        </View>
        
        {/* Показываем индикатор статуса местоположения */}
        {locationStatus !== LocationStatus.UNKNOWN && (
          <LocationStatusIndicator 
            status={locationStatus}
            message={locationMessage}
            onRetry={detectUserLocation}
          />
        )}
      </View>
    );
  }

  const renderItem = ({ item }: { item: { type: string } }) => {
    switch (item.type) {
      case 'search':
        return (
          <View style={styles.searchSection}>
            <CitySearch onCitySelect={handleCitySelect} />
            
            {/* Добавляем кнопку для определения местоположения */}
            <View style={styles.locationButtonContainer}>
              <Text 
                style={[styles.locationButtonText, { color: theme.colors.primary }]}
                onPress={detectUserLocation}
              >
                {translations.locations.detectLocation}
              </Text>
            </View>
            
            {/* Показываем индикатор статуса местоположения */}
            {locationStatus !== LocationStatus.UNKNOWN && (
              <LocationStatusIndicator 
                status={locationStatus}
                message={locationMessage}
                onRetry={detectUserLocation}
              />
            )}
          </View>
        );
      case 'current':
        return weatherData && 
          <Animated.View
            entering={FadeIn.delay(300)}
            layout={Layout}
            style={styles.weatherInfoSection}
          >
            <WeatherInfo 
              weatherData={weatherData} 
              city={weatherData.location.name} 
            />
          </Animated.View>;
      case 'hourly':
        // Типизируем item для hourly
        return isDataValid && weatherData && (item as any).hourlyData ? 
          <HourlyForecast hourlyData={(item as any).hourlyData} /> : null;
      case 'timelapse':
        // Новая секция для WeatherTimelapse
        return isDataValid && weatherData ? 
          <WeatherTimelapse weatherData={weatherData} /> : null;
      case 'extended':
        // Добавляем проверку на наличие данных прогноза
        return (isDataValid && weatherData) ? 
          <ExtendedWeatherInfo
            data={{
              uv: weatherData.current.uv,
              air_quality: weatherData.current.air_quality,
              wind_degree: weatherData.current.wind_degree,
              wind_dir: weatherData.current.wind_dir,
              precip_chance: weatherData.forecast.forecastday[0].day.daily_chance_of_rain || 0,
            }}
          /> : null;
      case 'recommendations':
        return weatherData && <WeatherRecommendations weatherData={weatherData} />;
      case 'astronomical':
        return <AstronomicalData city={currentCity} />;
      case 'education':
        return weatherData && <WeatherEducation weatherData={weatherData} />;
      case 'share':
        return weatherData && <ShareWeather weatherData={weatherData} />;
      default:
        return null;
    }
  };

  if (__DEV__) console.log('Rendering main screen with sections:', sections.length);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Анимированный фон, отображается только если у нас есть данные о погоде */}
      {isDataValid && weatherData && (
        <WeatherBackground weatherData={weatherData} opacity={0.5} />
      )}
      
      <SectionList
        style={styles.listContainer}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={() => null}
        keyExtractor={(item, index) => item.type + index}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  searchSection: {
    marginBottom: 10,
    zIndex: 5,
  },
  weatherInfoSection: {
    marginTop: 10,
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeContainer: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  locationButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
}); 