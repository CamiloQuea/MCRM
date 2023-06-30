import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";
import { RouterOutputs, api } from "@/utils/trpc";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import React from "react";
import { AddMargesiDialog } from "../dialog/AddMargesiDialog";

// const columns = ;

export const MargesiPage = () => {
  const { data } = api.equipmentMargesi.getAll.useQuery();

  return (
    <div className="space-y-4 ">
      <div className="flex">
        <AddMargesiDialog
          Trigger={
            <Button  className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span>Agregar</span>
            </Button>
          }
        />
      </div>
      <DataTable
     
        data={data || []}
        columns={[
          {
            accessorKey: "code",
            header: "Codigo",
            accessorFn: (row) => row.code,
            cell: (row) => <div className="capitalize">{row.getValue()}</div>,
          },
          {
            accessorKey: "name",
            header: "Nombre",
            accessorFn: (row) => row.denomination.toLowerCase(),
            cell: (row) => <div className="capitalize">{row.getValue()}</div>,
          },
          {
            accessorKey: "createdAt",
            header: "Creado",
            accessorFn: (row) => format(new Date(row.createdAt), "dd/MM/yyyy"),
            cell: (row) => <div className="capitalize">{row.getValue()}</div>,
          },
          {
            accessorKey: "updatedAt",
            header: "Actualizado",
            accessorFn: (row) => format(new Date(row.createdAt), "dd/MM/yyyy"),
            cell: (row) => <div className="capitalize">{row.getValue()}</div>,
          },
        ]}
      />
    </div>
  );
};
