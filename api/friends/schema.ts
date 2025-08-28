import { array, object, string, z } from "zod";
import { statusSchema, userSchema } from "@/api/types";
import { NotificationChannelEnumDefinition } from "@/providers/NotificationsProvider";

export const friendSchema = z
    .object({
        id: string(),
        acceptedAt: string().nullable(),
        sendAt: string(),
        status: statusSchema,
    })
    .transform(({ acceptedAt, sendAt, ...rest }) => ({
        sendAt: new Date(sendAt),
        acceptedAt: acceptedAt ? new Date(acceptedAt) : undefined,
        ...rest,
    }));

export const singleFriendSchema = friendSchema.and(
    z.object({
        requesterId: string().optional(),
        receiverId: string().optional(),
        email: string().optional(),
        firstName: string().optional(),
        lastName: string().optional(),
        pushToken: string().nullable(),
        pushChannels: array(NotificationChannelEnumDefinition).nullable().default([]),
    })
);

export const friendsQuerySchema = z.array(
    friendSchema
        .and(
            object({
                requesterId: userSchema.nullable(),
                receiverId: userSchema.nullable(),
            })
        )
        .transform(({ receiverId, requesterId, ...rest }) => ({
            requester: requesterId,
            receiver: receiverId,
            ...rest,
        }))
);

export type FriendsQueryResponse = z.infer<typeof friendsQuerySchema>;
export type SingleFriendQueryResponse = z.infer<typeof singleFriendSchema>;
