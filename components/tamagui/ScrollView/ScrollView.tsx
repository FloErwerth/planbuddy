import { ScrollView as TamaguiScrollView, ScrollViewProps, View } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";

export const ScrollView = ({ children, withShadow = false, ...props }: ScrollViewProps & { withShadow?: boolean }) => {
	return (
		<View flex={1}>
			<TamaguiScrollView {...props}>{children}</TamaguiScrollView>
			{withShadow && (
				<View
					style={{
						width: "100%",
						height: 30,
						position: "absolute",
						top: 0,
					}}
				>
					<LinearGradient style={{ flex: 1 }} start={[0, 0]} end={[0, 0.6]} locations={[0, 1]} colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]} />
				</View>
			)}
		</View>
	);
};
