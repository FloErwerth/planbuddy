import { View, XStack } from "tamagui";
import { useAllParticipantsQuery } from "@/api/participants/allParticipants/useAllParticipantsQuery";
import { ParticipantRoleEnum } from "@/api/participants/types";
import { Card } from "@/components/tamagui/Card";
import { SizeableText } from "@/components/tamagui/Text";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const ProfileStatistics = () => {
	const { data: participants } = useAllParticipantsQuery();
	const { user } = useAuthenticationContext();
	const { t } = useTranslation();

	const myParticipations = participants?.filter((participant) => participant.userId === user.id);

	const numberOfEventsICreated = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.CREATOR).length;
	const numberOfEventsIAttended = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.GUEST).length;
	const numberOfEventsIContributedTo = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.ADMIN).length;

	return (
		<View gap="$2" marginBottom="$2">
			<SizeableText size="$5">{t("events.statistics")}</SizeableText>
			<Card>
				<XStack justifyContent="space-around">
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsICreated}
						</SizeableText>
						<SizeableText>{t("events.hosted")}</SizeableText>
					</View>
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsIAttended}
						</SizeableText>
						<SizeableText>{t("events.contributed")}</SizeableText>
					</View>
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsIContributedTo}
						</SizeableText>
						<SizeableText>{t("events.attended")}</SizeableText>
					</View>
				</XStack>
			</Card>
		</View>
	);
};
