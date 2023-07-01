import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateBrandSchema } from "../validators";


export const equipmentBrandRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async ({ ctx }) => {
        const equipmentBrands = await ctx.prisma.equipmentbrand.findMany();
        return equipmentBrands;
    }),
    create: protectedProcedure
        .input(CreateBrandSchema)
        .mutation(async ({ ctx, input }) => {
            const equipmentBrand = await ctx.prisma.equipmentbrand.create({
                data: input,
            });
            return equipmentBrand;
        })
})