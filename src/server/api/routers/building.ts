import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateBuildingSchema } from "../validators";
import { randomUUID } from "crypto";
import { startOfWeek } from "date-fns";


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

            let query = ctx.db.selectFrom('building').select(['name', 'id', 'hexColor']);

            const name = input?.where?.name;

            if (typeof name !== 'undefined') {

                query = query.where((eb) => eb.and([
                    eb('name', '=', name)
                ]))
            }

            return query.execute();

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

            const query = ctx.db
                .selectFrom('building')
                .select(['name', 'id', 'hexColor'])
                .where((eb) => eb.and([
                    eb('id', '=', input.id)
                ]))

            return query.executeTakeFirst()
        }),
    getMetadata: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {

            // const query = ctx.db
            //     .selectFrom('building')
            //     .select(({
            //         selectFrom,
            //         fn
            //     })=>[
            //          selectFrom('equipment')
            //         .select((eb)=>[
            //             eb.selectFrom('equipmenttracking')
            //             .select((et)=>[
            //                 et.selectFrom('room')
            //                 .select((r)=>[
            //                     r.selectFrom('buildingfloor')
            //                     .select((bf)=>['id'])
            //                     .whereRef('room.buildingFloorId','=','buildingfloor.id')
            //                     .where('buildingfloor.buildingId','=',input.id)
            //                     .as('floorCount')
            //                 ])
            //                 .whereRef('equipmenttracking.roomId','=','room.id')

            //                 .as('roomCount')
            //             ])
            //             .whereRef('equipmenttracking.equipmentId','=','equipment.id')

            //             .as('equipmentTrackingCount')
            //         ])
            //         .as('equipmentCount'),
            //         fn.count('').as('equipmentCount'),

            //     ])
            //     .where((eb) => eb.and([
            //         eb('id', '=', input.id)
            //     ]))

            const query = ctx.db.selectFrom('equipment').select((eb) => [
                eb.fn.countAll().as('equipmentCount'),
                eb.selectFrom('equipment').where('admissionDate', '>=', startOfWeek(new Date(), {
                    weekStartsOn: 1
                })).select((e) => e.fn.countAll().as('equipmentCountThisWeek')).as('equipmentCountThisWeek')
            ]).where((eb) => eb.and([
                eb.exists(
                    eb.selectFrom('equipmenttracking')
                        .select('id')
                        .whereRef('equipmenttracking.equipmentId', '=', 'equipment.id')
                        .where((et) => et.and([
                            et.exists(
                                et.selectFrom('room')
                                    .select('id')
                                    .whereRef('room.id', '=', 'equipmenttracking.roomId')
                                    .where((r) => r.and([
                                        r.exists(
                                            r.selectFrom('buildingfloor')
                                                .select('id')
                                                .whereRef('buildingfloor.id', '=', 'room.buildingFloorId')
                                                .where('buildingfloor.buildingId', '=', input.id)
                                        )
                                    ]))
                            )
                        ]))
                ),
            ]))

            return query.executeTakeFirst()
        }),

    create: protectedProcedure
        .input(
            CreateBuildingSchema
        )
        .mutation(async ({ ctx, input }) => {
            const building =
                ctx.db.insertInto('building').values({
                    name: input.name,
                    branchId: input.branchId,
                    hexColor: input.colorHex,
                    updatedAt: new Date(),
                    id: randomUUID()
                }).executeTakeFirst()
 
            return building;
        }),
})