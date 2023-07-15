
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


            const query = ctx.db.selectFrom('equipmenttracking').selectAll().where('equipmentId', '=', input.equipmentId)
                .orderBy('createdAt', 'desc')

            return query.execute()

        })
})