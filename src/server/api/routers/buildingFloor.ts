import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { randomUUID } from "crypto";


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

            let query =
                ctx.db.selectFrom('buildingfloor').selectAll().orderBy('floorNumber', 'desc');

            if (typeof input?.where?.buildingId !== 'undefined')
                query = query.where('buildingId', '=', input?.where?.buildingId)

            return query.execute();

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


            const transaction = await ctx.db.transaction().execute(async (trx) => {

                const limitFloor = await trx.selectFrom('buildingfloor')
                    .selectAll()
                    .where('buildingId', '=', input.buildingId)
                    .orderBy('floorNumber', input.mode === "up" ? 'desc' : 'asc')
                    .executeTakeFirst();

                if (typeof limitFloor === 'undefined')
                    return await trx.insertInto('buildingfloor').values({
                        buildingId: input.buildingId,
                        floorNumber: 1,
                        id: randomUUID(),
                    }).executeTakeFirst();

                const newBuildingFloor = await trx.insertInto('buildingfloor').values({
                    buildingId: input.buildingId,
                    floorNumber: input.mode === "up" ? limitFloor.floorNumber + 1 : limitFloor.floorNumber - 1,
                    id: randomUUID(),
                }).executeTakeFirst();

                return newBuildingFloor;
            })


            return transaction;
        })

})