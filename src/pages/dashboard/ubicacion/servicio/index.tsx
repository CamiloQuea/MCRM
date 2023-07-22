import { Button } from "@/modules/common/components/ui/button";
import { api } from "@/utils/trpc";
import React from "react";
import { MoreVertical, Plus } from "lucide-react";
import { Card, CardTitle } from "@/modules/common/components/ui/card";
import { Separator } from "@/modules/common/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { AddDepartmentDialog } from "@/modules/ubication/dialog/AddDepartmentDialog";

const Index = () => {
  const { data } = api.department.getAll.useQuery();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 container">
        <h1 className="py-4 text-3xl font-bold">Servicios</h1>

        <div className="flex ">
          <AddDepartmentDialog
            Trigger={
              <Button className="ml-auto">
                <Plus size={16} />
                <span className="ml-2">Agregar</span>
              </Button>
            }
          />
        </div>
        <div className="mt-3 border   rounded-md overflow-y-auto min-h-0 divide-y-[1px] last:border-b ">
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex   items-stretch justify-start  p-3"
            >
              {/* <Separator /> */}

              <div
                className="h-4 w-4 self-center bg-neutral-100 rounded-full dark:bg-black  border mr-4"
                // style={{
                //   backgroundColor: item.hexColor || "",
                // }}
              />
              <div>
                <h3 className="text-md text-neutral-600 dark:text-white uppercase">
                  {item.name}
                </h3>
                <span className="text-xs dark:text-neutral-400">Activo</span>
              </div>
            </div>
            //   <Card key={item.id} className="flex flex-col">
            //     <div
            //       className="h-8 bg-neutral-100 rounded-t-md dark:bg-black  grow"
            //       style={{
            //         backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2399999999' fill-opacity='0.46' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            //       }}
            //     ></div>
            //     <Separator />
            //     <div className="flex items-center justify-between p-3">
            //       <CardTitle className="text-md text-neutral-600 dark:text-white capitalize">
            //         {item.name.toLowerCase()}
            //       </CardTitle>
            //       <DropdownMenu>
            //         <DropdownMenuTrigger asChild>
            //           <Button variant="ghost" className="h-8 w-8 p-0">
            //             <span className="sr-only">Abrir menu</span>
            //             <MoreVertical className="h-4 w-4" />
            //           </Button>
            //         </DropdownMenuTrigger>
            //         <DropdownMenuContent align="end">
            //           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            //           <DropdownMenuItem>Detalles</DropdownMenuItem>
            //         </DropdownMenuContent>
            //       </DropdownMenu>
            //     </div>
            //     {/* <CardDescription>
            //   {format(item.createdAt, "dd/MM/yy")}
            // </CardDescription> */}
            //   </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
