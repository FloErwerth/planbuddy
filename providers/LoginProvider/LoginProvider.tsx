import { useSetInterval } from "@/hooks/useSetTimeout";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type LoginContextType =
  | {
      email: string;
      setEmail: (email: string) => void;
      setLoginError: (error: string) => void;
      loginError?: string;
      resendTokenTime: number;
      resetTokenPage: () => void;
      startResendTokenTimer: (resendTime?: number) => void;
    }
  | undefined;

const LoginContext = createContext<LoginContextType>(undefined);

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error("login context must be used in LoginProvider");
  }

  return context;
};

const RESEND_TIME_SECONDS = 60;
const SECOND_MS = 1000;
export const LoginProvider = ({ children }: PropsWithChildren) => {
  const [email, setEmail] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [resendTokenTime, setResendTokenTime] = useState<number>(0);
  const { setInterval, clear } = useSetInterval();

  const resetTokenPage = () => {
    clear();
    setResendTokenTime(0);
  };

  const startResendTokenTimer = (resendTime?: number) => {
    clear();
    setResendTokenTime(resendTime ?? RESEND_TIME_SECONDS);
    setInterval(() => {
      setResendTokenTime((time) => {
        if (time === 0) {
          clear();
          return 0;
        }
        return time - 1;
      });
    }, SECOND_MS);
  };

  return (
    <LoginContext.Provider
      value={{
        setLoginError,
        setEmail,
        email,
        loginError,
        startResendTokenTimer,
        resendTokenTime,
        resetTokenPage,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
