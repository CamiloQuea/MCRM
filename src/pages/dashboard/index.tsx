import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { api } from "@/utils/trpc";
import { addDays, format, isThisWeek, startOfMonth } from "date-fns";
import { Car, Clipboard, Package, XCircle } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const { data: incidentCount } = api.incident.getCountByDay.useQuery({
    dateRange: {
      dateStart: startOfMonth(new Date()),
    },
  });

  const { data: equipmentCount } = api.equipment.getCountByDay.useQuery();

  const { data: incidentData } = api.incident.getAll.useQuery({
    limit: 5,
  });

  const { data: equipmentTrackingData } = api.equipmentTracking.getAllById.useQuery(
    {
      limit: 5,
    }
  );

  const totalIncidentCount = incidentCount?.reduce((acum, current) => {
    return acum + current.count;
  }, 0);

  const lastWeekIncidentCount = incidentCount?.reduce((acum, current) => {
    if (!isThisWeek(current.date)) return acum;
    return acum + current.count;
  }, 0);

  const totalEquipmentCount = equipmentCount?.reduce((acum, current) => {
    return acum + current.count;
  }, 0);

  const lastWeekEquipmentCount = equipmentCount?.reduce((acum, current) => {
    if (!isThisWeek(current.date)) return acum;
    return acum + current.count;
  }, 0);

  return (
    <DashboardShell>
      <div className="p-10 pt-6">
        <div className="flex items-center justify-between space-y-2 pb-8 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Tablero</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Incidentes Mensuales
              </CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidentCount}</div>
              <p className="text-xs text-muted-foreground">
                +{lastWeekIncidentCount} esta semana
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cantidad de equipos
              </CardTitle>
              <Package />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipmentCount}</div>
              <p className="text-xs text-muted-foreground">
                +{lastWeekEquipmentCount} esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="row-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ultimos 5 movimientos
              </CardTitle>
              <Car />
            </CardHeader>
            <CardContent className="divide-y-[1px]">
              {equipmentTrackingData?.map((tracking) => (
                <div
                  className="space-y-0 py-2 relative group"
                  key={tracking.id}
                >
                  <Link
                    href={{
                      pathname: "/dashboard/incidencias/[incidentid]",
                      query: { incidentid: tracking.id },
                    }}
                    className="absolute right-0 group-hover:opacity-100 group-focus-within:opacity-100 opacity-0 transition-all duration-75 p-2"
                  >
                    Ver mas
                  </Link>
                  <h3 className="font-medium text-neutral-900 dark:text-white uppercase">
                    {tracking.name}
                  </h3>
                  <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                    {format(
                      tracking.date || new Date(),
                      "dd/MM/yy hh:mm:ss"
                    )}
                  </time>

                  <p className="mb-4 text-base font-normal text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {tracking.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="row-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ultimos 5 incidentes
              </CardTitle>
              <XCircle />
            </CardHeader>
            <CardContent className="divide-y-[1px]">
              {incidentData?.map((incident) => (
                <div
                  className="space-y-0 py-2 relative group"
                  key={incident.id}
                >
                  <Link
                    href={{
                      pathname: "/dashboard/incidencias/[incidentid]",
                      query: { incidentid: incident.id },
                    }}
                    className="absolute right-0 group-hover:opacity-100 group-focus-within:opacity-100 opacity-0 transition-all duration-75 p-2"
                  >
                    Ver mas
                  </Link>
                  <h3 className="font-medium text-neutral-900 dark:text-white">
                    {incident.user?.username}
                  </h3>
                  <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                    {format(
                      incident.incidentDate || new Date(),
                      "dd/MM/yy hh:mm:ss"
                    )}
                  </time>

                  <p className="mb-4 text-base font-normal text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {incident.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
