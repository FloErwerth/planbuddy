import { LinearGradient } from 'expo-linear-gradient';
import { View, ViewProps } from 'tamagui';

export const Shadow = (props: ViewProps) => {
    return (
        <View width="150%" left="-25%" height={60} {...props}>
            <LinearGradient style={{ flex: 1 }} start={[0, 0]} end={[0, 0.6]} locations={[0, 1]} colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']} />
        </View>
    );
};
