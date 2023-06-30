import { z } from "zod";
import {

    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { CreateDepartmentSchema } from "../validators";


export const departmentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const departments = await ctx.prisma.department.findMany({})

            return departments
        }),
    create: protectedProcedure
        .input(CreateDepartmentSchema)
        .mutation(async ({ input: { name }, ctx }) => {

            const department = await ctx.prisma.department.create({
                data: {
                    name
                }
            })

            return department
        })

})