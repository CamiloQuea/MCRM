import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateRoomSchema } from "../validators";



export const roomRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z.object({
                include: z.object({
                    building: z.boolean().optional(),
                    branch: z.boolean().optional(),
                }).optional(),
                where: z.object({
                    name: z.string().optional(),
                    buildingFloorId: z.string().optional()
                }).optional()

            }).optional()
        )
        .query(async ({ ctx, input }) => {

            const rooms = await ctx.prisma.room.findMany({
                where: {
                    name: {
                        contains: input?.where?.name
                    }
                },
                include: {
                    department: true,
                }
            });
            return rooms;
        }),
    create: protectedProcedure

        .input(CreateRoomSchema)
        .mutation(async ({ ctx, input }) => {

            const newRoom = await ctx.prisma.room.create({
                data: {
                    name: input.name,
                    buildingFloorId: input.buildingFloorId,
                    departmentId: input.departmentId
                }
            });
            return newRoom;
        })

})