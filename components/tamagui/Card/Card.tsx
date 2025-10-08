import { type CardProps, styled, Card as TamaCard } from "tamagui";

const StyledCard = styled(TamaCard, {
	padding: "$2.5",
	backgroundColor: "white",
});

export const Card = ({ children, ...props }: CardProps) => {
	return <StyledCard {...props}>{children}</StyledCard>;
};
