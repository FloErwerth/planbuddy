import { ComponentProps, useEffect, useState } from 'react';
import { AnimatePresence, Circle, Square, View } from 'tamagui';
import { useSetInterval } from '@/hooks/useSetTimeout';

type SquareSkeletonProps = {
    shape: 'square';
} & ComponentProps<typeof Square>;

type CircleSkeletonProps = {
    shape: 'circle';
} & ComponentProps<typeof Circle>;
type SkeletonProps = SquareSkeletonProps | CircleSkeletonProps;

export const Skeleton = ({ shape, children, ...viewProps }: SkeletonProps) => {
    const { setInterval, clear } = useSetInterval();
    const [render, setRender] = useState(true);
    const randomFactor = Math.random() * 25 * (Math.random() > 0.5 ? -1 : 1);

    useEffect(() => {
        setInterval(() => {
            setRender((isRendering) => !isRendering);
        }, 1000 + randomFactor);

        return () => {
            clear();
        };
    }, [clear, randomFactor, setInterval]);

    return (
        <AnimatePresence>
            {render && (
                <View animation="medium" animationDuration={500} enterStyle={{ scale: 0.95, opacity: 0.6 }} exitStyle={{ scale: 0.8, opacity: 0.8 }}>
                    {shape === 'circle' ? (
                        <Circle backgroundColor="$color.gray7Light" {...viewProps} />
                    ) : (
                        <Square backgroundColor="$color.gray7Light" borderRadius="$2" {...viewProps} />
                    )}
                    {children}
                </View>
            )}
        </AnimatePresence>
    );
};
