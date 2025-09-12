import { useEventImageQuery } from "@/api/events/eventImage";
import { AppEvent } from "@/api/events/types";
import { Card } from "@/components/tamagui/Card";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { getRelativeDate } from "@/utils/date";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { View, XStack } from "tamagui";

type EventSmallProps = Pick<AppEvent, "name" | "location" | "startTime" | "id">;

const imageStyle = { aspectRatio: "4/3", width: "33%", borderRadius: 8 } as const;
export const EventSmall = ({ name, startTime, id }: EventSmallProps) => {
	const { data: image } = useEventImageQuery(id);
	return (
		<Pressable
			onPress={() =>
				router.push({
					pathname: "/eventDetails",
					params: { eventId: id },
				})
			}
		>
			<Card marginHorizontal="$4">
				<XStack gap="$2">
					<View justifyContent="space-between" flex={1}>
						<SizeableText size="$8" numberOfLines={2}>
							{name}
						</SizeableText>
						<SizeableText size="$5">{getRelativeDate(new Date(startTime))}</SizeableText>
					</View>
					{image && <Image source={image} style={imageStyle} />}
				</XStack>
			</Card>
		</Pressable>
	);
};
