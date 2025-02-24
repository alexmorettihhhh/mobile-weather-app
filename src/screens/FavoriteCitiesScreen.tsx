import React from 'react';
import { FavoriteCities } from '../components/FavoriteCities';
import { useWeather } from '../hooks/useWeather';

export const FavoriteCitiesScreen: React.FC = () => {
  const { currentCity, setCity } = useWeather();

  return (
    <FavoriteCities
      currentCity={currentCity}
      onCitySelect={setCity}
    />
  );
}; 