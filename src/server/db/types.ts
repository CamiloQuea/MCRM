import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type branch = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    name: string;
    hexColor: string | null;
};
export type building = {
    id: string;
    name: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    branchId: string | null;
    hexColor: string | null;
};
export type buildingfloor = {
    id: string;
    floorNumber: number;
    buildingId: string;
    createdAt: Generated<Timestamp>;
};
export type department = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    name: string;
};
export type equipment = {
    id: string;
    admissionDate: Timestamp;
    serialNumber: string | null;
    codeBar: string | null;
    internalCode: string | null;
    margesiCode: string | null;
    updatedAt: Timestamp;
    createdAt: Generated<Timestamp>;
    equipmentSpecificationSheetId: string | null;
};
export type equipmentbrand = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    name: string;
};
export type equipmentmargesi = {
    id: string;
    code: string | null;
    denomination: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type equipmentspecificationsheet = {
    id: string;
    modelName: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    equipmentBrandId: string | null;
    width: number | null;
    height: number | null;
    lenght: number | null;
    equipmentMargesiId: string | null;
};
export type equipmenttracking = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    equipmentId: string;
    roomId: string;
    date: Timestamp;
    description: string | null;
};
export type incidentreport = {
    id: string;
    code: string;
    createdAt: Generated<Timestamp>;
    description: string | null;
    incidentDate: Timestamp | null;
    departmentId: string | null;
    creatorId: string;
};
export type incidentreportequipment = {
    id: string;
    incidentReportId: string;
    equipmentId: string;
    description: string | null;
    updatedAt: Timestamp;
};
export type incidentreportstatus = {
    id: string;
    assignedAt: Generated<Timestamp>;
    incidentReportId: string;
    statusTypeId: string;
};
export type incidentreportstatustype = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    name: string;
    isDefault: Generated<number>;
};
export type room = {
    id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    name: string;
    parentRoomId: string | null;
    buildingFloorId: string;
    departmentId: string | null;
};
export type DB = {
    branch: branch;
    building: building;
    buildingfloor: buildingfloor;
    department: department;
    equipment: equipment;
    equipmentbrand: equipmentbrand;
    equipmentmargesi: equipmentmargesi;
    equipmentspecificationsheet: equipmentspecificationsheet;
    equipmenttracking: equipmenttracking;
    incidentreport: incidentreport;
    incidentreportequipment: incidentreportequipment;
    incidentreportstatus: incidentreportstatus;
    incidentreportstatustype: incidentreportstatustype;
    room: room;
};
