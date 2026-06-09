import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  errorMsg: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    errorMsg: null,
    loading: true,
  });

  const fetchLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, errorMsg: null }));
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({
          coords: null,
          errorMsg: 'Permissão de localização negada',
          loading: false,
        });
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setState({
        coords: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        errorMsg: null,
        loading: false,
      });
    } catch (error) {
      console.error('[useLocation] Erro ao obter localização:', error);
      setState({
        coords: null,
        errorMsg: 'Não foi possível obter a localização atual',
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    ...state,
    refreshLocation: fetchLocation,
  };
};
