


export type routeItem = {
    title: string;
    to: string;
    description?: string;
    children?: Exclude<routeItem, 'children'>[];
};

export const dashboardRoot = "/dashboard";

export const adminRoutes: { [key: string]: routeItem } = {
    equipos: {
        title: "Equipamiento",
        to: `${dashboardRoot}/equipamiento`,
    },
    incidencias: {
        title: "Incidencias",
        to: `${dashboardRoot}/incidencias`,
    },
    ubicacion: {
        title: "Ubicaciones",
        to: `${dashboardRoot}/ubicacion`,
    },

    // usuarios: {
    //     title: "Usuarios",
    //     to: `${dashboardRoot}/usuarios`,
    // },

}


export const adminRoutesArray = Object.entries(adminRoutes).map((key) => {
    return {
        id: key[0],
        ...key[1]
    }
})

export const adminRoutesSidebar = Object.entries(adminRoutes).map((key) => {
    return {
        id: key[0],
        ...key[1]
    }
}).filter((route) => (route.id !== 'sucursales' && route.id !== 'edificaciones'))
