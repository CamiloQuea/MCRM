import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { useTabRouter } from "@/modules/common/hooks/useTabRouter";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { RouterOutputs, api } from "@/utils/trpc";
import { createColumnHelper } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { Plus } from "lucide-react";
import React from "react";

const DEFAULT_TAB = "registros";

const Index = () => {
  const { pathValue, setPathValue } = useTabRouter();

  const { data } = api.incident.getAll.useQuery();

  const { incident } = api.useContext();

  const { mutate } = api.incident.create.useMutation({
    onSettled(data, error, variables, context) {
      incident.getAll.invalidate();
    },
  });
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4">
        <div className="flex-1 py-4 pt-3">
          <h2 className="text-3xl font-bold tracking-tight">Equipamiento</h2>
        </div>
        <Tabs
          defaultValue={DEFAULT_TAB}
          onValueChange={(value) => {
            setPathValue(value);
          }}
          value={pathValue || DEFAULT_TAB}
        >
          <TabsList className="flex w-fit gap-2">
            <TabsTrigger value="registros">Registros</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>
          <TabsContent value="eventos">Eventos</TabsContent>
          <TabsContent value="configuracion">Configuraciones</TabsContent>

          <TabsContent value="registros">
            <>
              <div className="py-3 flex">
                <Button
                  className="ml-auto"
                  onClick={() =>
                    mutate({
                      code: Date.now().toString(),
                      incidentDate: new Date(),
                      description: "test",
                      equipmentDetail: [],
                    })
                  }
                >
                  <Plus />
                  Nuevo registro
                </Button>
              </div>
              <DataTable
                className="min-h-[40rem]"
                data={data || []}
                columns={[
                  {
                    accessorKey: "code",
                    header: "Codigo",
                    cell: (row) => row.renderValue(),
                  },
                  {
                    accessorKey: "incidentDate",
                    header: "Fecha de incidente",
                    cell: (row) => (
                      <>
                        {format(
                          new Date(
                            row.row.original?.incidentDate || new Date()
                          ),
                          "dd/MM/yyyy"
                        )}
                      </>
                    ),
                  },
                  {
                    accessorKey: "createdAt",
                    header: "Fecha de creación",
                    cell: (row) => (
                      <>
                        {format(
                          new Date(row.row.original?.createdAt || new Date()),
                          "dd/MM/yyyy"
                        )}
                      </>
                    ),
                  },
                ]}
              />
            </>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Index;
