import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import React from "react";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/modules/common/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { Separator } from "@/modules/common/components/ui/separator";
import { api } from "@/utils/trpc";
import { MoreVertical, Plus } from "lucide-react";
import { AddRoomDialog } from "@/modules/ubication/dialog/AddRoomDialog";

const Index = () => {
  const { data } = api.room.getAll.useQuery();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 container">
        <h1 className="py-4 text-3xl font-bold">Espacio</h1>
        <div className="flex">
          <AddRoomDialog
            Trigger={
              <Button className="ml-auto flex gap-3">
                <Plus />
                <span>Agregar</span>
              </Button>
            }
          />
        </div>
        <div className=" border rounded-md divide-y-2 my-3">
          {data?.map((item) => {
            return (
              <div key={item.id} className="flex items-stretch justify-center p-3 gap-5">
                <div className="h-4 w-4 bg-neutral-100 rounded-full dark:bg-neutral-900 self-center " />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-md text-neutral-600 dark:text-white capitalize">
                    {item.name.toLowerCase()}
                  </span>
                  <div className="capitalize dark:text-neutral-500">
                    {item.buildingFloor?.building?.name || "-"}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <span className="sr-only">Abrir menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem>Detalles</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
