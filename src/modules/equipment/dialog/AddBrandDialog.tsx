import { Input } from "@/modules/common/components/ui/input";

import { Button } from "@/modules/common/components/ui/button";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/modules/common/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/modules/common/components/ui/form";
import { useToast } from "@/modules/common/components/ui/use-toast";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { CreateBrandSchema } from "@/server/api/validators";
import { api } from "@/utils/trpc";
import { useState } from "react";
import { z } from "zod";

type AddBrandDialogProps = {
  Trigger: React.ReactNode;
};

export const AddBrandDialog = ({ Trigger }: AddBrandDialogProps) => {
  const { toast } = useToast();

  const { equipmentBrand } = api.useContext();

  const [open, setOpen] = useState(false);

  const { mutate } = api.equipmentBrand.create.useMutation({
    onSettled: () => {
      equipmentBrand.getAll.invalidate();
      if (form.getValues("multiple")) {
        form.reset({
          multiple: true,
        });
        return;
      }
      setOpen(false);
      form.reset();
    },
    onSuccess: () => {
      toast({
        title: "Marca agregada",
        description: "La marca se agregó correctamente",
      });
    },
  });

  const form = useZodForm({
    schema: CreateBrandSchema.extend({
      multiple: z.boolean().optional(),
    }),
    defaultValues: {
      name: "",
      multiple: false,
    },
  });

  const onSubmit = form.handleSubmit(async (name) => {
    mutate(name);
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
      <DialogContent className="max-w-[425px] ">
        <DialogTitle>Añadir marca</DialogTitle>
        <DialogDescription>Ingresa una marca en el sistema</DialogDescription>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Generica" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 mt-4 flex-wrap">
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

                    <FormLabel>¿Desea varias marcas?</FormLabel>
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
