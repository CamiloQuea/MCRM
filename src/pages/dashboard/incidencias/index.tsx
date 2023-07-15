import { Button } from "@/modules/common/components/ui/button";
import { DataTable } from "@/modules/common/components/ui/data-table";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { api } from "@/utils/trpc";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = () => {
  const { data } = api.incident.getAll.useQuery();

  const { pathname, push } = useRouter();

  const { incident } = api.useContext();
  return (
    <DashboardShell>
      <div className="pt-6 sm:pt-3  sm:px-10 px-4 ">
        <h1 className="py-4 text-3xl font-bold">Incidencias</h1>

        <div className="py-3 flex">
          <Button asChild>
            <Link href={`${pathname}/crear`} className="ml-auto">
              <Plus />
              Nuevo registro
            </Link>
          </Button>
        </div>
        <DataTable
          className="min-h-[40rem]"
          data={data || []}
          columns={[
            {
              accessorKey: "code",
              header: "Codigo",
              cell: (row) => row.renderValue(),
            },
            {
              accessorKey: "incidentDate",
              header: "Fecha de incidente",
              cell: (row) => (
                <>
                  {format(
                    new Date(row.row.original?.incidentDate || new Date()),
                    "dd/MM/yyyy"
                  )}
                </>
              ),
            },
            {
              accessorKey: "createdAt",
              header: "Fecha de creación",
              cell: (row) => (
                <>
                  {format(
                    new Date(row.row.original?.createdAt || new Date()),
                    "dd/MM/yyyy"
                  )}
                </>
              ),
            },
            {
              accessorKey: "user",
              header: "Codigo",
              cell: (row) => row.row.original?.user?.username || "-",
            },
            {
              accessorKey: "options",
              header: "",
              cell: (row) => (
                <Button variant={'ghost'}>
                  <Link  href={`${pathname}/${row.row.original.id}`}>Ver</Link>
                </Button>
              ),
            },
            // {
            //   accessorFn: (row) => row.id,
            //   accessorKey: "options",
            //   header: "",
            //   cell:  ({ getValue, row }) => {
            //     const incidentData = await incident.getOne.fetch({
            //       id: row.original.code,
            //     });

            //     if (!incidentData) return;

            //     return (
            //       <PDFDownloadLink
            //         document={<IncidentDocument incident={incidentData} />}
            //         fileName={`${row.original.incidentDate}-${row.original.code}-incidente`}
            //       >
            //         <button
            //           onClick={() => {
            //             push(`${pathname}/${getValue()}/pdf`);
            //           }}
            //         >
            //           pdf
            //         </button>
            //       </PDFDownloadLink>
            //     );
            //   },
            // },
          ]}
        />
      </div>
    </DashboardShell>
  );
};

export default Index;
