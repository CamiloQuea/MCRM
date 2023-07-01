
import { z } from "zod";
import {
  createTRPCRouter,

  protectedProcedure,
} from "../trpc";

const equipmentData = z.object({
  codeBar: z.string().optional(),
  serialNumber: z.string().optional(),
  internalCode: z.string().optional(),
  admissionDate: z.coerce.date()
})

export const equipmentSheetRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      equipmentSheetId: z.string().optional(),
      brandId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {


      const equipment = await ctx.prisma.equipmentspecificationsheet.findMany({
        where: {
          id: {
            contains: input.equipmentSheetId
          },
          equipmentBrandId: {
            contains: input.brandId
          },

        },
        include: {
          equipmentBrand: {
            select: {
              name: true
            }
          },
          equipmentMargesi: {
            select: {
              denomination: true,
              code: true,
            }
          },
          _count: {
         
          }

        },


      })

      return equipment;

    }),

  getOne: protectedProcedure
    .input(z.object({
      equipmentSheetId: z.string().optional(),
      equipmentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.equipmentspecificationsheet.findUnique({
        where: {
          id: input.equipmentId
        },

        include: {
          equipmentBrand: {
            select: {
              name: true,
            }
          },
        }


      })

    }),

  create: protectedProcedure
    .input(
      z.discriminatedUnion('mode', [
        z.object({
          mode: z.literal('existing'),
          equipmentSheetId: z.string(),
          equipments: z.array(equipmentData),
        }),
        z.object({
          mode: z.literal('new'),
          equipmentBrandId: z.string(),
          equipmentMargesiCode: z.string(),
          model: z.string(),
          width: z.number().optional(),
          height: z.number().optional(),
          lenght: z.number().optional(),
          equipments: z.array(equipmentData),

        })
      ])

    )
    .mutation(async ({ ctx, input }) => {

      if (input.mode === 'existing') {
        return await ctx.prisma.equipment.createMany({
          data: input.equipments.map(equipment => {
            return {
              equipmentSpecificationSheetId: input.equipmentSheetId,
              codeBar: equipment.codeBar,
              serialNumber: equipment.serialNumber,
              internalCode: equipment.internalCode,

              admissionDate: equipment.admissionDate,
            }
          })
        })
      }

      const sheetFound = await ctx.prisma.equipmentspecificationsheet.create({
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
        data: input.equipments.map(equipment => {
          return {
            equipmentSpecificationSheetId: sheetFound.id,
            codeBar: equipment.codeBar,
            serialNumber: equipment.serialNumber,
            internalCode: equipment.internalCode,

            admissionDate: equipment.admissionDate,
          }
        })
      })


    })

});
