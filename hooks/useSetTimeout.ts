import { useCallback, useEffect, useRef } from "react";

export const useSetTimeout = () => {
	const timer = useRef<ReturnType<typeof setTimeout>>(0);

	const clear = useCallback(() => {
		clearTimeout(timer.current);
	}, []);

	useEffect(() => {
		return () => {
			clear();
		};
	}, [clear]);

	return {
		setTimeout: (fn: () => void, timeout: number) => {
			timer.current = setTimeout(fn, timeout);
		},
		timer,
		clear,
	};
};

export const useSetInterval = () => {
	const timer = useRef<ReturnType<typeof setInterval>>(0);

	const clear = useCallback(() => {
		clearInterval(timer.current);
	}, []);

	useEffect(() => {
		return () => {
			clear();
		};
	}, [clear]);

	return {
		setInterval: (fn: () => void, timeout: number) => {
			timer.current = setInterval(fn, timeout);
		},
		clear,
	};
};
