import AsyncStorage from '@react-native-async-storage/async-storage';

export const writeInviteId = async (id: string) => {
  await AsyncStorage.setItem('inviteId', id);
};

export const readInviteId = async () => {
  return await AsyncStorage.getItem('inviteId');
};

export const removeInviteId = async () => {
  return await AsyncStorage.removeItem('inviteId');
};
