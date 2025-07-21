import { Card as TamaCard, CardProps, styled } from 'tamagui';

const StyledCard = styled(TamaCard, {
    elevation: '$1',
    padding: '$2',
    borderWidth: 1,
    borderColor: '$color.gray7Light',
});

export const Card = ({ children, ...props }: CardProps) => {
    return <StyledCard {...props}>{children}</StyledCard>;
};
