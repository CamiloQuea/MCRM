
import { PrismaClient } from "@prisma/client";
import { env } from "../../env";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./types";


BigInt.prototype.toJSON = function () {
  return this.toString();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  db: Kysely<DB> | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



const dialect = new MysqlDialect({
  pool: createPool({
    uri: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true,
    },

  })
})

export const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (event.level === 'query') {
      console.log(event.query.sql)
      console.log(event.query.parameters)
    }
  }
})

