export type Translations = {
  common: {
    loading: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    settings: string;
    error: string;
    ok: string;
  };
  settings: {
    title: string;
    theme: string;
    language: string;
    notifications?: string;
    location?: string;
    dark: string;
    light: string;
    system?: string;
    english?: string;
    russian?: string;
    spanish?: string;
    german?: string;
    appearance: string;
    about: string;
    version: string;
    units?: string;
    metric?: string;
    imperial?: string;
  };
  weather: {
    temperature: string;
    feelsLike: string;
    humidity: string;
    wind: string;
    pressure: string;
    visibility: string;
    precipitation: string;
    forecast: string;
    sunrise: string;
    sunset: string;
    clear: string;
    cloudy: string;
    rain: string;
    snow: string;
    uvIndex: string;
    uvLow: string;
    uvModerate: string;
    uvHigh: string;
    uvVeryHigh: string;
    uvExtreme: string;
    hourlyForecast: string;
    dailyForecast?: string;
    temperatureChart?: string;
  };
  locations: {
    current: string;
    favorites: string;
    addToFavorites: string;
    removeFromFavorites: string;
    detectLocation: string;
    searchPlaceholder: string;
    currentLocation: string;
  };
  location: {
    success: string;
    cached: string;
    permissionDenied: string;
    disabled: string;
    noInternet: string;
    timeout: string;
    error: string;
    unknown: string;
    retry: string;
    settings: string;
  };
  astronomical: {
    title: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    illumination: string;
    newmoon: string;
    waxingcrescent: string;
    firstquarter: string;
    waxinggibbous: string;
    fullmoon: string;
    waninggibbous: string;
    lastquarter: string;
    waningcrescent: string;
  };
  airQuality: {
    title: string;
    good: string;
    moderate: string;
    unhealthyForSensitive: string;
    unhealthy: string;
    veryUnhealthy: string;
    hazardous: string;
    unknown?: string;
    index?: string;
  };
  units: {
    temperature: string;
    speed: string;
    pressure: string;
    precipitation: string;
    distance: string;
  };
  unitsImperial: {
    temperature: string;
    speed: string;
    pressure: string;
    precipitation: string;
    distance: string;
  };
  directions: {
    N: string;
    NNE: string;
    NE: string;
    ENE: string;
    E: string;
    ESE: string;
    SE: string;
    SSE: string;
    S: string;
    SSW: string;
    SW: string;
    WSW: string;
    W: string;
    WNW: string;
    NW: string;
    NNW: string;
  };
  recommendations: {
    title: string;
    clothing: {
      warm: string;
      light: string;
      raincoat: string;
      winter: string;
    };
    activities: {
      perfect: string;
      indoor: string;
      rain: string;
      cold: string;
    };
  };
  share: {
    title: string;
    current: string;
    forecast: string;
    note: string;
    success: string;
    error: string;
  };
  activities: {
    title: string;
    subtitle: string;
    notRecommended: string;
  };
  history: {
    title: string;
    temperature: string;
    humidity: string;
    wind: string;
    noData: string;
  };
  errors: {
    apiError: string;
    locationError: string;
    networkError: string;
    locationPermission?: string;
    locationUnavailable?: string;
    invalidApiKey?: string;
  };
  interactive?: {
    title: string;
    cloudSimulator?: {
      title: string;
      description: string;
      instructions: string[];
      requirements: string[];
      ageGroup: string;
    };
    tornadoExperiment?: {
      title: string;
      description: string;
      instructions: string[];
      requirements: string[];
      ageGroup: string;
    };
  };
  quiz?: {
    meteorologyBasics?: {
      title: string;
      description: string;
      difficulty: string;
      duration: string;
      questionsCount: number;
      startButton: string;
    };
    weatherPhenomena?: {
      title: string;
      description: string;
      difficulty: string;
      duration: string;
      questionsCount: number;
      startButton: string;
    };
    climateAndWeather?: {
      title: string;
      description: string;
      difficulty: string;
      duration: string;
      questionsCount: number;
      startButton: string;
    };
    atmosphericPhenomena?: {
      title: string;
      description: string;
      difficulty: string;
      duration: string;
      questionsCount: number;
      startButton: string;
    };
  };
  search?: {
    placeholder: string;
    useLocation: string;
  };
}; 