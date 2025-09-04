import { createContext, PropsWithChildren, useContext, useRef, useState } from "react";

type LoginContextType =
	| {
			email: string;
			setEmail: (email: string) => void;
			setLoginError: (error: string) => void;
			loginError?: string;
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
		throw new Error("login context must be used in LoginProvider");
	}

	return context;
};

const RESEND_TIME_SECONDS = 60;
const SECOND_MS = 1000;
export const LoginProvider = ({ children }: PropsWithChildren) => {
	const [email, setEmail] = useState<string>("");
	const [loginError, setLoginError] = useState<string>("");
	const [resendTokenTime, setResendTokenTime] = useState<number>(RESEND_TIME_SECONDS);
	const [startedLoginAttempt, setStartedLoginAttempt] = useState(false);
	const timer = useRef<ReturnType<typeof setInterval>>(-1);

	const resetTokenPage = () => {
		clearInterval(timer.current);
		setResendTokenTime(RESEND_TIME_SECONDS);
		setStartedLoginAttempt(false);
	};

	const startResendTokenTimer = (time?: number) => {
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
	};

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
