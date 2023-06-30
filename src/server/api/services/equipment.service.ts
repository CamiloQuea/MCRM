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
        include: {
            equipment: {
                include: {
                    equipmentSpecificationSheet: {
                        include: {
                            equipmentBrand: true,
                            equipmentMargesi: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc',

        }
    })

}