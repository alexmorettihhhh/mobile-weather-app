import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { darkTheme, lightTheme } from '../styles/theme';
import { WeatherData } from '../types/weather';

interface ActivityRecommendationsProps {
  weatherData: WeatherData;
}

interface Activity {
  name: string;
  icon: string;
  suitable: boolean;
  reason: string;
}

export const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({ weatherData }) => {
  const { theme: currentTheme } = useApp();
  const { translations } = useLanguage();
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;
  const [isExpanded, setIsExpanded] = useState(false);

  const getActivities = (): Activity[] => {
    const condition = weatherData.current.condition.text.toLowerCase();
    const temp = weatherData.current.temp_c;
    const windSpeed = weatherData.current.wind_kph;
    const humidity = weatherData.current.humidity;
    const isRaining = condition.includes('rain') || condition.includes('drizzle');
    const isSnowing = condition.includes('snow') || condition.includes('sleet');
    const isClear = condition.includes('clear') || condition.includes('sunny');
    const isCloudy = condition.includes('cloud') || condition.includes('overcast');
    const isStormy = condition.includes('thunder') || condition.includes('storm');
    const isFoggy = condition.includes('fog') || condition.includes('mist');
    const isWindy = windSpeed > 20;
    const isHot = temp > 30;
    const isCold = temp < 5;
    const isComfortable = temp >= 15 && temp <= 25 && humidity < 70;

    const activities: Activity[] = [
      {
        name: 'Пробежка',
        icon: 'run',
        suitable: !isRaining && !isSnowing && !isHot && !isStormy && windSpeed < 30,
        reason: isRaining ? 'Идёт дождь' : 
                isSnowing ? 'Идёт снег' : 
                isHot ? 'Слишком жарко' : 
                isStormy ? 'Грозовая активность' : 
                windSpeed >= 30 ? 'Сильный ветер' : 
                'Хорошие условия для пробежки'
      },
      {
        name: 'Велосипед',
        icon: 'bike',
        suitable: !isRaining && !isSnowing && !isStormy && windSpeed < 25 && !isFoggy && temp > 5,
        reason: isRaining ? 'Идёт дождь' : 
                isSnowing ? 'Скользкая дорога' : 
                isStormy ? 'Опасно при грозе' : 
                windSpeed >= 25 ? 'Сильный ветер' : 
                isFoggy ? 'Плохая видимость' :
                temp <= 5 ? 'Слишком холодно' :
                'Хорошие условия для велосипедной прогулки'
      },
      {
        name: 'Пикник',
        icon: 'food-apple',
        suitable: !isRaining && !isSnowing && !isStormy && !isHot && !isCold && windSpeed < 20,
        reason: isRaining ? 'Идёт дождь' : 
                isSnowing ? 'Идёт снег' : 
                isStormy ? 'Грозовая активность' : 
                isHot ? 'Слишком жарко' : 
                isCold ? 'Слишком холодно' : 
                windSpeed >= 20 ? 'Ветрено' : 
                'Отличный день для пикника'
      },
      {
        name: 'Плавание',
        icon: 'swim',
        suitable: (isClear || isCloudy) && temp > 25 && !isWindy && !isRaining && !isStormy,
        reason: !isClear && !isCloudy ? 'Неблагоприятная погода' : 
                temp <= 25 ? 'Недостаточно тепло' : 
                isWindy ? 'Ветрено и волны' : 
                isRaining ? 'Идёт дождь' : 
                isStormy ? 'Опасно при грозе' : 
                'Отличный день для плавания'
      },
      {
        name: 'Поход',
        icon: 'hiking',
        suitable: !isRaining && !isSnowing && !isStormy && !isHot && !isFoggy,
        reason: isRaining ? 'Идёт дождь' : 
                isSnowing ? 'Идёт снег' : 
                isStormy ? 'Грозовая активность' : 
                isHot ? 'Слишком жарко для длительной активности' : 
                isFoggy ? 'Ограниченная видимость' : 
                'Хорошие условия для похода'
      },
      {
        name: 'Барбекю',
        icon: 'grill',
        suitable: !isRaining && !isSnowing && !isStormy && windSpeed < 15,
        reason: isRaining ? 'Идёт дождь' : 
                isSnowing ? 'Идёт снег' : 
                isStormy ? 'Грозовая активность' : 
                windSpeed >= 15 ? 'Слишком ветрено для огня' : 
                'Подходящие условия для барбекю'
      },
      {
        name: 'Фотография',
        icon: 'camera',
        suitable: true,  // Всегда можно найти что-то интересное для фото
        reason: isRaining ? 'Можно сделать атмосферные фото дождя' : 
                isSnowing ? 'Снежные пейзажи выглядят впечатляюще' : 
                isClear ? 'Яркое освещение, отличная видимость' : 
                isFoggy ? 'Загадочные туманные фотографии' : 
                'Хорошие условия для фотосъемки'
      },
      {
        name: 'Медитация',
        icon: 'meditation',
        suitable: isComfortable || isClear || (isCloudy && !isWindy && !isRaining && !isSnowing && !isStormy),
        reason: !isComfortable ? 'Некомфортная температура или влажность' : 
                !isClear && !isCloudy ? 'Неблагоприятная погода' : 
                isWindy ? 'Ветрено и шумно' : 
                isRaining || isSnowing ? 'Осадки могут отвлекать' : 
                isStormy ? 'Гроза может беспокоить' : 
                'Спокойная погода, идеально для медитации'
      },
      {
        name: 'Садоводство',
        icon: 'flower',
        suitable: !isRaining && !isSnowing && !isStormy && !isCold && !isHot && windSpeed < 20,
        reason: isRaining ? 'Мокрая почва не подходит для работ' : 
                isSnowing ? 'Замерзшая почва' : 
                isStormy ? 'Опасно при грозе' : 
                isCold ? 'Холодно для растений и садовода' : 
                isHot ? 'Жарко для работы в саду' : 
                windSpeed >= 20 ? 'Сильный ветер может повредить растения' : 
                'Идеальный день для работы в саду'
      },
      {
        name: 'Парусный спорт',
        icon: 'sail-boat',
        suitable: !isRaining && !isSnowing && !isStormy && windSpeed > 5 && windSpeed < 40,
        reason: isRaining ? 'Дождь ухудшает видимость' : 
                isSnowing ? 'Замерзшая вода и снег' : 
                isStormy ? 'Опасно при грозе' : 
                windSpeed <= 5 ? 'Недостаточно ветра' : 
                windSpeed >= 40 ? 'Слишком сильный ветер, опасно' : 
                'Хороший ветер для парусного спорта'
      }
    ];

    return activities;
  };

  const activities = getActivities();
  const suitableActivities = activities.filter(activity => activity.suitable);
  const unsuitable = activities.filter(activity => !activity.suitable);

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
    >
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {translations.activities?.title || 'Рекомендуемые активности'}
        </Text>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {translations.activities?.subtitle || 'На основе текущей погоды'}
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.activitiesScrollView}
          >
            {suitableActivities.map((activity, index) => (
              <View 
                key={index} 
                style={[
                  styles.activityCard, 
                  { backgroundColor: theme.colors.backgroundSecondary }
                ]}
              >
                <Icon 
                  name={activity.icon} 
                  size={36} 
                  color={theme.colors.success} 
                  style={styles.activityIcon}
                />
                <Text style={[styles.activityName, { color: theme.colors.textPrimary }]}>
                  {activity.name}
                </Text>
                <Text style={[styles.reasonText, { color: theme.colors.success }]}>
                  {activity.reason}
                </Text>
              </View>
            ))}
          </ScrollView>

          <Text style={[styles.notRecommendedTitle, { color: theme.colors.textSecondary }]}>
            {translations.activities?.notRecommended || 'Не рекомендуется'}
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.activitiesScrollView}
          >
            {unsuitable.map((activity, index) => (
              <View 
                key={index} 
                style={[
                  styles.activityCard, 
                  { backgroundColor: theme.colors.backgroundSecondary }
                ]}
              >
                <Icon 
                  name={activity.icon} 
                  size={36} 
                  color={theme.colors.error} 
                  style={styles.activityIcon}
                />
                <Text style={[styles.activityName, { color: theme.colors.textPrimary }]}>
                  {activity.name}
                </Text>
                <Text style={[styles.reasonText, { color: theme.colors.error }]}>
                  {activity.reason}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  activitiesScrollView: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  activityCard: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    width: 140,
  },
  activityIcon: {
    marginBottom: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12,
    textAlign: 'center',
  },
  notRecommendedTitle: {
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
}); 