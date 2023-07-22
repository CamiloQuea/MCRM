
import { z } from "zod";
import {
  createTRPCRouter,

  protectedProcedure,
} from "../trpc";

const equipmentData = z.object({
  codeBar: z.string().optional(),
  serialNumber: z.string().optional(),
  internalCode: z.string().optional(),
  admissionDate: z.coerce.date()
})

export const equipmentSheetRouter = createTRPCRouter({
  

});
