import { atom } from 'jotai';

export const imagePickerAtom = atom<{ uri: string; base64: string } | undefined>(undefined);
