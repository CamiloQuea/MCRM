import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";


export const incidentRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const incidentReport = await ctx.prisma.incidentReport.findMany({
            // include: {
            //     incidentReportRecord: {
            //         orderBy: {
            //             createdAt: 'desc'
            //         },
            //         take: 1,
            //         include: {

            //             incidentReportState: true,
            //         }
            //     },

            // }
        })

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
                // updatedAt: incidentReport.updatedAt,
                user: user ? {
                    id: user.id,
                    username: user.username,
                } : undefined,
                // state: incidentReport.incidentReportRecord[0],
            }
        }
        )


    }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            const incidentReport = await ctx.prisma.incidentReport.findUnique({
                where: {
                    id: input.id
                },
                // include: {
                //     incidentReportRecord: {
                //         orderBy: {
                //             createdAt: 'desc'
                //         },
                //         take: 1,
                //         include: {

                //             incidentReportState: true,
                //         }
                //     },
                //     incidentReportEquipment: {
                //         include: {
                //             equipment: {
                //                 include: {
                //                     equipmentSpecificationSheet: {
                //                         include: {
                //                             equipmentBrand: true,
                //                             equipmentMargesi: true,
                //                         }
                //                     }

                //                 }
                //             }
                //         }
                //     }
                // }
            })

            if (!incidentReport) return;



            const user = await clerkClient.users.getUser(incidentReport.creatorId)

            return {
                id: incidentReport.id,
                code: incidentReport.code,
                description: incidentReport.description,
                incidentDate: incidentReport.incidentDate,
                createdAt: incidentReport.createdAt,

                user: {
                    id: user.id,
                    username: user.username,
                },

            }
        }),

    create: protectedProcedure
        .input(z.object({
            code: z.string(),
            description: z.string(),
            incidentDate: z.coerce.date(),
            equipmentDetail: z.array(z.object({
                equipmentId: z.string(),
                description: z.string(),
            })),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.incidentReport.create({
                data: {
                    code: input.code,
                    description: input.description,
                    incidentDate: input.incidentDate,
                    creatorId: ctx.auth.userId,
                    // userId: ctx.auth.userId,
                    // incidentReportEquipment: {
                    //     create: input.equipmentDetail.map(equipmentDetail => {
                    //         return {
                    //             equipmentId: equipmentDetail.equipmentId,
                    //             description: equipmentDetail.description,

                    //         }
                    //     })
                    // }

                }
            })
        })
})