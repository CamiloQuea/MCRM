import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/common/components/ui/avatar";
import { DataTable } from "@/modules/common/components/ui/data-table";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import { api } from "@/utils/trpc";
import Image from "next/image";
import React from "react";

const Index = () => {
  const { data } = api.user.getAll.useQuery();
  return (
    <DashboardShell>
      <div className="pt-1 sm:pt-3  sm:px-10 px-4 ">
        <h1 className="py-4 text-3xl font-bold">Usuarios</h1>
        <div>
          <DataTable
          className="min-h-[40rem]"
            data={data || []}
            columns={[
              {
                accessorKey: "username",
                accessorFn: (row) => row,
                header: "Usuario",
                cell: ({ cell }) => {
                  const values = cell.getValue();

                  //get full name of user
                  const fullName = `${values.firstName || " "} ${
                    values.lastName || " "
                  }`;

                  return (
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage
                          src={values.profilePictureUrl}
                          alt={values.username || "Foto de perfil"}
                        />
                        <AvatarFallback>
                          {values.username?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="inline-block">
                        <div className="ml-2 capitalize">{values.username}</div>
                        <div className="ml-2">{fullName}</div>
                      </div>
                    </div>
                  );
                },
              },
              {
                accessorKey: "isAdmin",
                accessorFn: (row) => row,
                header: "Rol",
                cell: ({ cell }) => {
                  const values = cell.getValue();
                  return (
                    <div className="items-center dark:bg-neutral-900 inline-block py-2 px-4 rounded-full">
                      {values.isAdmin ? (
                        <span className="">Administrador</span>
                      ) : (
                        <span className="">Usuario</span>
                      )}
                    </div>
                  );
                },
              },
              {
                accessorKey: "createdAt",
                accessorFn: (row) => row,
                header: "Fecha de registro",
                cell: ({ cell }) => {
                  const values = cell.getValue();
                  return (
                    <div className="inline-block">
                      {new Date(values.createdAt).toLocaleDateString()}
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </DashboardShell>
  );
};

export default Index;
