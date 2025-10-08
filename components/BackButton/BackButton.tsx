import { Link } from "expo-router";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { View } from "tamagui";
import type { ComponentProps } from "react";

type BackButtonProps = Omit<ComponentProps<typeof Link>, "href"> & Partial<Pick<ComponentProps<typeof Link>, "href">>;
export const BackButton = ({ href = "..", ...props }: BackButtonProps) => {
	return (
		<Link href={href} {...props}>
			<View borderRadius="$12" padding={0} width="$3" height="$3" justifyContent="center" alignItems="center" backgroundColor="$accent">
				<ChevronLeft size="$1" color="$color" />
			</View>
		</Link>
	);
};
