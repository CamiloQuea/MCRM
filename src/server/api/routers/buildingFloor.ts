import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";


export const buildingFloorRouter = createTRPCRouter({

    getAll: protectedProcedure
        .input(
            z.object({
                include: z.object({
                    building: z.boolean().optional().default(true),

                }).optional().default({ building: true }),
                where: z.object({
                    buildingId: z.string().nullable().optional()
                }).optional(),
                count: z.object({
                    rooms: z.boolean().optional().default(false),

                }).optional().default({ rooms: false })

            }).optional()
        )
        .query(async ({ ctx, input }) => {

            const buildingFloors = await ctx.prisma.buildingfloor.findMany({
                where: {
                    buildingId: {
                        equals: input?.where?.buildingId ? input?.where?.buildingId : undefined
                    }
                },
                orderBy: {
                    floorNumber: "desc"
                }


            });
            return buildingFloors;
        }
        ),
    createByMode: protectedProcedure
        .input(
            z.object({
                mode: z.union([
                    z.literal("up"),
                    z.literal("down")
                ]),
                buildingId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {


            const limitFloor = await ctx.prisma.buildingfloor.findMany({
                orderBy: {
                    floorNumber: input.mode === "up" ? "desc" : "asc"
                },
                where: {
                    buildingId: {
                        equals: input.buildingId
                    }
                },
                take: 1
            });

            const newBuildingFloor = await ctx.prisma.buildingfloor.create({
                data: {
                    buildingId: input.buildingId,
                    floorNumber: input.mode === "up" ? limitFloor[0].floorNumber + 1 : limitFloor[0].floorNumber - 1
                }
            })
            return newBuildingFloor;
        })

})