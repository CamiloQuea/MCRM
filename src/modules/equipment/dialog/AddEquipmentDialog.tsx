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
  FormDescription,
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
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { Separator } from "@/modules/common/components/ui/separator";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { cn } from "@/modules/common/lib/utils";
import { CreateEquipmentSchema } from "@/server/api/validators";
import { api } from "@/utils/trpc";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { SelectSingleField } from "@/modules/common/components/SelectSingleField";
type AddEquipmentDialogProps = {
  Trigger: React.ReactNode;
};

export const AddEquipmentDialog = ({ Trigger }: AddEquipmentDialogProps) => {
  const form = useZodForm({
    schema: CreateEquipmentSchema,
    defaultValues: {
      model: "",
      internalCode: "",
      serialNumber: "",
      codeBar: "",
      admissionDate: new Date(),
      height: 0,
      width: 0,
      lenght: 0,
    },
  });

  const { equipment } = api.useContext();

  const { mutate } = api.equipment.create.useMutation({
    onSettled: () => {
      form.reset();
      equipment.getAll.invalidate();
    },
  });

  const { data: brandData } = api.equipmentBrand.getAll.useQuery();
  const { data: margesiData } = api.equipmentMargesi.getAll.useQuery();

  const onSubmit = form.handleSubmit(async (data) => {
    mutate(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Añadir equipamiento</DialogTitle>
        <DialogDescription>
          Ingresar el equipamiento que se desea agregar
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={onSubmit} className=" space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <FormItem className="w-full">
                <FormLabel>Marca</FormLabel>
                <SelectSingleField
                  isClearable
                  name="equipmentBrandId"
                  control={form.control}
                  options={
                    brandData?.map((brand) => ({
                      value: brand.id,
                      label: brand.name,
                    })) || []
                  }
                />
              </FormItem>

              <FormItem className="w-full">
                <FormLabel>Margesi</FormLabel>
                <SelectSingleField
                  isClearable
                  name="equipmentMargesiCode"
                  control={form.control}
                  options={
                    margesiData?.map((brand) => ({
                      value: brand.id,
                      label: brand.denomination,
                    })) || []
                  }
                />
              </FormItem>

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-3">
              <Separator className="col-span-full" />
              <Label className="col-span-full text-lg ">Dimensiones</Label>
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ancho</FormLabel>
                    <FormControl>
                      <Input placeholder="50" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lenght"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largo</FormLabel>
                    <FormControl>
                      <Input placeholder="70" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alto</FormLabel>
                    <FormControl>
                      <Input placeholder="100" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="min-h-[10rem] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Separator className="col-span-full" />
              <Label className="col-span-full text-lg ">Detalle</Label>
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de serie</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentMargesiCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo margesi</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="internalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo interno</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codeBar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo de barra</FormLabel>
                    <FormControl>
                      <Input placeholder="XYZ" {...field} />
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
