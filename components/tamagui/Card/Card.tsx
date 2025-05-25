import { Card as TamaCard, CardProps, styled } from 'tamagui';

const StyledCard = styled(TamaCard, {
  elevation: '$4',
  padding: '$2',
  borderWidth: 0.5,
  borderColor: '$borderColor',
});

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <StyledCard elevate {...props}>
      {children}
    </StyledCard>
  );
};
