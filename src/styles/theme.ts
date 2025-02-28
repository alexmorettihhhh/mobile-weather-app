export interface ThemeColors {
  primary: string;
  primaryLight: string;
  onPrimary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  cardBackground: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  chart: {
    temperature: string;
    humidity: string;
    wind: string;
    precipitation: string;
    line: string;
    grid: string;
    text: string;
    point: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  typography: {
    fontSize: {
      small: number;
      regular: number;
      medium: number;
      large: number;
      extraLarge: number;
    };
    fontWeight: {
      light: string;
      regular: string;
      semibold: string;
      bold: string;
    };
  };
}

export const darkTheme: Theme = {
  colors: {
    primary: '#38B3EF',
    primaryLight: '#5FC2F5',
    onPrimary: '#FFFFFF',
    secondary: '#FFB74D',
    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    cardBackground: '#121212',
    surface: '#181818',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0C4DE',
    border: '#2A2A2A',
    divider: '#2A2A2A',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#64B5F6',
    chart: {
      temperature: '#FF6B4D',
      humidity: '#4DB6FF',
      wind: '#80DEEA',
      precipitation: '#81D4FA',
      line: '#FFFFFF',
      grid: '#2A2A2A',
      text: '#B0C4DE',
      point: '#FFFFFF'
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    fontSize: {
      small: 12,
      regular: 14,
      medium: 16,
      large: 20,
      extraLarge: 28,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      semibold: '600',
      bold: '700',
    },
  },
};

export const lightTheme: Theme = {
  colors: {
    primary: '#1A97E1',
    primaryLight: '#D1EBFF',
    onPrimary: '#FFFFFF',
    secondary: '#FF9800',
    background: '#F4F9FD',
    backgroundSecondary: '#FFFFFF',
    cardBackground: '#FFFFFF',
    surface: '#FFFFFF',
    textPrimary: '#10394A',
    textSecondary: '#6D8A99',
    border: '#E1ECF5',
    divider: '#EDF3F8',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    chart: {
      temperature: '#F66F59',
      humidity: '#40A3F5',
      wind: '#5CCDDD',
      precipitation: '#64B5F6',
      line: '#10394A',
      grid: '#E1ECF5',
      text: '#6D8A99',
      point: '#10394A'
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    fontSize: {
      small: 12,
      regular: 14,
      medium: 16,
      large: 20,
      extraLarge: 28,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      semibold: '600',
      bold: '700',
    },
  },
}; 