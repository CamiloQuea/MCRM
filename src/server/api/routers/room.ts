import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateRoomSchema } from "../validators";
import { randomUUID } from "crypto";
import { jsonObjectFrom } from "kysely/helpers/mysql";



export const roomRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z.object({
                include: z.object({
                    building: z.boolean().optional(),
                    branch: z.boolean().optional(),
                }).optional(),
                where: z.object({
                    name: z.string().optional(),
                    buildingFloorId: z.string().optional()
                }).optional()

            }).optional()
        )
        .query(async ({ ctx, input }) => {

            let query = ctx.db.selectFrom('room').select((r) => [
                'id',
                'name',
                'buildingFloorId',
                'departmentId',
                'updatedAt',
                'createdAt',
                jsonObjectFrom(
                    r.selectFrom('buildingfloor').select((bf) => ['id',
                        'name',
                        jsonObjectFrom(
                            bf.selectFrom('building').select((b) => ['id', 'name',]).whereRef('building.id', '=', 'buildingfloor.buildingId')
                        ).as('building'),
                    ]).whereRef('buildingfloor.id', '=', 'room.buildingFloorId')
                ).as('buildingFloor'),
            ])

            if (typeof input?.where?.name !== 'undefined')
                query = query.where('name', 'like', input?.where?.name)

            if (typeof input?.where?.buildingFloorId !== 'undefined')
                query = query.where('buildingFloorId', '=', input?.where?.buildingFloorId)


            return query.execute();
        }),
    create: protectedProcedure

        .input(CreateRoomSchema)
        .mutation(async ({ ctx, input }) => {

            const query =
                ctx.db.insertInto('room').values({
                    name: input.name,
                    buildingFloorId: input.buildingFloorId,
                    departmentId: input.departmentId,
                    id: randomUUID(),
                    updatedAt: new Date(),
                })


            return query.executeTakeFirst();
        })

})