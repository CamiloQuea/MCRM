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