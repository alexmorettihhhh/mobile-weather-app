import { WeatherData } from '../types/weather';

export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Activity {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  suitability: number; // От 0 до 100
  conditions: {
    minTemp?: number;
    maxTemp?: number;
    maxWind?: number;
    maxPrecip?: number;
    isNight?: boolean;
    conditions?: number[]; // Коды погодных условий
  };
}

export class ActivityRecommendationService {
  static CATEGORIES: ActivityCategory[] = [
    { id: 'outdoor', name: 'Активности на свежем воздухе', icon: 'hiking' },
    { id: 'sports', name: 'Спорт', icon: 'basketball' },
    { id: 'indoor', name: 'Дома', icon: 'home' },
    { id: 'beach', name: 'Пляж и водные активности', icon: 'beach' },
  ];

  static ACTIVITIES: Activity[] = [
    {
      id: 'hiking',
      categoryId: 'outdoor',
      name: 'Пешие прогулки',
      description: 'Идеальная погода для прогулок по паркам и лесам. Наслаждайтесь свежим воздухом!',
      icon: 'hiking',
      suitability: 0,
      conditions: {
        minTemp: 10,
        maxTemp: 30,
        maxWind: 20,
        maxPrecip: 1,
        isNight: false,
        conditions: [1000, 1003, 1006],
      },
    },
    {
      id: 'cycling',
      categoryId: 'outdoor',
      name: 'Велосипедная прогулка',
      description: 'Оптимальные условия для велопрогулки. Не забудьте взять воду!',
      icon: 'bike',
      suitability: 0,
      conditions: {
        minTemp: 12,
        maxTemp: 28,
        maxWind: 15,
        maxPrecip: 0.5,
        isNight: false,
        conditions: [1000, 1003],
      },
    },
    {
      id: 'picnic',
      categoryId: 'outdoor',
      name: 'Пикник',
      description: 'Идеальная погода для пикника. Возьмите с собой плед и корзину с едой!',
      icon: 'food-apple',
      suitability: 0,
      conditions: {
        minTemp: 18,
        maxTemp: 30,
        maxWind: 10,
        maxPrecip: 0,
        isNight: false,
        conditions: [1000, 1003],
      },
    },
    {
      id: 'basketball',
      categoryId: 'sports',
      name: 'Баскетбол',
      description: 'Хорошая погода для игры в баскетбол на открытой площадке.',
      icon: 'basketball',
      suitability: 0,
      conditions: {
        minTemp: 15,
        maxTemp: 32,
        maxWind: 12,
        maxPrecip: 0,
        isNight: false,
        conditions: [1000, 1003, 1006],
      },
    },
    {
      id: 'football',
      categoryId: 'sports',
      name: 'Футбол',
      description: 'Отличные условия для футбольного матча с друзьями.',
      icon: 'soccer',
      suitability: 0,
      conditions: {
        minTemp: 10,
        maxTemp: 28,
        maxWind: 15,
        maxPrecip: 0.5,
        isNight: false,
        conditions: [1000, 1003, 1006, 1009],
      },
    },
    {
      id: 'running',
      categoryId: 'sports',
      name: 'Бег',
      description: 'Идеальная температура для пробежки. Не забудьте взять воду!',
      icon: 'run',
      suitability: 0,
      conditions: {
        minTemp: 5,
        maxTemp: 25,
        maxWind: 20,
        maxPrecip: 1,
        conditions: [1000, 1003, 1006, 1009],
      },
    },
    {
      id: 'reading',
      categoryId: 'indoor',
      name: 'Чтение книги',
      description: 'Прекрасное время, чтобы насладиться хорошей книгой дома.',
      icon: 'book-open-variant',
      suitability: 0,
      conditions: {
        minTemp: -50, // Нет ограничений
        maxTemp: 50,  // Нет ограничений
      },
    },
    {
      id: 'cooking',
      categoryId: 'indoor',
      name: 'Готовка',
      description: 'Идеальный день, чтобы приготовить что-то вкусное дома.',
      icon: 'chef-hat',
      suitability: 0,
      conditions: {
        minTemp: -50, // Нет ограничений
        maxTemp: 50,  // Нет ограничений
      },
    },
    {
      id: 'movie',
      categoryId: 'indoor',
      name: 'Просмотр фильма',
      description: 'Отличный день для марафона фильмов или сериалов.',
      icon: 'movie',
      suitability: 0,
      conditions: {
        minTemp: -50, // Нет ограничений
        maxTemp: 50,  // Нет ограничений
      },
    },
    {
      id: 'swimming',
      categoryId: 'beach',
      name: 'Плавание',
      description: 'Идеальная погода для посещения пляжа и плавания.',
      icon: 'swim',
      suitability: 0,
      conditions: {
        minTemp: 25,
        maxTemp: 40,
        maxWind: 15,
        maxPrecip: 0,
        isNight: false,
        conditions: [1000, 1003],
      },
    },
    {
      id: 'sunbathing',
      categoryId: 'beach',
      name: 'Принятие солнечных ванн',
      description: 'Идеальная погода для загара. Не забудьте солнцезащитный крем!',
      icon: 'white-balance-sunny',
      suitability: 0,
      conditions: {
        minTemp: 26,
        maxTemp: 40,
        maxWind: 10,
        maxPrecip: 0,
        isNight: false,
        conditions: [1000],
      },
    },
  ];

  static getRecommendedActivities(weatherData: WeatherData): Activity[] {
    if (!weatherData) return [];
    
    const current = weatherData.current;
    const isNight = this.isNightTime(weatherData);
    
    // Копируем активности для расчета пригодности
    const activities = JSON.parse(JSON.stringify(this.ACTIVITIES)) as Activity[];
    
    // Рассчитываем пригодность для каждой активности
    activities.forEach(activity => {
      let suitability = 100;
      const conditions = activity.conditions;
      
      // Проверяем температуру
      if (conditions.minTemp !== undefined && current.temp_c < conditions.minTemp) {
        const tempDiff = conditions.minTemp - current.temp_c;
        suitability -= tempDiff * 5;
      }
      
      if (conditions.maxTemp !== undefined && current.temp_c > conditions.maxTemp) {
        const tempDiff = current.temp_c - conditions.maxTemp;
        suitability -= tempDiff * 5;
      }
      
      // Проверяем ветер
      if (conditions.maxWind !== undefined && current.wind_kph > conditions.maxWind) {
        const windDiff = current.wind_kph - conditions.maxWind;
        suitability -= windDiff * 2;
      }
      
      // Проверяем осадки
      if (conditions.maxPrecip !== undefined && current.precip_mm > conditions.maxPrecip) {
        const precipDiff = current.precip_mm - conditions.maxPrecip;
        suitability -= precipDiff * 10;
      }
      
      // Проверяем время суток
      if (conditions.isNight !== undefined && conditions.isNight !== isNight) {
        suitability -= 30;
      }
      
      // Проверяем код погодных условий
      if (conditions.conditions && !conditions.conditions.includes(current.condition.code)) {
        suitability -= 30;
        
        // Для некоторых условий делаем корректировки
        // Например, если облачно, но активность предпочитает солнечно
        if (current.condition.code === 1006 && conditions.conditions.includes(1003)) {
          suitability += 15; // Не так плохо
        }
        
        // Если дождь, и активность требует отсутствия осадков
        if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(current.condition.code) 
            && conditions.maxPrecip === 0) {
          suitability -= 20;
        }
      }
      
      // Особые корректировки для разных категорий
      
      // Для домашних активностей: чем хуже погода, тем лучше для дома
      if (activity.categoryId === 'indoor') {
        // Если плохая погода, увеличиваем пригодность
        if (current.precip_mm > 2 || current.wind_kph > 30 || 
            current.temp_c < 5 || current.temp_c > 35) {
          suitability += 20;
        }
      }
      
      // Домашние активности всегда минимум 60% подходящие
      if (activity.categoryId === 'indoor' && suitability < 60) {
        suitability = 60;
      }
      
      // Ограничиваем значение от 0 до 100
      activity.suitability = Math.max(0, Math.min(100, suitability));
    });
    
    // Сортируем активности по пригодности (от наиболее до наименее подходящих)
    return activities
      .filter(activity => activity.suitability > 30) // Только минимально подходящие
      .sort((a, b) => b.suitability - a.suitability);
  }
  
  private static isNightTime(weatherData: WeatherData): boolean {
    const sunriseHour = parseInt(weatherData.forecast.forecastday[0].astro.sunrise.split(':')[0]);
    const sunsetHour = parseInt(weatherData.forecast.forecastday[0].astro.sunset.split(':')[0]) + 12; // PM to 24h
    const currentHour = new Date().getHours();
    
    return currentHour < sunriseHour || currentHour >= sunsetHour;
  }
} 