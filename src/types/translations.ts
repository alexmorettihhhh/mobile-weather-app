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
  };
  settings: {
    title: string;
    theme: string;
    language: string;
    notifications: string;
    location: string;
    dark: string;
    light: string;
    system: string;
    english: string;
    russian: string;
    appearance: string;
    about: string;
    version: string;
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
  errors: {
    apiError: string;
    locationError: string;
    networkError: string;
  };
}; 