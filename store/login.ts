import { atom, useAtom, useSetAtom } from 'jotai';

export const emailSentAtom = atom<boolean>(false);

export const useEmailSentAtom = () => useAtom(emailSentAtom);
export const useSetIsEmailSent = () => useSetAtom(emailSentAtom);
