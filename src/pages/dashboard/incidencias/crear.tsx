import { Button } from "@/modules/common/components/ui/button";
import { Calendar } from "@/modules/common/components/ui/calendar";
import { DatePicker } from "@/modules/common/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/common/components/ui/form";
import { Input } from "@/modules/common/components/ui/input";
import { Label } from "@/modules/common/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/modules/common/components/ui/radio-group";
import { Separator } from "@/modules/common/components/ui/separator";
import { Textarea } from "@/modules/common/components/ui/textarea";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { cn } from "@/modules/common/lib/utils";
import { SelectEquipmentDialog } from "@/modules/equipment/dialog/SelectEquipmentDialog";
import { CreateIncidentReportSchema } from "@/server/api/validators";
import { api } from "@/utils/trpc";
import { Arrow } from "@radix-ui/react-popover";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Delete,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";

const CrearIncidencia = () => {
  const { push } = useRouter();

  const form = useZodForm({
    schema: CreateIncidentReportSchema.extend({
      equipmentDetail: CreateIncidentReportSchema.shape.equipmentDetail.element
        .merge(
          z.object({
            denomination: z.string(),
            equipmentBrand: z.string(),
            equipmentModel: z.string(),
          })
        )
        .array()
        .nonempty({
          message: "Debe agregar al menos un equipo",
        }),
    }),
    defaultValues: {
      code: "",
      incidentDate: new Date(),
      description: "",
    },
  });

  const {
    prepend,
    fields: equipmentDetailFields,
    remove,
    move,
  } = useFieldArray({
    control: form.control,
    name: "equipmentDetail",
  });

  const { data } = api.incidentStatusType.getAll.useQuery();

  const { mutate, isLoading } = api.incident.create.useMutation({
    onSuccess: () => {
      push("/dashboard/incidencias");
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  return (
    <DashboardShell>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className=" container py-6">
            <div className="flex justify-between items-center  gap-3">
              <h1 className="text-2xl font-bold">Crear Incidencia</h1>
              <Button className="flex gap-2" disabled={isLoading}>
                <Save className="dark:text-neutral-700 h-5 w-5" />
                <span className="font-medium hidden sm:block">Crear</span>
              </Button>
            </div>
            <div className="gap-y-0 gap-x-5 py-5 grid items-center">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Codigo</FormLabel>
                    <FormControl>
                      <Input placeholder="Codigo" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Fecha de incidente</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Fecha de incidente</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(data) => {
                            if (typeof data === "undefined") return;
                            field.onChange(data);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2">
                    <FormLabel>Descripci&oacute;n</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                {data?.length !== 0 ? (
                  <FormField
                    control={form.control}
                    name="statusTypeId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Notify me about...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            className="flex flex-wrap"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            {data?.map((type) => (
                              <div
                                className="flex items-center space-x-2"
                                key={type.id}
                              >
                                <RadioGroupItem
                                  value={type.id}
                                  id={`optiontype-${type.id}`}
                                />
                                <Label htmlFor={`optiontype-${type.id}`}>
                                  {type.name}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </div>
            </div>
            <Separator />

            <div className="flex items-center justify-between my-6 flex-wrap">
              <h2 className="text-2xl  mb-3 font-bold ">Equipos afectados</h2>
              <SelectEquipmentDialog
                Trigger={<Button type="button">Añadir Equipo</Button>}
                onSelect={(equipment) => {
                  if (
                    equipmentDetailFields.find(
                      (field) => field.equipmentId === equipment.id
                    )
                  )
                    return;

                  prepend({
                    equipmentId: equipment.id,
                    description: "",
                    denomination:
                      equipment.equipmentSpecificationSheet?.equipmentMargesi
                        ?.denomination || "Sin denominación",
                    equipmentBrand:
                      equipment.equipmentSpecificationSheet?.equipmentBrand
                        ?.name || "Sin marca",
                    equipmentModel:
                      equipment.equipmentSpecificationSheet?.modelName ||
                      "Sin modelo",
                  });
                }}
              />
            </div>
            <div className="mt-5 flex flex-col gap-3 border rounded-xl divide-y-[1px] px-5">
              {equipmentDetailFields.map((field, index) => (
                <div
                  key={field.id}
                  className=" py-6 px-2 pb-5 flex flex-row   "
                >
                  <div className="flex-1">
                    <div className="uppercase font-semibold text-sm mb-4">
                      <span>{field.denomination} </span>-{" "}
                      <span>{field.equipmentBrand} </span>-{" "}
                      <span>{field.equipmentModel} </span>
                      
                    </div>
                    <div>
                      {/* <Label className="text-xl font-bold block mb-2">
                    Descripción
                  </Label> */}
                      <Textarea
                        placeholder="Descripción"
                        className="col-span-1 sm:col-span-2"
                        name={`equipmentDetail[${index}].description`}
                      />
                    </div>
                  </div>
                  <div className=" gap-2 ml-2 h-full flex flex-col justify-start items-center">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        move(index, index - 1);
                      }}
                    >
                      <ArrowUp />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (index === equipmentDetailFields.length - 1) return;
                        move(index, index + 1);
                      }}
                    >
                      <ArrowDown />
                    </button>
                  </div>
                </div>
              ))}

              {equipmentDetailFields.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32">
                  <span className="dark:text-neutral-400 text-neutral-500 block">
                    No hay equipos agregados
                  </span>
                  {form.formState.errors.equipmentDetail && (
                    <span className="dark:text-red-400 font-medium text-red-500 block">
                      {form.formState.errors.equipmentDetail.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </DashboardShell>
  );
};

export default CrearIncidencia;
