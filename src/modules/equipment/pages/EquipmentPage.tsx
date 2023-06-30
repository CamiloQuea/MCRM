import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { api } from "@/utils/trpc";
import { format, startOfWeek } from "date-fns";
import { MoreHorizontal, Package, Plus } from "lucide-react";
import { AddEquipmentDialog } from "../dialog/AddEquipmentDialog";
import { Input } from "@/modules/common/components/ui/input";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { GetAllEquipmentSchema } from "@/server/api/validators";
import { useDebounce } from "@/modules/common/hooks/useDebounce";

export const EquipmentPage = () => {
  const form = useZodForm({
    schema: GetAllEquipmentSchema,
  });

  const searchDebounce = useDebounce(form.watch("search"), 500)

  const { data } = api.equipment.getAll.useQuery({
    search: searchDebounce
  });

  const weeklyCount = data?.filter((item) => {
    const date = new Date(item.admissionDate.toUTCString());
    const today = new Date();
    const firstDayWeek = startOfWeek(today, { weekStartsOn: 1 });

    return date >= firstDayWeek;
  }).length;

  return (
    <div className="space-y-4 ">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="min-h-30rem">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conteo de equipos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            {/* {data?.length } */}
              {typeof data?.length !== "undefined" ? data?.length : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              +{weeklyCount} Agregados esta semana
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex">
        <Input
          className="max-w-xs"
          placeholder={"Buscar con codigo"}
          {...form.register("search")}
        />
        <AddEquipmentDialog
          Trigger={
            <Button variant="default" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          }
        />
      </div>
      <DataTable

      className="h-[30rem]"
        noDataMessage="No equipamiento encontrado"
        columns={[
          {
            accessorFn: (row) => row.margesiCode || "-",
            accessorKey: "Margesi",
          },
          {
            accessorFn: (row) =>
              row.equipmentSpecificationSheet?.equipmentMargesi?.denomination ||
              "-",
            accessorKey: "Denomicación",
            cell: (row) => (
              <div className="capitalize">{row.getValue()}</div>
            ),
          },
          {
            accessorFn: (row) => row.codeBar || "-",
            accessorKey: "Codigo de barra",
          },

          {
            accessorFn: (row) => row.internalCode || "-",
            accessorKey: "Codigo Interno",
          },
          {
            accessorFn: (row) => row.serialNumber || "-",
            accessorKey: "Numero de serie",
          },
          {
            accessorFn: (row) =>
              row.equipmentSpecificationSheet?.equipmentBrand?.name || "-",
            accessorKey: "Marca",
            cell: (row) => (
              <div className="capitalize">{row.getValue()}</div>
            ),
          },
          {
            accessorFn: (row) =>
              row.equipmentSpecificationSheet?.modelName || "-",
            accessorKey: "Modelo",
          },
          {
            accessorKey: "admissionDate",
            accessorFn: (row) => format(row.admissionDate, "dd/MM/yy") || "-",
            header: "Ingreso",
          },
          {
            id: "actions",
            cell: ({ row }) => {
              const payment = row.original;

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(payment.id)}
                    >
                      Detalles
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
        data={data || []}
      />
    </div>
  );
};
