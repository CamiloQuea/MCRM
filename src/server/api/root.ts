import { z } from 'zod';
import { procedure, createTRPCRouter } from './trpc';
import { equipmentRouter } from './routers/equipment';
import { equipmentBrandRouter } from './routers/equiptmentBrand';
import { equipmentMargesiRouter } from './routers/equipmentMargasi';
import { buildingRouter } from './routers/building';
import { departmentRouter } from './routers/department';
import { roomRouter } from './routers/room';
import { buildingFloorRouter } from './routers/buildingFloor';
import { incidentRouter } from './routers/incident';
import { userRouter } from './routers/user';
import { incidentStatusTypeRouter } from './routers/incidentStatusType';
import { testRouter } from './routers/test';
import { equipmentTrackingRouter } from './routers/equipmentTracking';
export const appRouter = createTRPCRouter({
  equipment: equipmentRouter,
  equipmentBrand: equipmentBrandRouter,
  equipmentMargesi: equipmentMargesiRouter,
  building: buildingRouter,
  department: departmentRouter,
  room: roomRouter,
  buildingFloor: buildingFloorRouter,
  incident: incidentRouter,
  user: userRouter,
  incidentStatusType: incidentStatusTypeRouter,
  test: testRouter,
  equipmentTracking: equipmentTrackingRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;