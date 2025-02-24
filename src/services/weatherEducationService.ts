import { WeatherData } from '../types/weather';

interface WeatherFact {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface WeatherExplanation {
  id: string;
  phenomenon: string;
  explanation: string;
  icon: string;
}

export class WeatherEducationService {
  private static lastFactId: string | null = null;
  private static lastExplanationId: string | null = null;

  static getWeatherFact(weatherData: WeatherData): WeatherFact {
    const condition = weatherData.current.condition.code;
    const temp = weatherData.current.temp_c;
    const facts = this.getRelevantFacts(condition, temp);
    
    // Фильтруем факты, исключая последний показанный
    const availableFacts = facts.filter(fact => fact.id !== this.lastFactId);
    
    // Если все факты были показаны, сбрасываем фильтр
    const factsToChooseFrom = availableFacts.length > 0 ? availableFacts : facts;
    
    // Выбираем случайный факт
    const randomFact = factsToChooseFrom[Math.floor(Math.random() * factsToChooseFrom.length)];
    
    // Сохраняем ID текущего факта
    this.lastFactId = randomFact.id;
    
    return randomFact;
  }

  static getWeatherExplanation(weatherData: WeatherData): WeatherExplanation {
    const condition = weatherData.current.condition.code;
    const explanations = this.getExplanationForCondition(condition);
    
    // Если это массив объяснений, выбираем случайное, исключая последнее показанное
    if (Array.isArray(explanations)) {
      const availableExplanations = explanations.filter(exp => exp.id !== this.lastExplanationId);
      const explanationsToChooseFrom = availableExplanations.length > 0 ? availableExplanations : explanations;
      const randomExplanation = explanationsToChooseFrom[Math.floor(Math.random() * explanationsToChooseFrom.length)];
      this.lastExplanationId = randomExplanation.id;
      return randomExplanation;
    }
    
    // Если это одно объяснение, возвращаем его
    this.lastExplanationId = explanations.id;
    return explanations;
  }

  private static getRelevantFacts(conditionCode: number, temperature: number): WeatherFact[] {
    const facts: WeatherFact[] = [
      {
        id: 'rain_formation',
        title: 'Как формируется дождь?',
        description: 'Дождь образуется, когда капли воды в облаках становятся достаточно тяжелыми, чтобы преодолеть восходящие потоки воздуха. Это происходит при слиянии мелких капель в более крупные.',
        icon: 'weather-rainy'
      },
      {
        id: 'thunder_sound',
        title: 'Почему гремит гром?',
        description: 'Гром - это звук, создаваемый быстрым расширением воздуха вокруг молнии. Молния нагревает воздух до очень высоких температур, заставляя его расширяться быстрее скорости звука.',
        icon: 'weather-lightning'
      },
      {
        id: 'snow_shape',
        title: 'Почему снежинки шестиугольные?',
        description: 'Форма снежинок определяется молекулярной структурой воды. При замерзании молекулы воды всегда соединяются под углом 120 градусов, что создает шестиугольную симметрию.',
        icon: 'snowflake'
      },
      {
        id: 'rainbow_formation',
        title: 'Как образуется радуга?',
        description: 'Радуга появляется, когда солнечный свет преломляется и отражается в каплях воды в воздухе. Каждый цвет радуги образуется при определенном угле преломления света.',
        icon: 'weather-partly-cloudy'
      },
      {
        id: 'wind_creation',
        title: 'Как возникает ветер?',
        description: 'Ветер образуется из-за разницы атмосферного давления между различными областями. Воздух всегда движется из области высокого давления в область низкого давления.',
        icon: 'weather-windy'
      },
      {
        id: 'humidity_facts',
        title: 'Что такое влажность?',
        description: 'Влажность - это количество водяного пара в воздухе. При 100% влажности воздух полностью насыщен и не может удерживать больше влаги, что часто приводит к осадкам.',
        icon: 'water-percent'
      },
      {
        id: 'tornado_formation',
        title: 'Как образуются торнадо?',
        description: 'Торнадо формируются, когда теплый влажный воздух сталкивается с холодным сухим воздухом, создавая мощное вращающееся воздушное течение. Скорость ветра в торнадо может достигать 500 км/ч.',
        icon: 'weather-tornado'
      },
      {
        id: 'aurora_borealis',
        title: 'Что такое северное сияние?',
        description: 'Северное сияние возникает, когда заряженные частицы от Солнца взаимодействуют с магнитным полем Земли и атмосферой, создавая удивительное световое шоу.',
        icon: 'weather-night'
      },
      {
        id: 'cloud_types',
        title: 'Типы облаков',
        description: 'Существует 10 основных типов облаков, от низких слоистых до высоких перистых. Каждый тип формируется на определенной высоте и может предсказывать различные погодные условия.',
        icon: 'cloud'
      },
      {
        id: 'pressure_effects',
        title: 'Влияние давления',
        description: 'Атмосферное давление влияет на наше самочувствие. При низком давлении многие люди испытывают головную боль и усталость, а высокое давление часто приносит ясную погоду.',
        icon: 'gauge'
      },
      {
        id: 'lightning_facts',
        title: 'Факты о молниях',
        description: 'Температура молнии может достигать 30,000°C - это в 5 раз горячее поверхности Солнца! Каждую секунду на Земле происходит около 100 ударов молний.',
        icon: 'flash'
      },
      {
        id: 'hurricane_eye',
        title: 'Глаз урагана',
        description: 'В центре урагана находится область спокойной погоды, называемая "глазом". Здесь ветры слабые, а небо может быть даже ясным, несмотря на бушующий вокруг шторм.',
        icon: 'weather-hurricane'
      }
    ];

    // Добавляем специфичные для температуры факты
    if (temperature > 30) {
      facts.push({
        id: 'heat_wave',
        title: 'Что такое тепловая волна?',
        description: 'Тепловая волна - это период аномально высоких температур, обычно вызванный устойчивым антициклоном. Это может быть опасно для здоровья.',
        icon: 'thermometer'
      },
      {
        id: 'urban_heat',
        title: 'Городской остров тепла',
        description: 'В городах температура обычно на 1-3°C выше, чем в окрестностях. Это явление называется "городским островом тепла" и возникает из-за темных поверхностей и человеческой деятельности.',
        icon: 'city'
      });
    }

    if (temperature < 0) {
      facts.push({
        id: 'frost_formation',
        title: 'Как образуется иней?',
        description: 'Иней формируется, когда водяной пар в воздухе превращается непосредственно в лед, минуя жидкое состояние. Этот процесс называется сублимацией.',
        icon: 'snowflake'
      },
      {
        id: 'winter_facts',
        title: 'Интересное о зиме',
        description: 'Снег не всегда белый! В Антарктиде можно встретить розовый и даже зеленый снег из-за присутствия микроводорослей.',
        icon: 'snowflake-variant'
      });
    }

    return facts;
  }

  private static getExplanationForCondition(conditionCode: number): WeatherExplanation | WeatherExplanation[] {
    const explanations: { [key: number]: WeatherExplanation | WeatherExplanation[] } = {
      1000: [
        {
          id: 'clear_sky_1',
          phenomenon: 'Ясное небо',
          explanation: 'Ясное небо возникает при высоком атмосферном давлении, когда воздух опускается и рассеивает облака. Это создает идеальные условия для наблюдения за звездами ночью.',
          icon: 'weather-sunny'
        },
        {
          id: 'clear_sky_2',
          phenomenon: 'Антициклон',
          explanation: 'Ясная погода часто связана с антициклоном - областью повышенного давления, где воздух опускается и нагревается, препятствуя образованию облаков.',
          icon: 'weather-sunny'
        }
      ],
      1003: [
        {
          id: 'partly_cloudy_1',
          phenomenon: 'Переменная облачность',
          explanation: 'Переменная облачность возникает из-за неравномерного нагрева поверхности земли и движения воздушных масс. Облака формируются, когда теплый воздух поднимается и охлаждается.',
          icon: 'weather-partly-cloudy'
        },
        {
          id: 'partly_cloudy_2',
          phenomenon: 'Конвекция',
          explanation: 'Облака образуются в результате конвекции - процесса, при котором теплый воздух поднимается вверх, охлаждается и конденсируется, формируя облака.',
          icon: 'weather-partly-cloudy'
        }
      ],
      1087: [
        {
          id: 'thunder_1',
          phenomenon: 'Гроза',
          explanation: 'Грозы формируются в мощных кучево-дождевых облаках. Электрические разряды (молнии) возникают из-за разделения электрических зарядов внутри облака.',
          icon: 'weather-lightning'
        },
        {
          id: 'thunder_2',
          phenomenon: 'Грозовой фронт',
          explanation: 'Грозы часто возникают на границе теплого и холодного воздуха. Когда теплый воздух быстро поднимается вверх, формируются мощные грозовые облака.',
          icon: 'weather-lightning'
        }
      ],
      1063: [
        {
          id: 'rain_1',
          phenomenon: 'Дождь',
          explanation: 'Дождь образуется, когда капли воды в облаках становятся достаточно тяжелыми. На их формирование влияют температура, влажность и атмосферное давление.',
          icon: 'weather-rainy'
        },
        {
          id: 'rain_2',
          phenomenon: 'Процесс осадков',
          explanation: 'Капли дождя формируются, когда мельчайшие капли воды сливаются вместе. Когда они становятся слишком тяжелыми, гравитация преодолевает восходящие потоки воздуха.',
          icon: 'weather-rainy'
        }
      ],
      1066: [
        {
          id: 'snow_1',
          phenomenon: 'Снег',
          explanation: 'Снег образуется, когда водяной пар конденсируется при температуре ниже 0°C. Форма снежинок зависит от температуры и влажности воздуха на пути их падения.',
          icon: 'weather-snowy'
        },
        {
          id: 'snow_2',
          phenomenon: 'Снежные кристаллы',
          explanation: 'Каждая снежинка уникальна! Их форма зависит от температуры и влажности на разных высотах, через которые они проходят во время падения.',
          icon: 'weather-snowy'
        }
      ]
    };

    return explanations[conditionCode] || {
      id: 'default',
      phenomenon: 'Погодное явление',
      explanation: 'Каждое погодное явление - это результат сложного взаимодействия температуры, влажности, давления и движения воздушных масс.',
      icon: 'weather-cloudy'
    };
  }
} 