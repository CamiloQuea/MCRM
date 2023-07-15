import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { BrandPage } from "@/modules/equipment/pages/BrandPage";
import React from "react";
import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";
import { api } from "@/utils/trpc";
import { format } from "date-fns";
import { ArrowUpDown, Plus } from "lucide-react";
import { AddBrandDialog } from "@/modules/equipment/dialog/AddBrandDialog";

const Index = () => {
  const { data,isLoading } = api.equipmentBrand.getAll.useQuery();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 ">
        <h1 className="py-4 text-3xl font-bold">Marcas</h1>
        <div className="space-y-4 ">
          <div className="flex">
            <AddBrandDialog
              Trigger={
                <Button className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Agregar</span>
                </Button>
              }
            />
          </div>
          <DataTable
            isLoading={isLoading}
            data={data || []}
            columns={[
              {
                accessorKey: "name",
                accessorFn: (row) => row.name.toLowerCase(),
                header(props) {
                  return (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        props.column.toggleSorting(
                          props.column.getIsSorted() === "asc"
                        )
                      }
                    >
                      Marca
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  );
                },
                cell: (row) => (
                  <div className="capitalize">{row.cell.row.original.name}</div>
                ),
              },
              {
                accessorKey: "createdAt",
                accessorFn: (row) =>
                  format(new Date(row.createdAt), "dd/MM/yyyy"),
                header: "Creado",
                cell: (row) => (
                  <div className="capitalize">{row.getValue()}</div>
                ),
              },
              {
                accessorKey: "updatedAt",
                accessorFn: (row) =>
                  format(new Date(row.createdAt), "dd/MM/yyyy"),
                header: "Actualizado",
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
