import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = (key: string, value: string) => {
  return AsyncStorage.setItem(key, value);
};

export const load = (key: string) => {
  return AsyncStorage.getItem(key);
};

export const remove = (key: string) => {
  return AsyncStorage.removeItem(key);
};
