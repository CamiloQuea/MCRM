import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";

import { jsonObjectFrom } from 'kysely/helpers/mysql'


export const testRouter = createTRPCRouter({
    1: protectedProcedure.query(({ ctx }) => {

        return ctx.db
            .selectFrom('equipment')
            .selectAll('equipment')
            .select((eb) => [
                jsonObjectFrom(eb.selectFrom('equipmentspecificationsheet as sheet')
                    .select(['sheet.id', 'sheet.modelName'])
                    .whereRef('sheet.id', '=', 'equipment.equipmentSpecificationSheetId')
                ).as('specificationSheet')
            ])
            .execute()
    })
})