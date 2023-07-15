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

  const { data: incident } = api.incident.getOne.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    }
  );
  if (!incident) return <></>;

  return (
    <DashboardShell>
      <div
        title={`reporte de incidente - ${format(
          incident.createdAt,
          "dd/MM/yyyy"
        )}`}
      >
        <div style={styles.page}>
          <div
            style={{
              marginBottom: 10,
            }}
          >
            <div style={styles.title}>REPORTE DE INCIDENTE</div>
            <div style={styles.header}>
              <div style={styles.headerColumn}>
                <div>Codigo: {incident.code}</div>
                <div>
                  Fecha de incidente:{" "}
                  {format(incident.incidentDate || new Date(), "dd/MM/yyyy")}
                </div>
                <div>
                  Fecha de creación: {format(incident.createdAt, "dd/MM/yyyy")}
                </div>
              </div>
              <div style={styles.headerColumn}>
                <div>
                  {/* Estado: {incident.state?.incidentReportState.name.toUpperCase()} */}
                </div>
                <div>Creador por: {incident.user.username?.toUpperCase()}</div>
                <div>
                  {/* Ultima actualización: {format(incident.updatedAt || new Date(),'dd/MM/yyyy')} */}
                </div>
              </div>
            </div>
          </div>
          <div style={styles.body}>
            <div style={styles.description}>
              <div
                style={{
                  borderBottom: "1px solid #4a5568",
                  padding: 5,
                }}
              >
                Descripción
              </div>
              <div
                style={{
                  // textAlign: "justify",

                  minWidth: 0,

                  padding: 10,
                }}
              >
                {incident.description}
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
              }}
            >
              <div
                style={{
                  border: "1px solid #4a5568",
                  padding: 5,
                }}
              >
                Equipos involucrados
              </div>
            </div>
            <div
              style={{
                padding: 5,
                display: "flex",
                flexDirection: "row",
                borderLeft: "1px solid #4a5568",
                borderRight: "1px solid #4a5568",
                borderBottom: "1px solid #4a5568",
              }}
            >
              <div
                style={{
                  width: "10%",
                }}
              >
                Item
              </div>
              <div
                style={{
                  width: "45%",
                }}
              >
                Informacion
              </div>
              <div
                style={{
                  width: "45%",
                }}
              >
                Descricion
              </div>
            </div>
            <div>
              {incident.incidentreportequipment

                // .flatMap((i) => [])
                .map((item, i) => (
                  <div style={styles.items} key={item.id}>
                    <div
                      style={{
                        // width: 'min-content',
                        flexShrink: 0,
                        width: "10%",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div
                      style={{
                        flexGrow: 1,
                        width: "45%",
                        height: "100%",
                        // backgroundColor: "#edf2f7",
                        borderLeft: "1px solid #4a5568",
                        borderRight: "1px solid #4a5568",
                      }}
                    >
                      <div
                        style={{
                          borderBottom: "1px solid #4a5568",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Codigo margesi
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {
                            item.equipment?.equipmentSpecificationSheet
                              ?.equipmentMargesi?.code
                          }
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Denominación
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {
                            item.equipment?.equipmentSpecificationSheet
                              ?.equipmentMargesi?.denomination
                          }
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Modelo
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {
                            item.equipment?.equipmentSpecificationSheet
                              ?.equipmentBrand?.name
                          }
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Modelo
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {
                            item.equipment?.equipmentSpecificationSheet
                              ?.modelName
                          }
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Numero de serie
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {item.equipment?.serialNumber}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Codigo de barra
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {/* {
                            item.equipment?.
                          } */}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          // borderBottom: "1px solid #4a5568",
                        }}
                      >
                        <div
                          style={{
                            //inline-block
                            borderRight: "1px solid #4a5568",
                            padding: 5,
                            width: "40%",
                            flexShrink: 0,
                          }}
                        >
                          Codigo interno
                        </div>
                        <div
                          style={{
                            //inline-block
                            padding: 5,
                            flexGrow: 1,
                          }}
                        >
                          {item.equipment?.internalCode}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        flexGrow: 1,
                        width: "45%",
                        minHeight: "20rem",
                        padding: 10,
                        height: "100%",
                      }}
                    >
                      <div>{item.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default IncidentDocument;
