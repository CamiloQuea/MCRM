import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";


export const incidentStatusTypeRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        const query = ctx.db.selectFrom('incidentreportstatustype')
            .selectAll()


        return query.execute()

       
    })
})