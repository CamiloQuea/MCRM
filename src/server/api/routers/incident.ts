import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { CreateIncidentReportSchema } from "../validators";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { randomUUID } from "crypto";


export const incidentRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const incidentReport = await ctx.db.selectFrom('incidentreport').selectAll().orderBy('createdAt','desc').execute()

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
                                .select((e) => [
                                    'id',
                                    'description',
                                    jsonObjectFrom(
                                        e.selectFrom('equipment')
                                            .select([
                                                'id',
                                                'serialNumber',
                                                'internalCode',
                                               
                                            
                                                jsonObjectFrom(
                                                    e.selectFrom('equipmentspecificationsheet')
                                                        .select((es) => [
                                                            'id',
                                                            'description',
                                                            'createdAt',
                                                            'updatedAt',
                                                            'modelName',
                                                            jsonObjectFrom(
                                                                es.selectFrom('equipmentmargesi')
                                                                    .select((em) => [
                                                                        'code',
                                                                        'denomination',
                                                                        'createdAt',
                                                                        'updatedAt',
                                                                    ])
                                                                    .whereRef('equipmentspecificationsheet.equipmentBrandId', '=', 'equipmentMargesiId')
                                                            ).as('equipmentMargesi'),
                                                            jsonObjectFrom(
                                                                es.selectFrom('equipmentbrand')
                                                                    .select(() => [
                                                                        'id',
                                                                    
                                                                        'createdAt',
                                                                        'updatedAt',
                                                                        'name'
                                                                    ])
                                                                    .whereRef('equipmentspecificationsheet.equipmentBrandId', '=', 'equipmentBrandId')
                                                            ).as('equipmentBrand'),
                                                        ])
                                                        .whereRef('equipmentspecificationsheet.id', '=', 'equipmentId')

                                                ).as('equipmentSpecificationSheet')
                                            ])
                                            .whereRef('equipment.id', '=', 'incidentreportequipment.equipmentId')
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
            return ctx.db.transaction().execute(async (trx) => {
                const incidentReport = await trx.insertInto('incidentreport').values({
                    code: input.code,
                    description: input.description,
                    incidentDate: input.incidentDate,
                    creatorId: ctx.auth.userId,
                    id: randomUUID()
                }).executeTakeFirst()

                const incidentReportId = incidentReport.insertId

                if (typeof incidentReportId !== 'undefined')

                    await trx.insertInto('incidentreportequipment').values(input.equipmentDetail.map(equipmentDetail => {
                        return {
                            equipmentId: equipmentDetail.equipmentId,
                            description: equipmentDetail.description,
                            incidentReportId: incidentReportId.toString(),
                            id: randomUUID(),
                            updatedAt: new Date(),
                        }
                    })).execute()

                return incidentReport
            })


        })
})