import { User } from '@supabase/auth-js';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const userAtom = atom<User>({ id: 'some', aud: '', user_metadata: '' });

export const useSetUser = () => {
  return useSetAtom(userAtom);
};

export const useGetUser = () => {
  return useAtomValue(userAtom);
};

export const useUser = () => {
  return useAtom(userAtom);
};
