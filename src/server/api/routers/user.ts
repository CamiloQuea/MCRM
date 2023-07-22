import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";


export const userRouter = createTRPCRouter({
    getAll: protectedProcedure

        .query(async () => {
            return (await clerkClient.users.getUserList()).map((user) => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    isAdmin: user.publicMetadata.isAdmin as boolean,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    profilePictureUrl: user.profileImageUrl
                };
            })
        }),
    create: protectedProcedure

        .input(z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            username: z.string(),
            password: z.string(),
            isAdmin: z.boolean(),
        }))
        .mutation(async ({ input: { firstName, lastName, username, password, isAdmin } }) => {
            // console.log({ firstName, lastName, username, password, isAdmin })

            return clerkClient.users.createUser({
                firstName,
                lastName,
                username,
                password,
                publicMetadata: {
                    isAdmin
                },
                skipPasswordChecks: true,
                skipPasswordRequirement: true,

            }).catch((err) => {
                
                throw err;
            });
        })

})