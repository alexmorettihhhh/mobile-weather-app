import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import Svg, { Path, Circle, G, Line, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { darkTheme, lightTheme } from '../styles/theme';
import type { WeatherData } from '../types/weather';

const { width, height } = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface WeatherBackgroundProps {
  weatherData: WeatherData;
  opacity?: number; // Позволяет контролировать прозрачность фона
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  weatherData, 
  opacity = 0.7 
}) => {
  const { theme: currentTheme } = useApp();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  
  const weatherType = useMemo(() => {
    const code = weatherData.current.condition.code;
    
    if (code === 1000) return 'sunny';
    
    if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) return 'cloudy';
    
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code))
      return 'rainy';
    
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code))
      return 'snowy';
    
    if ([1087, 1273, 1276, 1279, 1282].includes(code))
      return 'stormy';
    
    return 'cloudy';
  }, [weatherData]);
  
  const isDay = useMemo(() => {
    const hours = new Date().getHours();
    const isDayTime = __DEV__ ? false : (hours >= 6 && hours < 20);
    console.log('[WeatherBackground] Current hour:', hours, 'isDay:', isDayTime, 'DEV mode:', __DEV__, 'Release mode:', !__DEV__);
    return isDayTime;
  }, []);
  
  const cloudPosition1 = useSharedValue(0);
  const cloudPosition2 = useSharedValue(0);
  const cloudOpacity = useSharedValue(0.8);
  const rainYPosition = useSharedValue(0);
  const snowYPosition = useSharedValue(0);
  const snowRotation = useSharedValue(0);
  const sunScale = useSharedValue(1);
  const sunRotation = useSharedValue(0);
  const lightningOpacity = useSharedValue(0);
  const starPosition = useSharedValue(0);
  
  const createStarFallAnimation = () => {
    const starFallAnimation = withRepeat(
      withTiming(-height, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );

    starPosition.value = starFallAnimation;
  };
  
  useEffect(() => {
    console.log('[WeatherBackground] Starting animations for weather type:', weatherType, 'isDay:', isDay);
    
    cloudPosition1.value = 0;
    cloudPosition2.value = width * 0.5;
    cloudOpacity.value = 0.8;
    rainYPosition.value = 0;
    snowYPosition.value = 0;
    snowRotation.value = 0;
    sunScale.value = 1;
    sunRotation.value = 0;
    lightningOpacity.value = 0;
    starPosition.value = 0;
    
    setTimeout(() => {
      // Анимация облаков для всех типов погоды кроме ясной
      if (weatherType !== 'sunny') {
        // Облака плавно плывут по экрану с разной скоростью для создания эффекта глубины
        cloudPosition1.value = withRepeat(
          withTiming(-width, { duration: 120000, easing: Easing.linear }),
          -1,
          false
        );
        
        cloudPosition2.value = withRepeat(
          withTiming(-width * 1.5, { duration: 150000, easing: Easing.linear }),
          -1,
          false
        );
        
        // Более плавная пульсация облаков
        cloudOpacity.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.9, { duration: 8000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }
      
      // Анимации для дождя - более естественное падение
      if (weatherType === 'rainy') {
        rainYPosition.value = withRepeat(
          withTiming(height, { duration: 2000, easing: Easing.linear }),
          -1,
          false
        );
      }
      
      // Анимации для снега - более плавное падение и вращение
      if (weatherType === 'snowy') {
        snowYPosition.value = withRepeat(
          withTiming(height, { duration: 12000, easing: Easing.linear }),
          -1,
          false
        );
        
        snowRotation.value = withRepeat(
          withTiming(360, { duration: 10000, easing: Easing.linear }),
          -1,
          false
        );
      }
      
      // Анимации для солнца - более плавное пульсирование и медленное вращение
      if (weatherType === 'sunny' && isDay) {
        sunScale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        
        sunRotation.value = withRepeat(
          withTiming(360, { duration: 240000, easing: Easing.linear }),
          -1,
          false
        );
      }
      
      // Анимации для грозы - более реалистичные вспышки молний
      if (weatherType === 'stormy') {
        const createLightningFlash = () => {
          lightningOpacity.value = withSequence(
            withTiming(0.9, { duration: 50 }),
            withTiming(0.3, { duration: 50 }),
            withTiming(0.7, { duration: 50 }),
            withTiming(0, { duration: 200 }),
            withDelay(
              Math.random() * 8000 + 3000, // Более случайная задержка между молниями
              withTiming(0, { duration: 0 })
            )
          );
        };
        
        // Запускаем первую молнию
        createLightningFlash();
        
        // Запускаем интервал для случайных молний
        const lightningInterval = setInterval(createLightningFlash, 8000);
        
        return () => clearInterval(lightningInterval);
      }

      // Запускаем анимацию падения звезд
      createStarFallAnimation();
    }, 100);
    
    // Очистка анимаций при размонтировании компонента
    return () => {
      console.log('[WeatherBackground] Cleaning up animations');
      // Здесь можно добавить дополнительную логику очистки, если необходимо
    };
  }, [weatherType, isDay, width, height]);
  
  // Анимированные стили
  const cloud1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudPosition1.value }],
    opacity: cloudOpacity.value,
  }));
  
  const cloud2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudPosition2.value }],
    opacity: cloudOpacity.value * 0.8,
  }));
  
  const rainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rainYPosition.value }],
  }));
  
  const snowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: snowYPosition.value },
      { rotate: `${snowRotation.value}deg` }
    ],
  }));
  
  const sunStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sunScale.value },
      { rotate: `${sunRotation.value}deg` }
    ],
  }));
  
  const lightningStyle = useAnimatedStyle(() => ({
    opacity: lightningOpacity.value,
  }));
  
  // Получение фонового градиента в зависимости от погоды и времени суток
  const getBackgroundGradient = () => {
    if (isDay) {
      if (weatherType === 'sunny') return ['#4DBBFF', '#3690EA']; // Ясно днем
      if (weatherType === 'cloudy') return ['#62C2FF', '#4A9BE0']; // Облачно днем
      if (weatherType === 'rainy') return ['#5E9DD8', '#4581B5']; // Дождь днем
      if (weatherType === 'snowy') return ['#9EBBD2', '#7E9AB0']; // Снег днем
      if (weatherType === 'stormy') return ['#6E8CAC', '#556A89']; // Гроза днем
    } else {
      if (weatherType === 'sunny') return ['#0A1929', '#162F4A']; // Ясно ночью
      if (weatherType === 'cloudy') return ['#0D2136', '#183958']; // Облачно ночью
      if (weatherType === 'rainy') return ['#0C1C2E', '#152C4A']; // Дождь ночью
      if (weatherType === 'snowy') return ['#0E1E2F', '#1B334D']; // Снег ночью
      if (weatherType === 'stormy') return ['#0A1521', '#162538']; // Гроза ночью
    }
    
    // Если по какой-то причине не сработало ни одно условие
    return currentTheme === 'dark' ? ['#0A1929', '#162F4A'] : ['#4DBBFF', '#3690EA'];
  };
  
  // Рендеринг компонентов погоды
  const renderWeatherEffects = () => {
    switch (weatherType) {
      case 'sunny':
        return (
          <AnimatedSvg 
            width={width} 
            height={height} 
            style={[StyleSheet.absoluteFill, { opacity }]}
          >
            {isDay ? (
              // Солнце днем - улучшенная версия
              <Animated.View style={sunStyle}>
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                  {/* Внешнее свечение */}
                  <Circle 
                    cx={width * 0.3} 
                    cy={height * 0.15} 
                    r={60} 
                    fill="rgba(255, 235, 59, 0.2)" 
                  />
                  {/* Среднее свечение */}
                  <Circle 
                    cx={width * 0.3} 
                    cy={height * 0.15} 
                    r={50} 
                    fill="rgba(255, 235, 59, 0.4)" 
                  />
                  {/* Основной круг солнца */}
                  <Circle 
                    cx={width * 0.3} 
                    cy={height * 0.15} 
                    r={40} 
                    fill="#FFEB3B" 
                  />
                  {/* Лучи солнца - более естественные */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Line 
                      key={i} 
                      x1={width * 0.3} 
                      y1={height * 0.15} 
                      x2={width * 0.3 + Math.cos(i * Math.PI / 6) * 70} 
                      y2={height * 0.15 + Math.sin(i * Math.PI / 6) * 70} 
                      stroke="rgba(255, 235, 59, 0.5)" 
                      strokeWidth={3} 
                      strokeLinecap="round"
                    />
                  ))}
                </Svg>
              </Animated.View>
            ) : (
              // Звезды ночью - улучшенная версия
              <>
                {/* Более разнообразные звезды */}
                {Array.from({ length: 80 }).map((_, i) => {
                  const size = Math.random() * 1.5 + 0.5;
                  const opacity = Math.random() * 0.5 + 0.5;
                  return (
                    <Circle 
                      key={i} 
                      cx={Math.random() * width} 
                      cy={Math.random() * height * 0.7} 
                      r={size} 
                      fill="#FFFFFF" 
                      opacity={opacity} 
                    />
                  );
                })}
                {/* Луна с кратерами */}
                <Circle 
                  cx={width * 0.7} 
                  cy={height * 0.15} 
                  r={35} 
                  fill="#E6E6E6" 
                />
                <Circle 
                  cx={width * 0.7 - 10} 
                  cy={height * 0.15 - 5} 
                  r={5} 
                  fill="#D9D9D9" 
                />
                <Circle 
                  cx={width * 0.7 + 8} 
                  cy={height * 0.15 + 10} 
                  r={7} 
                  fill="#D9D9D9" 
                />
                <Circle 
                  cx={width * 0.7 + 15} 
                  cy={height * 0.15 - 8} 
                  r={4} 
                  fill="#D9D9D9" 
                />
              </>
            )}
          </AnimatedSvg>
        );
      
      case 'cloudy':
        return (
          <>
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {/* Улучшенное большое облако */}
                <Path 
                  d="M50,100 Q100,60 150,80 Q200,50 250,80 Q300,60 350,80 Q400,50 450,80 Q500,60 550,100 L550,150 Q500,180 450,160 Q400,190 350,160 Q300,190 250,160 Q200,190 150,160 Q100,180 50,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.8)"} 
                />
              </Svg>
            </Animated.View>
            <Animated.View style={cloud2Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {/* Улучшенное маленькое облако */}
                <Path 
                  d="M200,180 Q250,150 300,170 Q350,140 400,170 Q450,150 500,180 L500,230 Q450,260 400,240 Q350,270 300,240 Q250,260 200,230 Z" 
                  fill={currentTheme === 'dark' ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.6)"} 
                />
              </Svg>
            </Animated.View>
            {/* Дополнительное облако для объема */}
            <Animated.View style={[cloud1Style, { transform: [{ translateX: -width * 0.3 }] }]}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity: opacity * 0.7 }]}>
                <Path 
                  d="M300,140 Q350,110 400,130 Q450,100 500,130 Q550,110 600,140 L600,190 Q550,220 500,200 Q450,230 400,200 Q350,220 300,190 Z" 
                  fill={currentTheme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"} 
                />
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'rainy':
        return (
          <>
            {/* Улучшенные облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M50,100 Q100,60 150,80 Q200,50 250,80 Q300,60 350,80 Q400,50 450,80 Q500,60 550,100 L550,150 Q500,180 450,160 Q400,190 350,160 Q300,190 250,160 Q200,190 150,160 Q100,180 50,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(180, 180, 180, 0.3)" : "rgba(220, 220, 220, 0.9)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Улучшенный дождь - более естественные капли */}
            <Animated.View style={rainStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 60 }).map((_, i) => {
                  const x = Math.random() * width;
                  const y = Math.random() * height * 0.5;
                  const length = Math.random() * 15 + 10; // Разная длина капель
                  const angle = Math.PI / 12; // Небольшой наклон для реалистичности
                  return (
                    <Line 
                      key={i}
                      x1={x} 
                      y1={y} 
                      x2={x - Math.sin(angle) * length} 
                      y2={y + Math.cos(angle) * length} 
                      stroke={currentTheme === 'dark' ? "rgba(200, 230, 255, 0.5)" : "rgba(120, 180, 255, 0.7)"} 
                      strokeWidth={1.5} 
                      strokeLinecap="round"
                    />
                  );
                })}
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'snowy':
        return (
          <>
            {/* Улучшенные облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M50,100 Q100,60 150,80 Q200,50 250,80 Q300,60 350,80 Q400,50 450,80 Q500,60 550,100 L550,150 Q500,180 450,160 Q400,190 350,160 Q300,190 250,160 Q200,190 150,160 Q100,180 50,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(200, 200, 210, 0.3)" : "rgba(230, 230, 240, 0.9)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Улучшенный снег - более красивые снежинки */}
            <Animated.View style={snowStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 40 }).map((_, i) => {
                  const x = Math.random() * width;
                  const y = Math.random() * height * 0.5;
                  const size = Math.random() * 3 + 2;
                  return (
                    <G key={i}>
                      {/* Центр снежинки */}
                      <Circle 
                        cx={x} 
                        cy={y} 
                        r={size} 
                        fill={currentTheme === 'dark' ? "rgba(220, 240, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"} 
                      />
                      {/* Лучи снежинки */}
                      {Array.from({ length: 6 }).map((_, j) => (
                        <Line 
                          key={j}
                          x1={x} 
                          y1={y} 
                          x2={x + Math.cos(j * Math.PI / 3) * size * 2} 
                          y2={y + Math.sin(j * Math.PI / 3) * size * 2} 
                          stroke={currentTheme === 'dark' ? "rgba(220, 240, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"} 
                          strokeWidth={1} 
                        />
                      ))}
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'stormy':
        return (
          <>
            {/* Улучшенные темные облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M50,100 Q100,60 150,80 Q200,50 250,80 Q300,60 350,80 Q400,50 450,80 Q500,60 550,100 L550,150 Q500,180 450,160 Q400,190 350,160 Q300,190 250,160 Q200,190 150,160 Q100,180 50,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(90, 90, 110, 0.4)" : "rgba(120, 120, 140, 0.9)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Улучшенная молния */}
            <Animated.View style={lightningStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {/* Первая молния */}
                <Path 
                  d="M150,100 L130,180 L160,190 L140,280 L170,290 L130,380" 
                  stroke={currentTheme === 'dark' ? "rgba(255, 255, 200, 0.9)" : "rgba(255, 255, 0, 0.9)"} 
                  strokeWidth={3} 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Вторая молния */}
                <Path 
                  d="M250,120 L230,200 L260,210 L240,300 L270,310 L230,400" 
                  stroke={currentTheme === 'dark' ? "rgba(255, 255, 200, 0.9)" : "rgba(255, 255, 0, 0.9)"} 
                  strokeWidth={3} 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Свечение вокруг молнии */}
                <Path 
                  d="M150,100 L130,180 L160,190 L140,280 L170,290 L130,380" 
                  stroke={currentTheme === 'dark' ? "rgba(255, 255, 200, 0.5)" : "rgba(255, 255, 0, 0.5)"} 
                  strokeWidth={8} 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
            
            {/* Улучшенный дождь - более интенсивный */}
            <Animated.View style={rainStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 70 }).map((_, i) => {
                  const x = Math.random() * width;
                  const y = Math.random() * height * 0.5;
                  const length = Math.random() * 20 + 15; // Более длинные капли для шторма
                  const angle = Math.PI / 8; // Больший наклон для эффекта сильного ветра
                  return (
                    <Line 
                      key={i}
                      x1={x} 
                      y1={y} 
                      x2={x - Math.sin(angle) * length} 
                      y2={y + Math.cos(angle) * length} 
                      stroke={currentTheme === 'dark' ? "rgba(180, 210, 255, 0.6)" : "rgba(100, 160, 255, 0.8)"} 
                      strokeWidth={2} 
                      strokeLinecap="round"
                    />
                  );
                })}
              </Svg>
            </Animated.View>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getBackgroundGradient() as [string, string]}
        style={[StyleSheet.absoluteFill, { opacity }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {renderWeatherEffects()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
}); 