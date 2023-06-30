import { z } from "zod";
import dotenv from "dotenv";
dotenv.config()

const myEnv = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional().default("development"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  CLERK_SECRET_KEY:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
 
});

const env = myEnv.parse(process.env);

export { env }
