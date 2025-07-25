import { Card as TamaCard, CardProps, styled } from 'tamagui';

const StyledCard = styled(TamaCard, {
    elevation: '$1',
    padding: '$2',
    borderWidth: 0,
});

export const Card = ({ children, ...props }: CardProps) => {
    return <StyledCard {...props}>{children}</StyledCard>;
};
