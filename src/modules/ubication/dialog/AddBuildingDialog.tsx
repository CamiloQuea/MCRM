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
import { CreateBuildingSchema } from "@/server/api/validators";
import { api } from "@/utils/trpc";
import React, { useState } from "react";
import { z } from "zod";
import { CirclePicker } from "react-color";
import { Label } from "@/modules/common/components/ui/label";
import { X } from "lucide-react";
export const AddBuildingDialog = ({
  Trigger,
}: {
  Trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const form = useZodForm({
    schema: CreateBuildingSchema.extend({
      multiple: z.boolean().default(false),
    }),
    defaultValues: {
      multiple: false,
      name: "",
    },
  });

  const { building } = api.useContext();

  const { mutate } = api.building.create.useMutation({
    onSettled: () => {
      setOpen(false);
      building.getAll.invalidate();
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
          <DialogTitle>Agregar edificaci&oacute;n</DialogTitle>
          <DialogDescription>Ingresa una marca en el sistema</DialogDescription>
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
              <div>
                <Label>Color</Label>
                <div className="flex my-3">
                  <CirclePicker
                    width="100%"
                    className="justify-around"
                    onChange={({ hex }) => {
                      form.setValue("colorHex", hex);
                    }}
                  />
                </div>

                <div
                  className="group w-full h-5 rounded-md mt-3 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: form.watch("colorHex") || "",
                  }}
                  onClick={() => {
                    form.setValue("colorHex", null);
                  }}
                >
                  {form.getValues("colorHex") && (
                    <X
                      className="h-4 w-4   text-transparent
                transition-colors
                duration-200
                group-hover:text-inherit"
                    />
                  )}
                </div>
              </div>
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
