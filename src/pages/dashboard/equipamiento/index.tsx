import { DashboardShell } from "@/modules/common/layout/DashboardShell";
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

import { Input } from "@/modules/common/components/ui/input";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { GetAllEquipmentSchema } from "@/server/api/validators";
import { useDebounce } from "@/modules/common/hooks/useDebounce";

import { AddEquipmentDialog } from "@/modules/equipment/dialog/AddEquipmentDialog";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { useRouter } from "next/router";

const Index = () => {
  const { push } = useRouter();

  const form = useZodForm({
    schema: GetAllEquipmentSchema,
    defaultValues: {
      search: "",
    },
  });

  const searchDebounce = useDebounce(form.watch("search"), 500);

  const { data: metaData, isLoading: isLoadingMetadata } =
    api.equipment.getMetadata.useQuery();

  const { data, isLoading } = api.equipment.getAll.useQuery(
    {
      search: searchDebounce,
    },
    {
      enabled: typeof searchDebounce !== "undefined",
    }
  );

  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 ">
        <h1 className="py-4 text-3xl font-bold">Equipamiento</h1>
        <div className="space-y-4 ">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="min-h-30rem">
              <CardHeader className="flex flex-row items-center gap-2 justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex-1">
                  {isLoadingMetadata ? (
                    <Skeleton className="h-4 flex-1" />
                  ) : (
                    "Conteo de equipos"
                  )}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* {data?.length} */}
                  {isLoadingMetadata ? (
                    <Skeleton className="h-8 flex-1 w-1/2 mb-3" />
                  ) : (
                    data?.length
                  )}

                  {/*// {typeof metaData?.equipmentCount !== "undefined"
                  //   ? metaData.equipmentCount.toString()
                  //   : true  ? 'Cargando':'-'} */}
                </div>
                <span className="text-xs text-muted-foreground ">
                  {isLoadingMetadata ? (
                    <Skeleton className="h-3 flex-1 w-1/2" />
                  ) : (
                    `+${metaData?.equipmentCountThisWeek?.toString()} Agregados esta semana`
                  )}
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-3">
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
            isLoading={isLoading}
            // className="h-[30rem]"
            noDataMessage="No equipamiento encontrado"
            columns={[
              {
                accessorFn: (row) => row.margesiCode || "-",
                accessorKey: "Margesi",
              },
              {
                accessorFn: (row) =>
                  row.equipmentSpecificationSheet?.equipmentMargesi
                    ?.denomination || "-",
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
                accessorFn: (row) =>
                  format(row.admissionDate, "dd/MM/yy") || "-",
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
                        
                          onClick={() =>
                            push(`/dashboard/equipamiento/${payment.id}`)
                          }
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
      </div>
    </DashboardShell>
  );
};

export default Index;
