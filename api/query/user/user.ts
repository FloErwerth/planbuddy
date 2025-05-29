import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { UserData, userDataSchema } from './types';
import { queryKeys } from '../queryKeys';
import { FirebaseError } from '@firebase/util';
import { AuthErrorCode } from '@firebase/auth/internal';
import { useCallback } from 'react';

const createUser = async (userData: UserData) => {
  await setDoc(doc(getFirestore(), 'users', userData.id), {
    ...userData,
  });
};

export const useUpdateUser = () => {
  const userId = getAuth().currentUser?.uid;
  const queryClient = useQueryClient();

  return useCallback(
    async (newUserData: Partial<UserData>) => {
      if (!userId) {
        return Promise.reject('Not logged in');
      }
      await updateDoc(doc(getFirestore(), 'users', userId), {
        ...newUserData,
      });
      await queryClient.invalidateQueries([queryKeys.USER.USER_QUERY_KEY]);
    },
    [queryClient, userId]
  );
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return getAuth()
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then((userCredentials) => {
          if (!userCredentials) {
            throw new Error('Login not possible');
          }
        })
        .catch((e: FirebaseError) => {
          return e.code as AuthErrorCode;
        });
    },
    mutationKey: [queryKeys.USER.LOGIN_USER_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.USER_QUERY_KEY });
    },
  });
};

export const useUserQuery = () => {
  const userId = getAuth().currentUser?.uid;

  return useQuery({
    queryFn: async () => {
      const usersRef = collection(getFirestore(), 'users');
      const userData = await getDocs(query(usersRef, where('id', '==', userId)));
      const parsedUserData = userDataSchema.safeParse(userData.docs[0].data());

      if (parsedUserData.success) {
        return parsedUserData.data;
      }
    },
    queryKey: [queryKeys.USER.USER_QUERY_KEY, userId],
  });
};

export const useRegisterUserMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: createUserInDB } = useCreateUserMutation();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return getAuth()
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then((userCredentials) => {
          if (!userCredentials || !userCredentials.user.email) {
            throw new Error('Login not possible');
          }

          createUserInDB({ id: userCredentials.user.uid, email: userCredentials.user.email });
        })
        .catch((e: FirebaseError) => {
          return e.code as AuthErrorCode;
        });
    },
    mutationKey: [queryKeys.USER.REGISTER_USER_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.USER_QUERY_KEY });
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    mutationKey: [queryKeys.USER.CREATE_USER_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.USER_QUERY_KEY });
    },
  });
};
