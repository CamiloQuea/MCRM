import { z } from "zod";

export const CreateBrandSchema = z.object({
  name: z
    .string()
    .min(3, "Tiene que tener al menos 3 caracterés")
    .max(255, "255 caracteres como máximo")
    .nonempty("No puede estar vacío"),
});

export type CreateBrand = z.infer<typeof CreateBrandSchema>;

export const CreateMargesiSchema = z.object({
  denomination: z
    .string()
    .min(3, "Tiene que tener al menos 3 caracterés")
    .max(255, "255 caracteres como máximo")
    .nonempty("No puede estar vacío"),
  code: z
    .string()
    .min(9, "Tiene que tener al menos 9 caracterés")
    .max(9, "9 caracteres como máximo")
    .nonempty("No puede estar vacío"),
});

export type CreateMargesi = z.infer<typeof CreateMargesiSchema>;

export const EquipmentBasicInfoSchema = z.object({
  codeBar: z.string().optional(),
  serialNumber: z.string().optional(),
  internalCode: z.string().optional(),
  admissionDate: z.coerce.date(),
});

export const CreateEquipmentSchema = z
  .object({
    equipmentBrandId: z.string(),
    equipmentMargesiCode: z.string(),
    margesiCode: z.string(),
    model: z.string(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    lenght: z.coerce.number().optional(),
  })
  .merge(EquipmentBasicInfoSchema);

export type CreateEquipment = z.infer<typeof CreateEquipmentSchema>;


export const CreateBuildingSchema = z.object({
  name: z.string(),
  branchId: z.string().nullable().optional(),
  colorHex: z.string().nullable().optional()
})

export const GetAllEquipmentSchema = z.object({
  search: z.string().optional(),
  equipmentId: z.string().optional(),
  brandId: z.string().optional().nullable(),
  where: z.object({
    sheetId: z.string().optional(),
  }).optional(),
}).optional()

export const CreateDepartmentSchema = z.object({
  name: z.string(),
})

export const CreateRoomSchema = z.object({
  name: z.string().nonempty('Tiene que tener al menos un caracter'),
  buildingFloorId: z.string(),
  departmentId: z.string().optional(),
})

export const CreateIncidentReportSchema = z.object({
  code: z.string({
    required_error: "Requerido",
  }).nonempty("Requerido"),
  description: z.string().optional(),
  incidentDate: z.coerce.date({
    errorMap: (error) => {
      console.log(error)
      if (error.code === 'invalid_date') {
        return {
          message: 'La fecha no es válida'
        }
      }

      return {
        message: 'Verifique la fecha'
      }
    }
  }),
  equipmentDetail: z.array(z.object({
    equipmentId: z.string(),
    description: z.string(),
  })).nonempty('Debe agregar al menos un equipo'),
  statusTypeId: z.string().optional(),
})

export type CreateIncidentReport = z.infer<typeof CreateIncidentReportSchema>;


export const UpdateEquipmentPositionSchema = z.object({
  equipmentId: z.string(),
  roomId: z.string(),
  description: z.string().optional(),
  date: z.coerce.date({
    errorMap: (error) => {
      console.log(error)
      if (error.code === 'invalid_date') {
        return {
          message: 'La fecha no es válida'
        }
      }

      return {
        message: 'Verifique la fecha'
      }
    }
  }),
})