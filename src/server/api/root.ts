import { z } from 'zod';
import { procedure, createTRPCRouter } from './trpc';
import { equipmentRouter } from './routers/equipment';
import { equipmentBrandRouter } from './routers/equiptmentBrand';
import { equipmentMargesiRouter } from './routers/equipmentMargasi';
import { buildingRouter } from './routers/building';
import { departmentRouter } from './routers/department';
import { roomRouter } from './routers/room';
import { buildingFloorRouter } from './routers/buildingFloor';
export const appRouter = createTRPCRouter({
  equipment: equipmentRouter,
  equipmentBrand: equipmentBrandRouter,
  equipmentMargesi: equipmentMargesiRouter,
  building: buildingRouter,
  department: departmentRouter,
  room: roomRouter,
  buildingFloor: buildingFloorRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;