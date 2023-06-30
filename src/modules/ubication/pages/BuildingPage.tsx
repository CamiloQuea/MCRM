import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { api } from "@/utils/trpc";
import { Menu, MoreVertical, Plus, XOctagon } from "lucide-react";
import { AddBuildingDialog } from "../dialog/AddBuildingDialog";
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";
import { Separator } from "@/modules/common/components/ui/separator";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";

export const BuildingPage = () => {
  const { data } = api.building.getAll.useQuery();

  const { push } = useRouter();

  return (
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
      <div className="mt-3 border  flex-1 rounded-md p-4 overflow-y-auto min-h-0">
        <div className="grid grid-cols-4 gap-4">
          {data?.map((item) => {
            return (
              <Card key={item.id} className="flex flex-col">
                <div
                  className="h-8 bg-neutral-100 rounded-t-md dark:bg-black  grow"
                  style={{
                    backgroundColor: item.hexColor || "",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2399999999' fill-opacity='0.46' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
                <Separator />
                <div className="flex items-center justify-between p-3">
                  <CardTitle className="text-md text-neutral-600 dark:text-white">
                    {item.name}
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
                {/* <CardDescription>
                {format(item.createdAt, "dd/MM/yy")}
              </CardDescription> */}
              </Card>
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
      {/* <DataTable
        data={data || []}
        columns={[
          {
            accessorKey: "name",
            accessorFn: (row) => row.name,
            header: "Nombre",
          },
        ]}
      /> */}
    </div>
  );
};
