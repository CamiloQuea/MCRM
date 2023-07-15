import { SelectSingleField } from "@/modules/common/components/SelectSingleField";
import { Button } from "@/modules/common/components/ui/button";
import { Calendar } from "@/modules/common/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/common/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import { Textarea } from "@/modules/common/components/ui/textarea";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { cn } from "@/modules/common/lib/utils";
import { UpdateEquipmentPositionSchema } from "@/server/api/validators";
import { api } from "@/utils/trpc";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";
import { z } from "zod";

type ChangePositionEquipmentDialogProps = {
  Trigger: React.ReactNode;
  equipmentId: string;
};

export const UpdateEquipmentPositionDialog = ({
  Trigger,
  equipmentId,
}: ChangePositionEquipmentDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useZodForm({
    schema: UpdateEquipmentPositionSchema.extend({
      buildingId: z.string().nullable(),
      buildingFloorId: z.string().nullable(),
    }),
    defaultValues: {
      buildingId: null,
      buildingFloorId: null,
      date: new Date(),
    },
  });

  const { equipment } = api.useContext();

  const { mutate } = api.equipment.updatePosition.useMutation({
    onSettled: () => {
      equipment.getTrackingHistory.invalidate();
    },
    onSuccess: () => {
      setIsOpen(false);
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  const { data: dataBuilding } = api.building.getAll.useQuery(undefined, {});
  const { data: dataFloor } = api.buildingFloor.getAll.useQuery(
    {
      where: {
        buildingId: form.watch("buildingId"),
      },
    },
    {
      enabled: !!form.watch("buildingId"),
    }
  );

  const { data: dataRoom } = api.room.getAll.useQuery(
    {
      where: {
        buildingFloorId: form.watch("buildingFloorId") as string,
      },
    },
    {
      enabled: !!form.watch("buildingFloorId"),
    }
  );

  useEffect(() => {
    form.setValue("equipmentId", equipmentId);
  }, [equipmentId, form]);

  return (
    <Dialog open={isOpen} onOpenChange={
      (open) => {
        if (!open) {
          form.reset();
        }
        setIsOpen(open);
      }
    }>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Reposicionar equipo</DialogTitle>
        <DialogDescription>
          Translada el equipo a otra ubicación
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={onSubmit} className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <FormItem className="w-full">
                <FormLabel>Edificaci&oacute;n</FormLabel>
                <SelectSingleField
                  isClearable
                  name="buildingId"
                  placeholder="Seleccionar edificaci&oacute;n"
                  control={form.control}
                  options={
                    dataBuilding?.map((brand) => ({
                      value: brand.id,
                      label: brand.name,
                    })) || []
                  }
                />
                <FormMessage />
              </FormItem>
              <FormItem className="w-full">
                <FormLabel>Piso</FormLabel>
                <SelectSingleField
                  isClearable
                  name="buildingFloorId"
                  placeholder="Seleccionar el piso"
                  control={form.control}
                  isDisabled={!form.watch("buildingId")}
                  noOptionsMessage={() => "No hay pisos en esta edificación"}
                  options={
                    dataFloor?.map((brand) => ({
                      value: brand.id,
                      label: brand.floorNumber.toString(),
                    })) || []
                  }
                />
                <FormMessage />
              </FormItem>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
              <FormItem className="w-full">
                <FormLabel>Espacio</FormLabel>
                <SelectSingleField
                  isClearable
                  name="roomId"
                  placeholder="Seleccionar el espacio"
                  control={form.control}
                  isDisabled={!form.watch("buildingFloorId")}
                  noOptionsMessage={() => "No hay espacios en este piso"}
                  options={
                    dataRoom?.map((room) => ({
                      value: room.id,
                      label: room.name,
                    })) || []
                  }
                />
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name="date"
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
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2">
                    <FormLabel>Descripci&oacute;n</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <Button
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                Limpiar
              </Button>
              <Button type="submit" className="ml-auto">
                Agregar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
