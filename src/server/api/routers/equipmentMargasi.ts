import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateMargesiSchema } from "../validators";
import { randomUUID } from "crypto";


export const equipmentMargesiRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
        }).optional())
        .query(async ({ ctx }) => {
            const query = ctx.db.selectFrom('equipmentmargesi').selectAll()
            return query.execute()

        }),

    create: protectedProcedure
        .input(
            CreateMargesiSchema
        )
        .mutation(async ({ ctx, input }) => {

            const query = ctx.db.insertInto('equipmentmargesi').values({
                id: randomUUID(),
                denomination: input.denomination,
                code: input.code, updatedAt: new Date(),
            })

  
            return query.executeTakeFirst();
        })

})