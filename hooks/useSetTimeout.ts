import { useCallback, useEffect, useMemo, useRef } from 'react';

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

    return useMemo(
        () => ({
            setTimeout: (fn: () => void, timeout: number) => {
                timer.current = setTimeout(fn, timeout);
            },
            clear,
        }),
        [clear]
    );
};
