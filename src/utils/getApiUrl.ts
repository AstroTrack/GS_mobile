import Constants from 'expo-constants';

const API_PRODUCTION = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'https://astrotrack-api.onrender.com';

export const getApiUrl = () => {
  // Se houver uma URL configurada no .env (como o Render), usa ela primeiro
  if (process.env.EXPO_PUBLIC_API_URL || process.env.API_URL) {
    return process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || API_PRODUCTION;
  }

  // Em desenvolvimento, se não houver .env, tenta pegar o IP da máquina para o Expo Go
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri || '';
    const localhost = debuggerHost.split(':')[0];

    if (localhost) {
      return `http://${localhost}:8080`;
    }
  }

  return API_PRODUCTION;
};
