import { LoginSchema, RegisterSchema } from '@/screens/Authentication/schemas';

export const useAuthenticationErrorText = <T extends LoginSchema | RegisterSchema>() => {
  return (errorCode: string): { field: keyof T; message: string } | undefined => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return { field: 'email', message: 'Diese E-Mail wird bereits verwendet.' };
      case 'auth/invalid-credential':
        return { field: 'password', message: 'Dieses Passwort scheint nicht zu stimmen.' };
      default:
        return undefined;
    }
  };
};
