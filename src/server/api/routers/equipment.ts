
import { z } from "zod";
import { randomUUID } from "crypto";
import { startOfWeek } from "date-fns";
import { jsonObjectFrom } from "kysely/helpers/mysql";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateEquipmentSchema, GetAllEquipmentSchema, UpdateEquipmentPositionSchema } from "../validators";
import { sql } from "kysely";


export const equipmentRouter = createTRPCRouter({

    getMetadata: protectedProcedure.query(async ({ ctx }) => {

        const query = ctx.db.selectFrom('equipment').select((eb) => [
            eb.fn.countAll<number>().as('equipmentCount'),
            eb.selectFrom('equipment').where('admissionDate', '>=', startOfWeek(new Date(), {
                weekStartsOn: 1
            })).select((e) => e.fn.countAll().as('equipmentCountThisWeek')).as('equipmentCountThisWeek')
        ])

        return query.executeTakeFirst()
    }),

    getOne: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const query = ctx.db.selectFrom('equipment').select((eb) => [
                'id',
                'admissionDate',
                'codeBar',
                'createdAt',
                'margesiCode',
                'internalCode',
                'serialNumber',
                jsonObjectFrom(
                    eb.selectFrom('equipmentspecificationsheet')
                        .select((ess) => [
                            'id',
                            'modelName',
                            jsonObjectFrom(ess.selectFrom('equipmentbrand')
                                .select([
                                    'id',
                                    "name"
                                ])
                                .whereRef('equipmentbrand.id', '=', 'equipmentspecificationsheet.equipmentBrandId'))
                                .as('equipmentBrand'),
                            jsonObjectFrom(ess.selectFrom('equipmentmargesi')
                                .select([
                                    'id',
                                    'code',
                                    'denomination'
                                ])
                                .whereRef('equipmentmargesi.id', '=', 'equipmentspecificationsheet.equipmentMargesiId'))
                                .as('equipmentMargesi')
                        ])
                        .whereRef('equipmentspecificationsheet.id', '=', 'equipment.equipmentSpecificationSheetId')
                ).as('equipmentSpecificationSheet')


            ]).where('id', '=', input.id)
            return query.executeTakeFirst()
        }),

    getTrackingHistory: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const query = ctx.db.selectFrom('equipmenttracking').select((eb) => [
                'id',
                'createdAt',
                'equipmentId',
                'description',
                'date',
                'roomId',
                jsonObjectFrom(eb.selectFrom('room').select((r) => [
                    'id',
                    'name',
                    jsonObjectFrom(r.selectFrom('buildingfloor').select((bf) => [
                        'id',
                        'floorNumber',
                        jsonObjectFrom(bf.selectFrom('building').select([
                            'id',
                            'name'
                        ]).whereRef('building.id', '=', 'buildingfloor.buildingId')).as('building')
                    ]).whereRef('buildingfloor.id', '=', 'room.buildingFloorId')).as('buildingFloor')

                ]).whereRef('room.id', '=', 'equipmenttracking.roomId')).as('room'),
            ]).where('equipmentId', '=', input.id).orderBy('date', 'desc')
            return query.execute()
        }),

    getAll: protectedProcedure

        .input(GetAllEquipmentSchema)
        .query(async ({ ctx, input }) => {

            let query = ctx.db.selectFrom('equipment').select((eb) => [
                'id',
                'admissionDate',
                'codeBar',
                'createdAt',
                'margesiCode',
                'internalCode',
                'serialNumber',
                jsonObjectFrom(
                    eb.selectFrom('equipmentspecificationsheet')
                        .select((ess) => [
                            'id',
                            'modelName',
                            jsonObjectFrom(ess.selectFrom('equipmentbrand')
                                .select([
                                    'id',
                                    "name"
                                ])
                                .whereRef('equipmentbrand.id', '=', 'equipmentspecificationsheet.equipmentBrandId'))
                                .as('equipmentBrand'),
                            jsonObjectFrom(ess.selectFrom('equipmentmargesi')
                                .select([
                                    'id',
                                    'code',
                                    'denomination'
                                ])
                                .whereRef('equipmentmargesi.id', '=', 'equipmentspecificationsheet.equipmentMargesiId'))
                                .as('equipmentMargesi')
                        ])
                        .whereRef('equipmentspecificationsheet.id', '=', 'equipment.equipmentSpecificationSheetId')
                ).as('equipmentSpecificationSheet')
            ])
                .orderBy('admissionDate', 'desc')

            if (typeof input?.search !== 'undefined') {
                query = query.where((eb) => eb.or([
                    eb('internalCode', 'like', `%${input?.search}%`),
                    eb('codeBar', 'like', `%${input?.search}%`)
                ]))
            }


            return query.execute();

        }),


    create: protectedProcedure
        .input(
            CreateEquipmentSchema

        )
        .mutation(async ({ ctx, input }) => {

            return await ctx.db.transaction().execute(async (trx) => {

                let sheet = await trx.selectFrom('equipmentspecificationsheet')
                    .selectAll()
                    .where((eb) => {

                        const where = eb('equipmentBrandId', '=', input.equipmentBrandId)
                            .and('equipmentMargesiId', '=', input.margesiCode)
                            .and('modelName', '=', input.model)

                        if (typeof input.model !== 'undefined')
                            where.and('modelName', '=', input.model)

                        if (typeof input.width !== 'undefined')
                            where.and('width', '=', input.width)

                        if (typeof input.height !== 'undefined')
                            where.and('height', '=', input.height)


                        return where
                    }
                    )
                    .executeTakeFirst()


                if (typeof sheet === 'undefined') {
                    await trx.insertInto('equipmentspecificationsheet').values({
                        equipmentBrandId: input.equipmentBrandId,
                        equipmentMargesiId: input.margesiCode,
                        modelName: input.model,
                        width: input.width,
                        height: input.height,
                        lenght: input.lenght,
                        id: randomUUID(),
                        updatedAt: new Date(),

                    }).executeTakeFirst()

                    sheet = await trx.selectFrom('equipmentspecificationsheet').selectAll().executeTakeFirst()
                }

                return await trx.insertInto('equipment').values({
                    id: randomUUID(),
                    admissionDate: input.admissionDate,
                    equipmentSpecificationSheetId: sheet?.id,
                    codeBar: input.codeBar,
                    serialNumber: input.serialNumber,
                    internalCode: input.internalCode,
                    margesiCode: input.equipmentMargesiCode,
                    updatedAt: new Date(),
                }).executeTakeFirst()

            })
        }),

    updatePosition: protectedProcedure
        .input(UpdateEquipmentPositionSchema)
        .mutation(async ({ ctx, input }) => {
            const query = ctx.db.insertInto('equipmenttracking').values({
                id: randomUUID(),
                equipmentId: input.equipmentId,
                roomId: input.roomId,
                date: input.date,
                description: input.description,
                updatedAt: new Date(),
            })

            return query.executeTakeFirst()
        }),

    getCountByDay: protectedProcedure.query(async ({ ctx }) => {
        const query = ctx.db.selectFrom('equipment').select((eb) => [
            eb.fn.countAll<number>().as('count'),
            sql<Date>`createdAt`.as('date')
        ])
            .groupBy('createdAt')

        return query.execute()
    })


})