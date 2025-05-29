import { getAuth } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { getApp } from '@react-native-firebase/app';
import { useQueryClient } from 'react-query';
import { queryKeys } from '@/api/query/queryKeys';

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return async (uri?: string) => {
    const userId = getAuth().currentUser?.uid;
    if (!uri || !userId) {
      return Promise.resolve('');
    }

    const reference = storage(getApp()).ref(`images/${userId}/profilePicture`);
    const response = await fetch(uri);
    const blob = await response.blob();
    const snapShot = await reference.put(blob);
    const downloadUrl = await storage(getApp())
      .ref(`images/${userId}/${snapShot.metadata.name}`)
      .getDownloadURL();

    await getAuth().currentUser?.updateProfile({ photoURL: downloadUrl });
    await queryClient.invalidateQueries([queryKeys.USER.USER_QUERY_KEY]);
    return Promise.resolve(downloadUrl);
  };
};
