import { randomUUID } from "crypto";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { CreateBrandSchema } from "../validators";


export const equipmentBrandRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async ({ ctx }) => {

        const query = ctx.db.selectFrom('equipmentbrand').selectAll()

        return query.execute()
      
    }),
    create: protectedProcedure
        .input(CreateBrandSchema)
        .mutation(async ({ ctx, input }) => {

            const query = ctx.db.insertInto('equipmentbrand').values({
                id: randomUUID(),
                name: input.name,
                updatedAt: new Date(),
            })


            return query.executeTakeFirst();
        })
})