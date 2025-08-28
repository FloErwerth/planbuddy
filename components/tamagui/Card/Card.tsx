import { Card as TamaCard, CardProps, styled } from 'tamagui';
import * as Device from 'expo-device';

const isIos = Device.osName !== 'Android';

const StyledCard = styled(TamaCard, {
    padding: '$2.5',
    backgroundColor: 'white',
});

export const Card = ({ children, ...props }: CardProps) => {
    return <StyledCard {...props}>{children}</StyledCard>;
};
