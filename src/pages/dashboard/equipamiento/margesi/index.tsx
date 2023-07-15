import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import React from "react";
import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";
import { RouterOutputs, api } from "@/utils/trpc";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { AddMargesiDialog } from "@/modules/equipment/dialog/AddMargesiDialog";

const Index = () => {
  const { data,isLoading } = api.equipmentMargesi.getAll.useQuery();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 ">
        <h1 className="py-4 text-3xl font-bold">Margesi</h1>
        <div className="space-y-4 ">
          <div className="flex">
            <AddMargesiDialog
              Trigger={
                <Button className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Agregar</span>
                </Button>
              }
            />
          </div>
          <DataTable
            data={data || []}
            isLoading={isLoading}
            columns={[
              {
                accessorKey: "code",
                header: "Codigo",
                accessorFn: (row) => row.code,
                cell: (row) => (
                  <div className="capitalize">{row.getValue()}</div>
                ),
              },
              {
                accessorKey: "name",
                header: "Nombre",
                accessorFn: (row) => row.denomination.toLowerCase(),
                cell: (row) => (
                  <div className="capitalize">{row.getValue()}</div>
                ),
              },
              {
                accessorKey: "createdAt",
                header: "Creado",
                accessorFn: (row) =>
                  format(new Date(row.createdAt), "dd/MM/yyyy"),
                cell: (row) => (
                  <div className="capitalize">{row.getValue()}</div>
                ),
              },
              {
                accessorKey: "updatedAt",
                header: "Actualizado",
                accessorFn: (row) =>
                  format(new Date(row.createdAt), "dd/MM/yyyy"),
                cell: (row) => (
                  <div className="capitalize">{row.getValue()}</div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
