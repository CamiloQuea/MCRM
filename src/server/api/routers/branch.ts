import { z } from "zod";
import {
    caslMiddleware,
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";


export const branchRouter = createTRPCRouter({

    getAll: protectedProcedure
        .input(z.object({
            count: z.object({
                building: z.boolean().default(false),
            }).optional(),
            where: z.object({
                name: z.string().nullable().optional(),
            }).optional()
        }).optional())
        .query(async ({ ctx, input }) => {

            const buildings = await ctx.prisma.branch.findMany({
                include: {
                    _count: input?.count ? {
                        select: {
                            buildings: input.count?.building ? true : false,
                        }
                    } : false
                },
                where: input?.where ? {
                    name: input.where?.name ? {
                        contains: input.where.name
                    } : undefined
                } : undefined
            });
            return buildings;
        }),
    create: protectedProcedure
        .use(caslMiddleware({
            action: 'create',
            subject: 'branch'
        }))
        .input(
            z.object({
                name: z.string(),
                colorHex: z.string().min(4).max(9).regex(/^#/).nullable()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const branch = await ctx.prisma.branch.create({
                data: {
                    name: input.name,
                    hexColor: input.colorHex
                }
            });
            return branch;
        }),
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const branch = await ctx.prisma.branch.findUnique({
            where: {
                id: input.id
            },
            include: {
                _count: {
                    select: {
                        buildings: true
                    }
                }
            }
        });
        return branch;
    }),
})