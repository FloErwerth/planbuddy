import { PropsWithChildren } from 'react';
import { useLoginSession } from '@/hooks/useLoginSession';

export const LoginProvider = ({ children }: PropsWithChildren) => {
  useLoginSession();

  return children;
};
