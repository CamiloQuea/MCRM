import { Button } from "@/modules/common/components/ui/button";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
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
import { Input } from "@/modules/common/components/ui/input";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import {
  CreateBuildingSchema,
  CreateRoomSchema,
} from "@/server/api/validators";
import { api } from "@/utils/trpc";
import React, { useState } from "react";
import { z } from "zod";
import { CirclePicker } from "react-color";
import { Label } from "@/modules/common/components/ui/label";
import { X } from "lucide-react";
import { SelectSingleField } from "@/modules/common/components/SelectSingleField";
export const AddRoomDialog = ({ Trigger }: { Trigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const form = useZodForm({
    schema: CreateRoomSchema.extend({
      multiple: z.boolean().default(false),
      buildingId: z.string().nullable(),
    }),
    defaultValues: {
      multiple: false,
      name: "",
    },
  });

  const { room } = api.useContext();

  const { mutate } = api.room.create.useMutation({
    onSettled: () => {
      setOpen(false);
      room.getAll.invalidate();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  const { data: departmentData } = api.department.getAll.useQuery();

  const { data: buildingData } = api.building.getAll.useQuery();

  const { data: buildingFloorData } = api.buildingFloor.getAll.useQuery();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <div className="space-y-3">
          <DialogTitle>Agregar espacio</DialogTitle>
          <DialogDescription>
            Añade un nuevo espacio en el sistema
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="pt-5 grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Principal" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={() => (
                  <FormItem>
                    <Label>Departamento</Label>
                    <SelectSingleField
                      name="departmentId"
                      control={form.control}
                      options={
                        departmentData?.map((building) => ({
                          label: building.name.toLowerCase(),
                          value: building.id,
                        })) || []
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buildingId"
                render={() => (
                  <FormItem>
                    <Label>Edificaci&oacute;n</Label>
                    <SelectSingleField
                      name="buildingId"
                      control={form.control}
                      options={
                        buildingData?.map((building) => ({
                          label: building.name.toLowerCase(),
                          value: building.id,
                        })) || []
                      }
                      isClearable
                    />
                  </FormItem>
                )}
              />
              {form.watch("buildingId") ? (
                <FormField
                  control={form.control}
                  name="buildingFloorId"
                  render={() => (
                    <FormItem>
                      <Label>Piso</Label>
                      <SelectSingleField
                        name="buildingFloorId"
                        control={form.control}
                        options={
                          buildingFloorData?.map((floor) => ({
                            label: floor.floorNumber.toString(),
                            value: floor.id,
                          })) || []
                        }
                      />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-4 pt-4 flex-wrap">
              <FormField
                control={form.control}
                name="multiple"
                render={({ field }) => (
                  <FormItem className="flex  space-x-3 space-y-0  ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(evt) => field.onChange(Boolean(evt))}
                      />
                    </FormControl>

                    <FormLabel>¿Desea agregar varias?</FormLabel>
                  </FormItem>
                )}
              />

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
