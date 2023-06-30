import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { useTabRouter } from "@/modules/common/hooks/useTabRouter";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { BuildingPage } from "@/modules/ubication/pages/BuildingPage";
import { DepartmentPage } from "@/modules/ubication/pages/DepartmentPage";
import { RoomPage } from "@/modules/ubication/pages/RoomPage";
import React from "react";

const DEFAULT_TAB = "edificacion";
const Index = () => {
  const { setPathValue, pathValue } = useTabRouter("tab");
  return (
    <DashboardShell>
      <div className="py-1 sm:pt-3  sm:px-10 px-4 flex-1 flex flex-col">
        <div className=" py-4 pt-3">
          <h2 className="text-3xl font-bold tracking-tight">Ubicaciones</h2>
        </div>
        <Tabs
          className="flex-1 flex flex-col"
          defaultValue={DEFAULT_TAB}
          onValueChange={(value) => {
            setPathValue(value);
          }}
          value={pathValue || DEFAULT_TAB}
        >
          <TabsList className="flex w-fit gap-2">
            <TabsTrigger value="edificacion">Edificaciones</TabsTrigger>
            <TabsTrigger value="espacios">Espacios</TabsTrigger>
            <TabsTrigger value="departamento">Departamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="edificacion" className="flex-1">
            <BuildingPage />
          </TabsContent>
          <TabsContent value="espacios" className="flex-1"> 
            <RoomPage />
          </TabsContent>
          <TabsContent value="departamento" className="flex-1"> 
            <DepartmentPage />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Index;
