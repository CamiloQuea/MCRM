import React from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Font,
  PDFViewer,
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer";
import { useRouter } from "next/router";
import { RouterOutputs, api } from "@/utils/trpc";
import { format } from "date-fns";
import { Document as Doc, Page as Pag } from "react-pdf/dist/esm";
import { useGetQueryParam } from "@/modules/common/hooks/useGetQueryParam";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { ScrollArea } from "@/modules/common/components/ui/scroll-area";
import { DataTable } from "@/modules/common/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { Button } from "@/modules/common/components/ui/button";
import { MoreHorizontal } from "lucide-react";
const styles = StyleSheet.create({
  title: {
    // fontSize: 15,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "light",
  },
  page: {
    flexDirection: "column",
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    marginHorizontal: 10,

    padding: 10,
    border: "1px solid #4a5568",
    display: "flex",
    flexDirection: "row",
  },
  headerColumn: {
    display: "flex",
    flexDirection: "column",
    // border: "1px solid #4a5568",
    flexGrow: 1,
  },
  body: {
    flexGrow: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  description: {
    border: "1px solid #4a5568",
  },
  items: {
    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    border: "1px solid #4a5568",
    // borderLeft: "1px solid #4a5568",
    // borderRight: "1px solid #4a5568",
    // borderBottom: "1px solid #4a5568",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const IncidentDocument = () => {
  const id = useGetQueryParam("incidentid");

  const { data: incidentData, isLoading } = api.incident.getOne.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    }
  );

  const { push } = useRouter();

  if (!incidentData) return <></>;

  return (
    <DashboardShell>
      <div
        title={`reporte de incidente - ${format(
          incidentData.createdAt,
          "dd/MM/yyyy"
        )}`}
      >
        <div className="container p-5">
          <div className="divide-y-[1px] border-b-[1px]">
            <h2 className="font-bold mb-2 text-xl">REPORTE DE INCIDENTE</h2>

            <div className="p-2 rounded grid ">
              <div>Codigo: {incidentData.code}</div>
              <div>
                Fecha de incidente:{" "}
                {format(incidentData.incidentDate || new Date(), "dd/MM/yyyy")}
              </div>
              <div>
                Fecha de creación:{" "}
                {format(incidentData.createdAt, "dd/MM/yyyy")}
              </div>
            </div>
          </div>

          <div className="my-5">
            <div>
              <div className="text-lg font-medium mb-2">Descripción</div>
              <ScrollArea className="min-h-[10rem] border rounded p-2">
                {incidentData.description}
              </ScrollArea>
            </div>
            <div className="my-5">
              <h2 className="text-lg font-medium mb-2">Equipos involucrados</h2>

              <div className=" divide-y-[1px]">
                <DataTable
                  isLoading={isLoading}
                  // className="h-[30rem]"
                  noDataMessage="No equipamiento encontrado"
                  columns={[
                    {
                      accessorFn: (row) =>
                        row.equipment?.equipmentSpecificationSheet
                          ?.equipmentMargesi?.code || "-",
                      accessorKey: "Margesi",
                    },
                    {
                      accessorFn: (row) =>
                        row.equipment?.equipmentSpecificationSheet
                          ?.equipmentMargesi?.denomination || "-",
                      accessorKey: "Denomicación",
                      cell: (row) => (
                        <div className="capitalize">{row.getValue()}</div>
                      ),
                    },
                    {
                      accessorFn: (row) => row.equipment?.codeBar || "-",
                      accessorKey: "Codigo de barra",
                    },

                    {
                      accessorFn: (row) => row.equipment?.internalCode || "-",
                      accessorKey: "Codigo Interno",
                    },
                    {
                      accessorFn: (row) => row.equipment?.serialNumber || "-",
                      accessorKey: "Numero de serie",
                    },
                    {
                      accessorFn: (row) =>
                        row.equipment?.equipmentSpecificationSheet
                          ?.equipmentBrand?.name || "-",
                      accessorKey: "Marca",
                      cell: (row) => (
                        <div className="capitalize">{row.getValue()}</div>
                      ),
                    },
                    {
                      accessorFn: (row) =>
                        row.equipment?.equipmentSpecificationSheet?.modelName ||
                        "-",
                      accessorKey: "Modelo",
                    },
                    // {
                    //   accessorKey: "admissionDate",
                    //   accessorFn: (row) =>
                    //     format(row.equipment.admissionDate, "dd/MM/yy") || "-",
                    //   header: "Ingreso",
                    // },
                    {
                      id: "actions",
                      cell: ({ row }) => {
                        const payment = row.original;

                        return (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  push(`/dashboard/equipamiento/${payment.equipment?.id}`)
                                }
                              >
                                Detalles
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      },
                    },
                  ]}
                  data={incidentData.incidentreportequipment || []}
                />

                {/* {incident.incidentreportequipment.map((item, i) => (
                  <div key={item.id} className="p-2">
                    <div>
                      <div>{i + 1}</div>
                    </div>

                    <div>
                      <span>{item.equipment?.internalCode}</span>
                      <span>{item.equipment?.serialNumber}</span>
                      <div>
                        {item.equipment?.equipmentSpecificationSheet?.modelName}
                      </div>
                      <div>
                        {
                          item.equipment?.equipmentSpecificationSheet
                            ?.equipmentMargesi?.denomination
                        }
                      </div>
                      <div>
                        {
                          item.equipment?.equipmentSpecificationSheet
                            ?.equipmentBrand?.name
                        }
                      </div>
                      <div>{item.description}</div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default IncidentDocument;
