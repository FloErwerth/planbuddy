import { getAuth } from "@react-native-firebase/auth";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { useMutation, useQueryClient } from "react-query";

import { UserData, userDataSchema } from "./types";
import { queryKeys } from "../queryKeys";

const createUser = async (userData: UserData) => {
  const parsedUserData = userDataSchema.safeParse(userData);
  if (parsedUserData.success) {
    await setDoc(doc(getFirestore(), "users", parsedUserData.data.id), {
      ...parsedUserData.data,
    });
  }
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
