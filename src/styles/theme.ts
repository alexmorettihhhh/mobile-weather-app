interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  chart: {
    line: string;
    grid: string;
    text: string;
    point: string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  border: string;
  success: string;
  warning: string;
  info: string;
}

interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body1: {
      fontSize: number;
    };
    body2: {
      fontSize: number;
    };
    caption: {
      fontSize: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const darkTheme: Theme = {
  colors: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#000000',
    surface: '#121212',
    error: '#CF6679',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
    cardBackground: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    chart: {
      line: '#2196F3',
      grid: '#333333',
      text: '#B3B3B3',
      point: '#FFFFFF',
    },
    difficulty: {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#F44336',
    },
    border: '#2C2C2C',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
};

export const lightTheme: Theme = {
  colors: {
    primary: '#2196F3',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#B00020',
    textPrimary: '#000000',
    textSecondary: '#666666',
    cardBackground: '#FFFFFF',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    chart: {
      line: '#1976D2',
      grid: '#E0E0E0',
      text: '#666666',
      point: '#1976D2',
    },
    difficulty: {
      easy: '#2E7D32',
      medium: '#F57F17',
      hard: '#C62828',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
}; 