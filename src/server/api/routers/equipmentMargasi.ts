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
            const branches = await ctx.prisma.equipmentMargesi.findMany();
            return branches;
        }),

    create: protectedProcedure
        .input(
            CreateMargesiSchema
        )
        .mutation(async ({ ctx, input }) => {
            const branch = await ctx.prisma.equipmentMargesi.create({
                data: input
            });
            return branch;
        })

})