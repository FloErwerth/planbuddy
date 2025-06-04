import { User } from '@supabase/auth-js';
import { atom, useAtomValue, useSetAtom } from 'jotai';

const userAtom = atom<User>();

export const useSetUser = () => {
  return useSetAtom(userAtom);
};

export const useGetUser = () => {
  return useAtomValue(userAtom);
};
