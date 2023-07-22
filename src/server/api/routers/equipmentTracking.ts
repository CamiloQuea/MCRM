import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const equipmentTrackingRouter = createTRPCRouter({
    getAllById: protectedProcedure
        .input(z.object({
            equipmentId: z.string().optional(),
            limit: z.number().optional()
        }))
        .query(({ ctx, input }) => {

            let query = ctx.db
                .selectFrom('equipmenttracking')
                .innerJoin('room', 'room.id', 'equipmenttracking.roomId')
                .selectAll()



            if (typeof input.equipmentId !== 'undefined')
                query = query.where('equipmentId', '=', input.equipmentId)

            if (typeof input.limit !== 'undefined')
                query = query.limit(input.limit)


            return query.execute()
        })
})