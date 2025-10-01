import { useEventImageQuery } from "@/api/events/eventImage";
import { AppEvent } from "@/api/events/types";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { View, XStack } from "tamagui";

import placeholderImage from "@/assets/images/placeholderEventImageSmall.png";
import { formatToDate, formatToTime } from "@/utils/date";

type EventSmallProps = Pick<AppEvent, "name" | "location" | "startTime" | "id">;

const styles = StyleSheet.create({ wrapper: { height: 110 }, image: { aspectRatio: "1/1", width: 80, borderRadius: 8 } });

export const EventSmall = ({ name, location, startTime, id }: EventSmallProps) => {
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
			<XStack gap="$3" alignItems="center">
				<Image source={image || placeholderImage} style={styles.image} />
				<View justifyContent="space-between" gap="$2">
					<SizeableText size="$5" fontWeight="700" numberOfLines={2}>
						{name}
					</SizeableText>
					<View gap="$1">
						<SizeableText size="$3">
							{formatToDate(startTime)}, {formatToTime(startTime)} Uhr
						</SizeableText>
						<SizeableText size="$3">{location}</SizeableText>
					</View>
				</View>
			</XStack>
		</Pressable>
	);
};
