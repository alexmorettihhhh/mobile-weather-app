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
    primary: '#7C4DFF',
    secondary: '#00E5FF',
    background: '#000000',
    surface: '#121212',
    error: '#FF5252',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
    cardBackground: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    chart: {
      line: '#7C4DFF',
      grid: '#333333',
      text: '#B3B3B3',
      point: '#00E5FF',
    },
    difficulty: {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#FF5252',
    },
    border: '#2C2C2C',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#00E5FF',
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export const lightTheme: Theme = {
  colors: {
    primary: '#7C4DFF',
    secondary: '#00B8D4',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#FF5252',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#666666',
    chart: {
      line: '#7C4DFF',
      grid: '#E0E0E0',
      text: '#666666',
      point: '#00B8D4',
    },
    difficulty: {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#FF5252',
    },
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#00B8D4',
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
}; 