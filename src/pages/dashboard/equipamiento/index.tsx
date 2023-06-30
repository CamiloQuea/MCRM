import { DashboardShell } from "@/modules/common/layout/DashboardShell";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/common/components/ui/tabs";
import { EquipmentPage } from "@/modules/equipment/pages/EquipmentPage";
import { MargesiPage } from "@/modules/equipment/pages/MargesiPage";
import { BrandPage } from "@/modules/equipment/pages/BrandPage";
import { useTabRouter } from "@/modules/common/hooks/useTabRouter";

const DEFAULT_TAB = "equipamento";

const Index = () => {
  const { setPathValue, pathValue } = useTabRouter("tab");
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4">
        <div className="flex-1 py-4 pt-3">
          <h2 className="text-3xl font-bold tracking-tight">Equipamiento</h2>
        </div>
        <Tabs
          defaultValue={DEFAULT_TAB}
          onValueChange={(value) => {
            setPathValue(value);
          }}
          value={pathValue || DEFAULT_TAB}
        >
          <TabsList className="flex w-fit gap-2">
            <TabsTrigger value="equipamento">General</TabsTrigger>
            <TabsTrigger value="marca">Marca</TabsTrigger>
            <TabsTrigger value="margesi">Margesi</TabsTrigger>
          </TabsList>

          <TabsContent value="equipamento">
            <EquipmentPage />
          </TabsContent>
          <TabsContent value="marca">
            <BrandPage />
          </TabsContent>
          <TabsContent value="margesi">
            <MargesiPage />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
};

export default Index;
