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
  CreateDepartmentSchema,
} from "@/server/api/validators";
import { api } from "@/utils/trpc";
import React, { useState } from "react";
import { z } from "zod";
import { CirclePicker } from "react-color";
import { Label } from "@/modules/common/components/ui/label";
import { X } from "lucide-react";
export const AddDepartmentDialog = ({
  Trigger,
}: {
  Trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const form = useZodForm({
    schema: CreateDepartmentSchema.extend({
      multiple: z.boolean().default(false),
    }),
    defaultValues: {
      multiple: false,
      name: "",
    },
  });

  const { department } = api.useContext();

  const { mutate } = api.department.create.useMutation({
    onSettled: () => {
      setOpen(false);
      department.getAll.invalidate();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

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
          <DialogTitle>Agregar departamento</DialogTitle>
          <DialogDescription>
            Añade un nuevo departamento al sistema
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
                      <Input placeholder="Emergencia" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
