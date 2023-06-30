import { type PrismaClient } from "@prisma/client";

export const getEquipmentLocalizationPromise = ({ prisma, input }: {
    prisma: PrismaClient,
    input: {
        equipmentId: string
    }
}) => {

    return prisma.equipmentTracking.findFirst({
        where: {
            equipmentId: {
                equals: input.equipmentId
            }
        },
  
        orderBy: {
            createdAt: 'desc',

        }
    })

}