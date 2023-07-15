

type Filter<Union, Type extends Partial<Union>> = Extract<Union, Type>

export type routeItem = {
    title: string;
    description?: string;
} & ({
    type: 'link'
    to: string;
} | {
    type: 'nested'
    children: Omit<Filter<routeItem, {
        type: 'link'
    }>, 'type'>[];
});
export const dashboardRoot = "/dashboard";

export const adminRoutes: {
    [key: string]: routeItem;
} = {
    inicio: {
        title: "Inicio",
        to: `${dashboardRoot}`,
        type: 'link',
    },
    equipos: {
        title: "Equipamiento",
        type: 'nested',
        children: [
            {
                to: `${dashboardRoot}/equipamiento`,
                title: "General",
            }, {
                to: `${dashboardRoot}/equipamiento/marca`,
                title: "Marcas",
            },
            {
                to: `${dashboardRoot}/equipamiento/margesi`,
                title: "Margesi",
            }
        ]
    },
    ubicacion: {
        title: "Ubicaciones",
        type: 'nested',
        children: [
            {

                title: "Edificaciones",

                to: `${dashboardRoot}/ubicacion/edificacion`,
            },
            {

                title: "Espacios",

                to: `${dashboardRoot}/ubicacion/espacio`,
            },
            {

                title: "Servicios",

                to: `${dashboardRoot}/ubicacion/servicio`,
            }
        ]
    },
    incidencias: {
        title: "Incidencias",
        to: `${dashboardRoot}/incidencias`,
        type: 'link',
    },


    usuarios: {
        title: "Usuarios",
        to: `${dashboardRoot}/usuarios`,
        type: 'link',
    },

}
// {
// equipos: {
//     title: "Equipamiento",
//     to: `${dashboardRoot}/equipamiento`,
//     children: [
//         {
//             to: `${dashboardRoot}/equipamiento/edificaciones`,
//             title: "Edificaciones",
//         }
//     ]
// },
// incidencias: {
//     title: "Incidencias",
//     to: `${dashboardRoot}/incidencias`,
// },
// ubicacion: {
//     title: "Ubicaciones",
//     to: `${dashboardRoot}/ubicacion`,
// },

// usuarios: {
//     title: "Usuarios",
//     to: `${dashboardRoot}/usuarios`,
// },


// }


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
