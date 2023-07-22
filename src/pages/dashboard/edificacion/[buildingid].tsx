import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { DataTable } from "@/modules/common/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { Label } from "@/modules/common/components/ui/label";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { useGetQueryParam } from "@/modules/common/hooks/useGetQueryParam";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { api } from "@/utils/trpc";
import { format } from "date-fns";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Loader,
  Package,
  Plus,
} from "lucide-react";
import React from "react";

const Index = () => {
  const buildingId = useGetQueryParam("buildingid");

  const { data: buildingData, isLoading: buildingIsLoading } =
    api.building.getOne.useQuery(
      {
        id: buildingId as string,
      },
      {
        enabled: !!buildingId,
      }
    );

  const { data: buildingFloorData } = api.buildingFloor.getAll.useQuery(
    {
      where: {
        buildingId: buildingId as string,
      },
    },
    {
      enabled: !!buildingId,
    }
  );

  const {data:metadata,isLoading:isLoadingMetadata} = api.building.getMetadata.useQuery(
    {
      id: buildingId as string,
    },
    {
      enabled: !!buildingId,
    }
  );

  const { buildingFloor } = api.useContext();

  const { mutate } = api.buildingFloor.createByMode.useMutation({
    onSettled: () => {
      buildingFloor.getAll.invalidate();
    },
  });

  

  return (
    <DashboardShell>
      {buildingIsLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader className="animate-spin " />
        </div>
      ) : (
        <div className="container py-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {buildingData?.name}
            </h1>
            <h2 className="text-xl font-medium text-neutral-400 tracking-tight">
              Edificación
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-3">
            {/* <Card className="min-h-30rem">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conteo de equipos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Agregados esta semana
                </p>
              </CardContent>
            </Card> */}
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
                    metadata?.equipmentCount?.toString()
                  )}

                  {/*// {typeof metaData?.equipmentCount !== "undefined"
                  //   ? metaData.equipmentCount.toString()
                  //   : true  ? 'Cargando':'-'} */}
                </div>
                <span className="text-xs text-muted-foreground ">
                  {isLoadingMetadata ? (
                    <Skeleton className="h-3 flex-1 w-1/2" />
                  ) : (
                    `+${metadata?.equipmentCountThisWeek?.toString()} movimientos esta semana`
                  )}
                </span>
              </CardContent>
            </Card>
          </div>
          <div className="grid">
            <div className="grid-cols-1">
              <div className="flex items-center pb-3 flex-wrap">
                <h1 className="text-xl ">Piso</h1>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto mr-3" size={"icon"}>
                      <span className="sr-only">Agregar</span>
                      <Plus className="h-4 w-4 " />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Agregar</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        mutate({
                          buildingId: buildingId as string,
                          mode: "up",
                        });
                      }}
                    >
                      <ChevronUp className="h-4 w-4 mr-2" />
                      <span>Arriba</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        mutate({
                          buildingId: buildingId as string,
                          mode: "down",
                        });
                      }}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      <span>Abajo</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable
                className="h-56 "
                columns={[
                  {
                    accessorKey: "floorNumber",
                    accessorFn: (row) => row.floorNumber,
                    header: "Piso",
                    cell: (row) => (
                      <div className="text-sm font-medium text-neutral-600">
                        {row.getValue()}
                      </div>
                    ),
                  },
                  {
                    accessorKey: "createdAt",
                    // accessorFn: (row) => row.createdAt,
                    header: "Fecha de creación",
                    cell: (row) => (
                      <div className="text-sm font-medium text-neutral-600">
                        {format(row.cell.row.original.createdAt, "dd/MM/yy")}
                      </div>
                    ),
                  },
                ]}
                data={buildingFloorData || []}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
export default Index;
