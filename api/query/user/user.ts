import { getAuth } from "@react-native-firebase/auth";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { useMutation, useQueryClient } from "react-query";

import { UserData, userDataSchema } from "./types";
import { queryKeys } from "../queryKeys";

const createUser = async (userData: UserData) => {
    await setDoc(doc(getFirestore(), "users", userData.id), {
      ...userData,
    });
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const userCredentials = await getAuth().signInWithEmailAndPassword(credentials.email, credentials.password);

      if (!userCredentials) {
        throw new Error("Login not possible");
      }
    },
    mutationKey: [queryKeys.USER.LOGIN_USER_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};

export const useRegisterUserMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: createUserInDB } = useCreateUserMutation();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const userCredentials = await getAuth().createUserWithEmailAndPassword(credentials.email, credentials.password);

      if (!userCredentials || !userCredentials.user.email) {
        throw new Error("Login not possible");
      }

      createUserInDB({ id: userCredentials.user.uid, email: userCredentials.user.email })
    },
    mutationKey: [queryKeys.USER.REGISTER_USER_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
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
    },
  });
};
