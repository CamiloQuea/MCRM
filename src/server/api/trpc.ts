
import { TRPCError, initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { db, prisma } from '../db';
import superjson from 'superjson'
import { ZodError } from 'zod';
import type {
    SignedInAuthObject,
    SignedOutAuthObject,
} from "@clerk/nextjs/dist/types/api";
import { getAuth } from "@clerk/nextjs/server";

export interface AuthContext {
    auth: SignedInAuthObject | SignedOutAuthObject;
}


export const createContextInner = async ({ auth }: AuthContext) => {
    return {
        auth,
        prisma,
        db
    };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    return await createContextInner({ auth: getAuth(opts.req) });
};

const t = initTRPC
    .context<Awaited<ReturnType<typeof createTRPCContext>>>()
    .create({
        transformer: superjson,
        errorFormatter(opts) {
            const { shape, error } = opts;

            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
                            ? error.cause
                            : null,
                },
            };
        },
    });
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const procedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.auth.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            auth: ctx.auth,
        },
    });
});
export const protectedProcedure = t.procedure.use(isAuthed);

