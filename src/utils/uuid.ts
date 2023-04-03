import uuid from 'react-native-uuid';

export const getUUID = (): string => {
  return uuid.v4() as string;
};
