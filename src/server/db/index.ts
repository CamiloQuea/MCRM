

import { env } from "../../env";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./types";


BigInt.prototype.toJSON = function () {
  return this.toString();
};




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

