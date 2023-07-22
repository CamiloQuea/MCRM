import { Button } from "@/modules/common/components/ui/button";
import { Separator } from "@/modules/common/components/ui/separator";
import { useGetQueryParam } from "@/modules/common/hooks/useGetQueryParam";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { UpdateEquipmentPositionDialog } from "@/modules/equipment/dialog/UpdateEquipmentPositionDialog";
import { api } from "@/utils/trpc";
import { format, parse } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

const Index = () => {
  const { replace } = useRouter();
  const equipmentId = useGetQueryParam("equipmentId");

  const { data: equipmentData } = api.equipment.getOne.useQuery(
    {
      id: equipmentId as string,
    },
    {
      enabled: typeof equipmentId !== "undefined",
      onError: () => {
        replace({
          pathname: "/dashboard/equipamiento",
        });
      },
    }
  );

  const { data: equipmentTracking } = api.equipment.getTrackingHistory.useQuery(
    {
      id: equipmentId as string,
    },
    {
      enabled: typeof equipmentId !== "undefined",
    }
  );

  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4  container">
        <h1 className="py-4 text-3xl font-bold">Equipamiento</h1>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_20rem]  md:divide-x-[1px]  ">
          <div className="mr-5 ">
            <div className="flex">
              <h2 className="text-lg font-semibold">Historial de ubicacion</h2>
              <UpdateEquipmentPositionDialog
                equipmentId={equipmentId as string}
                Trigger={
                  <Button className="ml-auto" type="button" size={"icon"}>
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </div>

            <ul className="relative border-l border-neutral-200 dark:border-neutral-700">
              {equipmentTracking?.map((item, i) => {
                return (
                  <li className="mb-10 ml-4" key={item.id}>
                    <div
                      className={`absolute w-3 h-3  rounded-full mt-1.5 -left-1.5 border border-white dark:border-neutral-900 ${
                        i === 0
                          ? "bg-blue-500"
                          : "bg-neutral-500  dark:bg-neutral-700 "
                      }`}
                    />
                    <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                      {format(item.date, "dd/MM/yy hh:mm:ss")}
                    </time>
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                      Edificacion: {item.room?.buildingFloor?.building?.name}
                    </h3>
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                      {item.room?.name.toUpperCase()} - Piso{" "}
                      {item.room?.buildingFloor?.floorNumber}
                    </h3>
                    <p className="mb-4 text-base font-normal text-neutral-500 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </li>
                  // <div key={item.id} className="  block gap-2">
                  //   <span>Ubicacion: {item.room?.name}</span>
                  //   <span>
                  //     Edificacion: {item.room?.buildingFloor?.building?.name}
                  //   </span>
                  //   <span>Piso: {item.room?.buildingFloor?.floorNumber}</span>
                  //   <span>Fecha: {format(item.date, "dd/MM/yy")}</span>
                  // </div>
                );
              })}
            </ul>
            {equipmentTracking?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96">
                <span className=" font-medium text-neutral-500 dark:text-neutral-400">
                  No hay registro de ubicacion
                </span>
              </div>
            )}
          </div>

          <div className="px-0 md:px-6  divide-y-[1px] row-start-1 md:row-start-auto">
            <section className="py-5">
              <h2 className=" font-bold mb-3">Informacion General</h2>
              <div className="flex flex-col gap-2 text-sm dark:text-neutral-400">
                <span>Codigo de barra: {equipmentData?.codeBar}</span>
                <span>Codigo interno: {equipmentData?.internalCode}</span>
                <span>Codigo margesi: {equipmentData?.margesiCode}</span>
                <span>Numbero de serial: {equipmentData?.serialNumber}</span>
              </div>
            </section>
            <section className="py-5">
              <h2 className=" font-bold mb-3">Informacion Especifica</h2>
              <div className="flex flex-col gap-2 text-sm dark:text-neutral-400">
                <div>
                  Denominaci&oacute;n{": "}
                  <span className="capitalize">
                    {
                      equipmentData?.equipmentSpecificationSheet
                        ?.equipmentMargesi?.denomination
                    }
                  </span>
                </div>
                <div>
                  Marca{": "}
                  <span className="capitalize">
                    {equipmentData?.equipmentSpecificationSheet?.equipmentBrand
                      ?.name ?? "Sin marca"}
                  </span>
                </div>
                <div>
                  Modelo{": "}
                  <span className="capitalize">
                    {equipmentData?.equipmentSpecificationSheet?.modelName ??
                      "Sin modelo"}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
