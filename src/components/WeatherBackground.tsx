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
    return hours >= 6 && hours < 20;
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
  
  // Запускаем анимации при изменении типа погоды
  useEffect(() => {
    // Анимация облаков для всех типов погоды кроме ясной
    if (weatherType !== 'sunny') {
      cloudPosition1.value = 0;
      cloudPosition2.value = width * 0.5;
      
      // Облака плавно плывут по экрану
      cloudPosition1.value = withRepeat(
        withTiming(-width, { duration: 60000, easing: Easing.linear }),
        -1,
        false
      );
      
      cloudPosition2.value = withRepeat(
        withTiming(-width * 1.5, { duration: 70000, easing: Easing.linear }),
        -1,
        false
      );
      
      // Пульсация облаков для эффекта объемности
      cloudOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 4000 }),
          withTiming(0.9, { duration: 4000 })
        ),
        -1,
        true
      );
    }
    
    // Анимации для дождя
    if (weatherType === 'rainy') {
      rainYPosition.value = 0;
      rainYPosition.value = withRepeat(
        withTiming(height, { duration: 1500, easing: Easing.linear }),
        -1,
        false
      );
    }
    
    // Анимации для снега
    if (weatherType === 'snowy') {
      snowYPosition.value = 0;
      snowRotation.value = 0;
      
      snowYPosition.value = withRepeat(
        withTiming(height, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
      
      snowRotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    }
    
    // Анимации для солнца
    if (weatherType === 'sunny' && isDay) {
      sunScale.value = 1;
      sunRotation.value = 0;
      
      sunScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 5000 }),
          withTiming(1, { duration: 5000 })
        ),
        -1,
        true
      );
      
      sunRotation.value = withRepeat(
        withTiming(360, { duration: 120000, easing: Easing.linear }),
        -1,
        false
      );
    }
    
    // Анимации для грозы
    if (weatherType === 'stormy') {
      const createLightningFlash = () => {
        lightningOpacity.value = withSequence(
          withTiming(0.9, { duration: 100 }),
          withTiming(0, { duration: 100 }),
          withDelay(
            Math.random() * 5000 + 2000, // Случайная задержка между молниями
            withTiming(0.7, { duration: 50 })
          ),
          withTiming(0, { duration: 150 })
        );
      };
      
      // Запускаем первую молнию
      createLightningFlash();
      
      // Запускаем интервал для случайных молний
      const lightningInterval = setInterval(createLightningFlash, 6000);
      
      return () => clearInterval(lightningInterval);
    }
  }, [weatherType, isDay]);
  
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
              // Солнце днем
              <Animated.View style={sunStyle}>
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                  <Circle 
                    cx={width * 0.3} 
                    cy={height * 0.15} 
                    r={40} 
                    fill="#FFF176" 
                  />
                  <Circle 
                    cx={width * 0.3} 
                    cy={height * 0.15} 
                    r={50} 
                    fill="rgba(255, 236, 95, 0.5)" 
                  />
                  {/* Лучи солнца */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Line 
                      key={i} 
                      x1={width * 0.3} 
                      y1={height * 0.15} 
                      x2={width * 0.3 + Math.cos(i * Math.PI / 6) * 70} 
                      y2={height * 0.15 + Math.sin(i * Math.PI / 6) * 70} 
                      stroke="rgba(255, 236, 95, 0.7)" 
                      strokeWidth={2} 
                    />
                  ))}
                </Svg>
              </Animated.View>
            ) : (
              // Звезды ночью
              <>
                {Array.from({ length: 50 }).map((_, i) => (
                  <Circle 
                    key={i} 
                    cx={Math.random() * width} 
                    cy={Math.random() * height * 0.7} 
                    r={Math.random() * 1.5 + 0.5} 
                    fill="#FFFFFF" 
                    opacity={Math.random() * 0.5 + 0.5} 
                  />
                ))}
                {/* Луна */}
                <Circle 
                  cx={width * 0.7} 
                  cy={height * 0.15} 
                  r={30} 
                  fill="#E6E6E6" 
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
                {/* Большое облако */}
                <Path 
                  d="M100,100 Q150,70 200,100 Q250,70 300,100 Q350,70 400,100 Q450,70 500,100 L500,150 Q450,180 400,150 Q350,180 300,150 Q250,180 200,150 Q150,180 100,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.7)"} 
                />
              </Svg>
            </Animated.View>
            <Animated.View style={cloud2Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {/* Маленькое облако */}
                <Path 
                  d="M250,200 Q300,170 350,200 Q400,170 450,200 L450,250 Q400,280 350,250 Q300,280 250,250 Z" 
                  fill={currentTheme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"} 
                />
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'rainy':
        return (
          <>
            {/* Облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M100,100 Q150,70 200,100 Q250,70 300,100 Q350,70 400,100 Q450,70 500,100 L500,150 Q450,180 400,150 Q350,180 300,150 Q250,180 200,150 Q150,180 100,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(180, 180, 180, 0.25)" : "rgba(220, 220, 220, 0.8)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Дождь */}
            <Animated.View style={rainStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <Line 
                    key={i}
                    x1={Math.random() * width} 
                    y1={Math.random() * height * 0.5} 
                    x2={Math.random() * width} 
                    y2={Math.random() * height * 0.5 + 20} 
                    stroke={currentTheme === 'dark' ? "rgba(200, 230, 255, 0.4)" : "rgba(120, 180, 255, 0.7)"} 
                    strokeWidth={1.5} 
                  />
                ))}
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'snowy':
        return (
          <>
            {/* Облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M100,100 Q150,70 200,100 Q250,70 300,100 Q350,70 400,100 Q450,70 500,100 L500,150 Q450,180 400,150 Q350,180 300,150 Q250,180 200,150 Q150,180 100,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(200, 200, 210, 0.25)" : "rgba(230, 230, 240, 0.8)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Снег */}
            <Animated.View style={snowStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <G key={i}>
                    <Circle 
                      cx={Math.random() * width} 
                      cy={Math.random() * height * 0.5} 
                      r={2} 
                      fill={currentTheme === 'dark' ? "rgba(220, 240, 255, 0.6)" : "rgba(255, 255, 255, 0.9)"} 
                    />
                    {/* Простая снежинка */}
                    <Line 
                      x1={Math.random() * width - 4} 
                      y1={Math.random() * height * 0.5} 
                      x2={Math.random() * width + 4} 
                      y2={Math.random() * height * 0.5} 
                      stroke={currentTheme === 'dark' ? "rgba(220, 240, 255, 0.5)" : "rgba(255, 255, 255, 0.8)"} 
                      strokeWidth={1} 
                    />
                    <Line 
                      x1={Math.random() * width} 
                      y1={Math.random() * height * 0.5 - 4} 
                      x2={Math.random() * width} 
                      y2={Math.random() * height * 0.5 + 4} 
                      stroke={currentTheme === 'dark' ? "rgba(220, 240, 255, 0.5)" : "rgba(255, 255, 255, 0.8)"} 
                      strokeWidth={1} 
                    />
                  </G>
                ))}
              </Svg>
            </Animated.View>
          </>
        );
      
      case 'stormy':
        return (
          <>
            {/* Темные облака */}
            <Animated.View style={cloud1Style}>
              <Svg width={width * 1.5} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M100,100 Q150,70 200,100 Q250,70 300,100 Q350,70 400,100 Q450,70 500,100 L500,150 Q450,180 400,150 Q350,180 300,150 Q250,180 200,150 Q150,180 100,150 Z" 
                  fill={currentTheme === 'dark' ? "rgba(90, 90, 110, 0.35)" : "rgba(120, 120, 140, 0.8)"} 
                />
              </Svg>
            </Animated.View>
            
            {/* Молния */}
            <Animated.View style={lightningStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                <Path 
                  d="M150,100 L120,200 L180,210 L140,300" 
                  stroke={currentTheme === 'dark' ? "rgba(255, 255, 200, 0.9)" : "rgba(255, 255, 0, 0.9)"} 
                  strokeWidth={3} 
                  fill="none" 
                />
                <Path 
                  d="M250,150 L220,250 L280,260 L240,350" 
                  stroke={currentTheme === 'dark' ? "rgba(255, 255, 200, 0.9)" : "rgba(255, 255, 0, 0.9)"} 
                  strokeWidth={3} 
                  fill="none" 
                />
              </Svg>
            </Animated.View>
            
            {/* Дождь */}
            <Animated.View style={rainStyle}>
              <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <Line 
                    key={i}
                    x1={Math.random() * width} 
                    y1={Math.random() * height * 0.5} 
                    x2={Math.random() * width - 5} // Наклонные капли для эффекта сильного дождя
                    y2={Math.random() * height * 0.5 + 30} 
                    stroke={currentTheme === 'dark' ? "rgba(180, 210, 255, 0.5)" : "rgba(100, 160, 255, 0.7)"} 
                    strokeWidth={2} 
                  />
                ))}
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