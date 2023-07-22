import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { CreateIncidentReportSchema } from "../validators";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { randomUUID } from "crypto";
import { Expression, SqlBool, sql } from "kysely";


export const incidentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(
            z.object({

                dateRange: z.object({
                    dateStart: z.coerce.date().optional(),
                    dateEnd: z.coerce.date().optional(),
                }).optional(),
                limit: z.number().optional(),

            }).optional()
        )
        .query(async ({ ctx, input }) => {
            let incidentReportQuery = ctx.db.selectFrom('incidentreport').selectAll().orderBy('createdAt', 'desc')

            if (typeof input?.limit !== 'undefined')
                incidentReportQuery = incidentReportQuery.limit(input.limit)

            if (input?.dateRange)
                incidentReportQuery = incidentReportQuery.where((irw) => {
                    const ors = []

                    if (input.dateRange?.dateStart)
                        ors.push(irw('createdAt', '>=', input.dateRange.dateStart))

                    if (input.dateRange?.dateEnd)
                        ors.push(irw('createdAt', '<=', input.dateRange.dateEnd))

                    return irw.and(ors)
                })


            const incidentReport = await incidentReportQuery.execute()

            const users = new Set(incidentReport.map(incidentReport => incidentReport.creatorId))

            const userList = await clerkClient.users.getUserList({
                userId: Array.from(users)
            })

            return incidentReport.map(incidentReport => {
                const user = userList.find(user => user.id === incidentReport.creatorId)
                return {
                    id: incidentReport.id,
                    code: incidentReport.code,
                    description: incidentReport.description,
                    incidentDate: incidentReport.incidentDate,
                    createdAt: incidentReport.createdAt,

                    user: user ? {
                        id: user.id,
                        username: user.username,
                    } : undefined,
                }
            })
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {

            const incidentReport =
                await ctx.db
                    .selectFrom('incidentreport')
                    .selectAll()
                    .select((eb) => [
                        'id',
                        jsonArrayFrom(
                            eb.selectFrom('incidentreportequipment')
                                .select((i) => [
                                    'id',
                                    'description',
                                    jsonObjectFrom(
                                        i.selectFrom('equipment as e')
                                            .select((e) => [
                                                'id',
                                                'serialNumber',
                                                'internalCode',
                                                'codeBar',
                                                'equipmentSpecificationSheetId',
                                                jsonObjectFrom(
                                                    e.selectFrom('equipmentspecificationsheet as s')
                                                        .select((ess) => [
                                                            'id',
                                                            'modelName',
                                                            jsonObjectFrom(ess.selectFrom('equipmentbrand')
                                                                .select([
                                                                    'id',
                                                                    "name"
                                                                ])
                                                                .whereRef('equipmentbrand.id', '=', 's.equipmentBrandId'))
                                                                .as('equipmentBrand'),
                                                            jsonObjectFrom(ess.selectFrom('equipmentmargesi')
                                                                .select([
                                                                    'id',
                                                                    'code',
                                                                    'denomination'
                                                                ])
                                                                .whereRef('equipmentmargesi.id', '=', 's.equipmentMargesiId'))
                                                                .as('equipmentMargesi')
                                                        ])
                                                        .whereRef('s.id', '=', 'e.equipmentSpecificationSheetId')
                                                ).as('equipmentSpecificationSheet')
                                            ])
                                            .whereRef('e.id', '=', 'incidentreportequipment.equipmentId')
                                    ).as('equipment'),
                                ])
                                .whereRef('incidentreportequipment.incidentReportId', '=', 'incidentreport.id')
                        ).as('incidentreportequipment'),
                    ])
                    .where('id', '=', input.id).executeTakeFirst()


            if (!incidentReport) return;



            const user = await clerkClient.users.getUser(incidentReport.creatorId)

            return {
                // id: incidentReport.id,
                // code: incidentReport.code,
                // description: incidentReport.description,
                // incidentDate: incidentReport.incidentDate,
                // createdAt: incidentReport.createdAt,

                user: {
                    id: user.id,
                    username: user.username,
                },
                ...incidentReport
            }
        }),

    create: protectedProcedure
        .input(
            CreateIncidentReportSchema
        )
        .mutation(({ ctx, input }) => {
            // console.log(input)
            // return;

            return ctx.db.transaction().execute(async (trx) => {

                const incidentReportId = randomUUID()

                const incidentReport = await trx
                    .insertInto('incidentreport')
                    .values({
                        code: input.code,
                        description: input.description,
                        incidentDate: input.incidentDate,
                        creatorId: ctx.auth.userId,
                        id: incidentReportId
                    })
                    .executeTakeFirstOrThrow()



                await trx.insertInto('incidentreportequipment').values(input.equipmentDetail.map(equipmentDetail => {
                    return {
                        equipmentId: equipmentDetail.equipmentId,
                        description: equipmentDetail.description,
                        incidentReportId: incidentReportId,
                        id: randomUUID(),
                        updatedAt: new Date(),
                    }
                })).execute()

                return incidentReport
            })
        }),
    getCountByDay: protectedProcedure
        .input(z.object({
            //fechas limites
            dateRange: z.object({
                dateStart: z.coerce.date().optional(),
                dateEnd: z.coerce.date().optional(),
            }).optional()
        }).optional())
        .query(async ({ ctx, input }) => {
            let incidentReportCount = ctx.db
                .selectFrom('incidentreport')
                .select((ir) => [
                    ir.fn.countAll<number>().as('count'),
                    sql<Date>`date(createdAt)`.as('date')
                ])
                .groupBy('date')

            if (typeof input === 'undefined')
                return incidentReportCount.execute()


            if (input.dateRange)
                incidentReportCount = incidentReportCount.where((irw) => {
                    const ors = []

                    if (input.dateRange?.dateStart)
                        ors.push(irw('createdAt', '>=', input.dateRange.dateStart))

                    if (input.dateRange?.dateEnd)
                        ors.push(irw('createdAt', '<=', input.dateRange.dateEnd))

                    return irw.and(ors)
                })



            return incidentReportCount.execute()
        })
})