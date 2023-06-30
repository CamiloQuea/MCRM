import { Input } from "@/modules/common/components/ui/input";

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
import { useToast } from "@/modules/common/components/ui/use-toast";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import {
  CreateBrandSchema,
  CreateMargesiSchema,
} from "@/server/api/validators";
import { api } from "@/utils/trpc";
import { useState } from "react";
import { z } from "zod";

type AddBrandDialogProps = {
  Trigger: React.ReactNode;
};

export const AddMargesiDialog = ({ Trigger }: AddBrandDialogProps) => {
  const { toast } = useToast();

  const { equipmentMargesi } = api.useContext();

  const [open, setOpen] = useState(false);

  const { mutate } = api.equipmentMargesi.create.useMutation({
    onSettled: () => {
      equipmentMargesi.getAll.invalidate();
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
        title: "Margesi agregada",
        description: "La margesi se agregó correctamente",
      });
    },
  });

  const form = useZodForm({
    schema: CreateMargesiSchema.extend({
      multiple: z.boolean().optional(),
    }),
    defaultValues: {
      denomination: "",
      code: "",
      multiple: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
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
      <DialogContent className="max-w-[425px] ">
        <DialogTitle>Añadir margesi</DialogTitle>
        <DialogDescription>
          Ingresa informaci&oacute;n margesi al sistema
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo</FormLabel>
                  <FormControl>
                    <Input placeholder="993216790" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="denomination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Denominaci&oacute;n</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Articulo de met&aacute;l"
                      type="text"
                      {...field}
                    />
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

                    <FormLabel>¿Desea varios margesis?</FormLabel>
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
