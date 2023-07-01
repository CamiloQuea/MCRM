
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { getEquipmentLocalizationPromise } from "../services/equipment.service";
import {
    protectedProcedure, createTRPCRouter,
} from "../trpc";
import { CreateEquipmentSchema, GetAllEquipmentSchema } from "../validators";

const equipmentData = z.object({
    codeBar: z.string().optional(),
    serialNumber: z.string().optional(),
    internalCode: z.string().optional(),
    admissionDate: z.date()
})



export const equipmentRouter = createTRPCRouter({
    getAll: protectedProcedure

        .input(GetAllEquipmentSchema)
        .query(async ({ ctx, input }) => {


            const equipment = await ctx.prisma.equipment.findMany({
                where: {
                    OR: [
                        {
                            codeBar: {
                                contains: input?.search || ''
                            }
                        },
                        {
                            internalCode: {
                                contains: input?.search || ''
                            }
                        },
                    ]

                },
                orderBy: {
                    admissionDate: 'desc'
                },
                include: {
                    equipmentSpecificationSheet: {
                        include: {
                            equipmentBrand: true,
                            equipmentMargesi: true
                        }
                    }
                }
            })





            return equipment;

        }),

    // getCount: protectedProcedure

    //     .input(z.object({
    //         equipmentId: z.string().optional(),
    //         brandId: z.string().optional(),
    //         buildingId: z.string().optional(),
    //     }))
    //     .query(async ({ ctx, input }) => {
    //         return await ctx.prisma.equipment.count({
    //             where: {
    //                 equipmentTracking: {
    //                     every: {
    //                         room: {
    //                             buildingfloor: {
    //                                 building: {
    //                                     id: {
    //                                         contains: input.buildingId
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    //     }),

    create: protectedProcedure
        .input(
            CreateEquipmentSchema

        )
        .mutation(async ({ ctx, input }) => {

            const sheet = await ctx.prisma.equipmentspecificationsheet.findFirst({
                where: {
                    equipmentBrandId: input.equipmentBrandId,
                    equipmentMargesiId: input.equipmentMargesiCode,
                    modelName: input.model,
                    width: input.width,
                    height: input.height,
                    length: input.lenght,
                }
            })

            let sheetFound = sheet

            if (!sheet)
                sheetFound = await ctx.prisma.equipmentspecificationsheet.create({
                    data: {
                        equipmentBrandId: input.equipmentBrandId,
                        equipmentMargesiId: input.equipmentMargesiCode,
                        modelName: input.model,
                        width: input.width,
                        height: input.height,
                        length: input.lenght,
                    }
                })

            return await ctx.prisma.equipment.createMany({
                data: {
                    codeBar: input.codeBar,
                    serialNumber: input.serialNumber,
                    internalCode: input.internalCode,
                    admissionDate: input.admissionDate,
                    equipmentSpecificationSheetId: sheetFound?.id
                }
            })


        }),

    // getOne: protectedProcedure
    //     .input(z.object({
    //         equipmentId: z.string(),
    //     }))
    //     .query(async ({ ctx, input }) => {
    //         return await ctx.prisma.equipment.findUnique({
    //             where: {
    //                 id: input.equipmentId
    //             },
    //             include: {
    //                 equipmentSpecificationSheet: {
    //                     include: {
    //                         equipmentBrand: true,
    //                         equipmentMargesi: true

    //                     }

    //                 },

    //             }
    //         })
    //     }),

    // getLocalization: protectedProcedure.
    //     input(z.object({
    //         equipmentId: z.string(),
    //     }))
    //     .query(async ({ ctx, input }) => {
    //         return getEquipmentLocalizationPromise({ prisma: ctx.prisma, input })
    //     }),
    // getTrackingHistory: protectedProcedure.
    //     input(z.object({
    //         equipmentId: z.string(),
    //     }))
    //     .query(async ({ ctx, input }) => {
    //         return {}
    //         const tracking = await ctx.prisma.equipmenttracking.findMany({
    //             where: {
    //                 equipmentId: input.equipmentId
    //             },
    //             include: {
    //                 room: true,
    //                 equipment: {
    //                     include: {
    //                         equipmentspecificationsheet: {
    //                             include: {
    //                                 equipmentbrand: true,
    //                                 equipmentmargesi: true
    //                             }
    //                         }
    //                     },
    //                 },
    //                 department: true,
    //             },
    //             orderBy: {
    //                 createdAt: 'desc'
    //             }
    //         })

    //         const usersList = await clerkClient.users.getUserList({
    //             userId: tracking.map(tracking => tracking.userId)
    //         })

    //         return tracking.map(tracking => {
    //             return {
    //                 ...tracking,
    //                 username: usersList.find(user => user.id === tracking.userId)?.username
    //             }
    //         })
    //     }),
    // relocate: protectedProcedure
    //     .input(z.object({
    //         equipmentId: z.string(),
    //         roomId: z.string(),
    //         description: z.string().optional(),
    //         departmentId: z.string().optional(),
    //     }))
    //     .mutation(async ({ ctx, input }) => {
    //         return await ctx.prisma.equipmenttracking.create({
    //             data: {
    //                 equipmentId: input.equipmentId,
    //                 roomId: input.roomId,

    //                 description: input.description,
    //                 date: new Date(),
    //                 id: 

    //             }
    //         })
    //     })


})