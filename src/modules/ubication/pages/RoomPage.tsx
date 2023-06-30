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
import React from "react";
import { AddRoomDialog } from "../dialog/AddRoomDialog";
import { format } from "date-fns";

export const RoomPage = () => {
  const { data } = api.room.getAll.useQuery();

  return (
    <div className="">
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
      <div className="py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.map((item) => {
          return (
            <Card key={item.id} className="flex flex-col">
              <div
                className="h-8 bg-neutral-100 rounded-t-md dark:bg-black  grow"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2399999999' fill-opacity='0.46' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
              <Separator />
              <div className="flex items-center justify-between p-3 pb-0">
                <CardTitle className="text-md text-neutral-600 dark:text-white capitalize">
                  {item.name.toLowerCase()}
                </CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
              <CardDescription className="p-3 pt-0  capitalize">
                {item.department?.name || "-"}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
