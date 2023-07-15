import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateMargesiSchema } from "../validators";


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
            const branch = await ctx.prisma.equipmentmargesi.create({
                data: input
            });
            return branch;
        })

})