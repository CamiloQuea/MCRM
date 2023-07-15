import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { CreateDepartmentSchema } from "../validators";
import { randomUUID } from "crypto";


export const departmentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const query = ctx.db.selectFrom('department')
                .selectAll();


            return query.execute()
        }),
    create: protectedProcedure
        .input(CreateDepartmentSchema)
        .mutation(async ({ input: { name }, ctx }) => {

            const query =
                ctx.db.insertInto('department').values({
                    name,
                    id: randomUUID(),
                    updatedAt: new Date(),
                })


            return query.executeTakeFirst();
        })

})