import { Button } from "@/modules/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import { Input } from "@/modules/common/components/ui/input";
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";
import { useDebounce } from "@/modules/common/hooks/useDebounce";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { GetAllEquipmentSchema } from "@/server/api/validators";
import { RouterOutputs, api } from "@/utils/trpc";
import { randomUUID } from "crypto";
import { Plus } from "lucide-react";
import React, { useState } from "react";

type SelectEquipmentDialogProps = {
  Trigger: React.ReactNode;
  onSelect: (equipment: RouterOutputs["equipment"]["getAll"][number]) => void;
};

export const SelectEquipmentDialog = ({
  Trigger,
  onSelect,
}: SelectEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useZodForm({
    schema: GetAllEquipmentSchema,
  });

  const searchDebounce = useDebounce(form.watch("search"), 500);

  const { data, isLoading } = api.equipment.getAll.useQuery(
    {
      search: searchDebounce,
    },
    {
      enabled: open,
    }
  );

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl ">
        <DialogTitle className="text-xl font-bold">
          Selecciona equipamiento
        </DialogTitle>
        <div className="my-5">
          <Input
            placeholder="Buscar por codigo"
            className="max-w-xs"
            {...form.register("search")}
          />
        </div>

        <ScrollArea className="h-96 border-y ">
          {data?.map((equipment) => (
            <div
              key={equipment.id}
              className="flex justify-between items-center gap-3 py-2 border-b"
            >
              <div>
                <div className="uppercase">
                  {
                    equipment.equipmentSpecificationSheet?.equipmentMargesi
                      ?.denomination
                  }
                </div>
                <div className="dark:text-neutral-400 ">
                  <div className="capitalize">
                    Marca:{" "}
                    {
                      equipment.equipmentSpecificationSheet?.equipmentBrand
                        ?.name
                    }
                  </div>
                  <div>
                    Modelo: {equipment.equipmentSpecificationSheet?.modelName}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div>{equipment.codeBar}</div>|
                    <div>{equipment.internalCode}</div>|
                    <div>{equipment.serialNumber}</div>
                  </div>
                </div>
              </div>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  onSelect(equipment);
                  setOpen(false);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500" />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
