
import {
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";



export const businessMapRouter = createTRPCRouter({
  getFullMap: protectedProcedure.query(async ({ ctx }) => {

    const branchesMap = await ctx.prisma.branch.findMany({
     
    })



    const buildingMap = await ctx.prisma.building.findMany({
      where: {
        branchId: null
      },
    
    })

    return {
      banches: branchesMap,
      buildings: buildingMap
    }


    // type braches = typeof branchesMap[number] & {
    //   type: "branch"
    // }

    // type buildings = typeof buildingMap[number] & {
    //   type: "building"
    // }

    // type map = (braches | buildings)[]


    // return [...branchesMap.map((branch) => ({
    //   ...branch,
    //   type: "branch" as const,
    // })), ...buildingMap.map((building) => ({
    //   ...building,
    //   type: "building" as const,
    // }))] satisfies map;

  })
})