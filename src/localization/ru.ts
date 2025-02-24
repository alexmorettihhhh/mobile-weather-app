export const ru = {
  common: {
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
  },
  weather: {
    feelsLike: 'Ощущается как',
    wind: 'Ветер',
    humidity: 'Влажность',
    pressure: 'Давление',
    uvIndex: 'УФ индекс',
    hourlyForecast: 'Почасовой прогноз',
    dailyForecast: '7-дневный прогноз',
    temperatureChart: 'График температуры',
  },
  search: {
    placeholder: 'Поиск города...',
    useLocation: 'Использовать текущее местоположение',
  },
  errors: {
    locationPermission: 'Для получения погоды необходим доступ к местоположению',
    locationUnavailable: 'Не удалось получить местоположение. Пожалуйста, попробуйте снова',
    networkError: 'Ошибка сети. Проверьте подключение к интернету',
    apiError: 'Ошибка получения данных о погоде. Попробуйте позже',
    invalidApiKey: 'Ошибка API ключа. Проверьте конфигурацию',
  },
  airQuality: {
    title: 'Качество воздуха',
    good: 'Хорошее',
    moderate: 'Умеренное',
    unhealthyForSensitive: 'Вредно для чувствительных групп',
    unhealthy: 'Вредно',
    veryUnhealthy: 'Очень вредно',
    hazardous: 'Опасно',
    unknown: 'Неизвестно',
    index: 'Индекс EPA',
  },
  astronomical: {
    title: 'Астрономические данные',
    sunrise: 'Восход',
    sunset: 'Закат',
    moonrise: 'Восход луны',
    moonset: 'Закат луны',
    moonPhase: 'Фаза луны',
    illumination: 'Освещенность',
    newMoon: 'Новолуние',
    waxingCrescent: 'Растущий серп',
    firstQuarter: 'Первая четверть',
    waxingGibbous: 'Растущая луна',
    fullMoon: 'Полнолуние',
    waningGibbous: 'Убывающая луна',
    lastQuarter: 'Последняя четверть',
    waningCrescent: 'Убывающий серп',
  },
  units: {
    temperature: '°C',
    speed: 'км/ч',
    pressure: 'мб',
    precipitation: 'мм',
    distance: 'км',
  },
  directions: {
    N: 'С',
    NNE: 'ССВ',
    NE: 'СВ',
    ENE: 'ВСВ',
    E: 'В',
    ESE: 'ВЮВ',
    SE: 'ЮВ',
    SSE: 'ЮЮВ',
    S: 'Ю',
    SSW: 'ЮЮЗ',
    SW: 'ЮЗ',
    WSW: 'ЗЮЗ',
    W: 'З',
    WNW: 'ЗСЗ',
    NW: 'СЗ',
    NNW: 'ССЗ',
  },
  interactive: {
    title: 'Интерактив',
    cloudSimulator: {
      title: 'Симулятор формирования облаков',
      description: 'Исследуйте процесс образования различных типов облаков в интерактивной модели. Узнайте, как температура и влажность влияют на формирование облаков разных видов - от перистых до кучевых.',
      instructions: [
        'Выберите начальную температуру воздуха в диапазоне от -10°C до +50°C',
        'Установите уровень влажности воздуха от 0% до 100%',
        'Наблюдайте за процессом конденсации и формированием облаков',
        'Экспериментируйте с разными условиями для создания различных типов облаков',
      ],
      requirements: [
        'Современный браузер с поддержкой WebGL',
        'Стабильное интернет-соединение',
      ],
      ageGroup: 'teenager',
    },
    tornadoExperiment: {
      title: 'Эксперимент: Создание торнадо в бутылке',
      description: 'Создайте безопасную модель торнадо в домашних условиях. Этот эксперимент поможет понять принципы формирования вихревых потоков в атмосфере и механизм образования торнадо.',
      instructions: [
        'Наполните пластиковую бутылку водой, оставив немного воздуха',
        'Добавьте несколько капель пищевого красителя или блестки для лучшей визуализации',
        'Переверните бутылку вверх дном и создайте вращательное движение',
        'Наблюдайте за формированием воронки и обратите внимание на скорость вращения',
      ],
      requirements: [
        'Прозрачная пластиковая бутылка с крышкой',
        'Чистая вода комнатной температуры',
        'Пищевой краситель или блестки',
        'Помощь взрослых при проведении эксперимента',
      ],
      ageGroup: 'children',
    },
  },
  quiz: {
    meteorologyBasics: {
      title: 'Основы метеорологии',
      description: 'Проверьте свои знания о базовых понятиях в метеорологии',
      difficulty: 'easy',
      duration: '10 мин',
      questionsCount: 5,
      startButton: 'Начать викторину',
    },
    weatherPhenomena: {
      title: 'Погодные явления',
      description: 'Тест на знание различных погодных явлений',
      difficulty: 'medium',
      duration: '8 мин',
      questionsCount: 5,
      startButton: 'Начать викторину',
    },
    climateAndWeather: {
      title: 'Климат и погода',
      description: 'Проверьте свои знания о климатических особенностях',
      difficulty: 'medium',
      duration: '9 мин',
      questionsCount: 3,
      startButton: 'Начать викторину',
    },
    atmosphericPhenomena: {
      title: 'Атмосферные явления',
      description: 'Углубленный тест по атмосферным явлениям',
      difficulty: 'hard',
      duration: '12 мин',
      questionsCount: 3,
      startButton: 'Начать викторину',
    },
  },
}; 