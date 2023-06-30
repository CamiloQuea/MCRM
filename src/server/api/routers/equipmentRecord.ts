
import { z } from "zod";
import {
    createTRPCRouter,

    protectedProcedure,
} from "../trpc";

export const equipmentRecordRouter = createTRPCRouter({
    getByEquipmentId: protectedProcedure
        .input(
            z.object({
                equipmentId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {

            return ctx.prisma.equipmentTracking.findMany({
                where: {
                    equipmentId: input.equipmentId
                },
                include: {
                    room: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },

            })

        })
})