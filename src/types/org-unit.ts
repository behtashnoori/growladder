export type OrgUnitType = "management" | "department" | "section" | "post";

export interface OrgUnit {
  id: string;
  name: string;
  unitType: OrgUnitType;
  parentId?: string | null;
  isIndependent?: boolean;
  headRoleAllowed?: string[];
}

export const ROOT_ORG_ID = "ROOT";
