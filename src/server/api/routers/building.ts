import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateBuildingSchema } from "../validators";


export const buildingRouter = createTRPCRouter({

    getAll: protectedProcedure
        .input(
            z.object({
                count: z.object({
                    floors: z.boolean().optional()
                }).optional(),
                include: z.object({
                    branchName: z.boolean().optional()
                }).optional(),
                where: z.object({
                    name: z.string().optional(),
                    branchId: z.string().optional().nullable()
                }).optional()
            }).optional()
        )
        .query(async ({ ctx, input }) => {

            const buildings = await ctx.prisma.building.findMany({

                where: {
                    name: {
                        contains: input?.where?.name
                    },
                    branchId: typeof input?.where?.branchId !== 'undefined' || input?.where?.branchId === null ? input.where.branchId : undefined
                }
            });


            return buildings;
        }),

    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                where: z.object({

                }).optional(),
                count: z.object({
                    floors: z.boolean().optional()
                }).optional(),
            })

        )
        .query(async ({ ctx, input }) => {
            const building = await ctx.prisma.building.findUnique({
                where: {
                    id: input.id
                },

            });
            return building;
        }),

    create: protectedProcedure

        .input(
            CreateBuildingSchema
        )
        .mutation(async ({ ctx, input }) => {
            const building = await ctx.prisma.building.create({
                data: {
                    name: input.name,
                    branchId: input.branchId,
                    hexColor: input.colorHex,
                }
            });
            return building;
        }),
})