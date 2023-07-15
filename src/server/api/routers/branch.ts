import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { randomUUID } from "crypto";


export const branchRouter = createTRPCRouter({

    getAll: protectedProcedure
        .input(z.object({
            count: z.object({
                building: z.boolean().default(false),
            }).optional(),
            where: z.object({
                name: z.string().nullable().optional(),
            }).optional()
        }).optional())
        .query(async ({ ctx, input }) => {

            let query =
                ctx.db.selectFrom('branch').selectAll();


            if (typeof input?.where?.name !== 'undefined')
                query = query.where('name', 'like', input?.where?.name)

            return query.execute();
        }),
    create: protectedProcedure

        .input(
            z.object({
                name: z.string(),
                colorHex: z.string().min(4).max(9).regex(/^#/).nullable()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const query =
                ctx.db.insertInto('branch').values({
                    name: input.name,
                    hexColor: input.colorHex,
                    id: randomUUID(),
                    updatedAt: new Date(),
                })

            return query.executeTakeFirst();
        }),
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        let query =
            ctx.db.selectFrom('branch').selectAll();

        if (typeof input.id !== 'undefined')
            query = query.where('id', '=', input.id)

        return query.executeTakeFirst();
    }),
})