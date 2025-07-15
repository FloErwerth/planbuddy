import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';
import { useLoginSession } from '@/hooks/useLoginSession';
import { AuthApiError } from '@supabase/auth-js';

type LoginContextType =
  | {
      email: string;
      setEmail: (email: string) => void;
      setLoginError: (error: AuthApiError['code']) => void;
      loginError?: AuthApiError['code'];
      startedLoginAttempt: boolean;
      setStartedLoginAttempt: (attemptStarted: boolean) => void;
      resendTokenTime: number;
      resetTokenPage: () => void;
      startResendTokenTimer: (timeInSeconds?: number) => void;
    }
  | undefined;

const LoginContext = createContext<LoginContextType>(undefined);

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('login context must be used in LoginProvider');
  }

  return context;
};

const RESEND_TIME_SECONDS = 60;
const SECOND_MS = 1000;
export const LoginProvider = ({ children }: PropsWithChildren) => {
  const [email, setEmail] = useState<string>('');
  const [loginError, setLoginError] = useState<AuthApiError['code']>('');
  const [resendTokenTime, setResendTokenTime] = useState<number>(RESEND_TIME_SECONDS);
  const [startedLoginAttempt, setStartedLoginAttempt] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const resetTokenPage = useCallback(() => {
    clearInterval(timer.current);
    setResendTokenTime(RESEND_TIME_SECONDS);
    setStartedLoginAttempt(false);
  }, []);

  const startResendTokenTimer = useCallback((time?: number) => {
    setResendTokenTime(time ?? RESEND_TIME_SECONDS);
    setStartedLoginAttempt(true);
    timer.current = setInterval(() => {
      setResendTokenTime((time) => {
        if (time === 0) {
          clearInterval(timer.current);
          return 0;
        }
        return time - 1;
      });
    }, SECOND_MS);
  }, []);

  useLoginSession();

  return (
    <LoginContext.Provider
      value={{
        setStartedLoginAttempt,
        setLoginError,
        setEmail,
        email,
        loginError,
        startedLoginAttempt,
        startResendTokenTimer,
        resendTokenTime,
        resetTokenPage,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
