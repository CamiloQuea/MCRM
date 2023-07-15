import { Button } from "@/modules/common/components/ui/button";
import { Card, CardTitle } from "@/modules/common/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { Separator } from "@/modules/common/components/ui/separator";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { AddBuildingDialog } from "@/modules/ubication/dialog/AddBuildingDialog";
import { api } from "@/utils/trpc";
import { MoreVertical, Plus, XOctagon } from "lucide-react";
import { useRouter } from "next/router";

const Index = () => {
  const { data } = api.building.getAll.useQuery();

  const { push } = useRouter();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4  container">
        <h1 className="py-4 text-3xl font-bold">Edificaci&oacute;n</h1>
        <div className="flex flex-col gap-2 flex-1 h-full pb-10 min-h-0">
          <div className="flex">
            <AddBuildingDialog
              Trigger={
                <Button className="ml-auto flex gap-3">
                  <Plus />
                  <span>Agregar</span>
                </Button>
              }
            />
          </div>
          <div className="mt-3 border   rounded-md overflow-y-auto min-h-0 divide-y-[1px] last:border-b ">
            {data?.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex   items-stretch justify-start  p-3"
                >
                  {/* <Separator /> */}

                  <div
                    className="h-4 w-4 self-center bg-neutral-100 rounded-full dark:bg-black  border mr-4"
                    style={{
                      backgroundColor: item.hexColor || "",
                    }}
                  />
                  <div>
                    <h3 className="text-md text-neutral-600 dark:text-white">
                      {item.name}
                    </h3>
                    <span className="text-xs dark:text-neutral-400">
                      Activo
                    </span>
                  </div>
                

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 ml-auto self-center"
                      >
                        <span className="sr-only">Abrir menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          push({
                            pathname: "/dashboard/edificacion/[buildingid]",
                            query: {
                              buildingid: item.id,
                            },
                          });
                        }}
                      >
                        Detalles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
          {data?.length === 0 && (
            <div className="text-center dark:text-neutral-400 font-medium h-full w-full flex items-center justify-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <XOctagon className="h-10 w-10 text-blue-500" />
                <h1 className="dark:text-white text-neutral-600 text-xl">
                  No hay edificaciones
                </h1>
                <p className="font-medium text-sm mt-2 text-neutral-500 dark:text-neutral-400">
                  Agrega una edificaci&oacute;n para continuar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
