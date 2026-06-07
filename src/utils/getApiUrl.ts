import Constants from 'expo-constants';

const API_PRODUCTION = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'https://astrotrack-api.onrender.com';

export const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL || process.env.API_URL) {
    return process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || API_PRODUCTION;
  }
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri || '';
    const localhost = debuggerHost.split(':')[0];

    if (localhost) {
      return `http://${localhost}:8080`;
    }
  }

  return API_PRODUCTION;
};
