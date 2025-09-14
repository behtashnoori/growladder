import { OrgUnit } from "@/types/org-unit";
import { getOrgUnits, upsertOrgUnit } from "@/db";

export async function fetchOrgUnits(isIndependent?: boolean): Promise<OrgUnit[]> {
  return getOrgUnits({ isIndependent });
}

export async function saveOrgUnit(unit: OrgUnit): Promise<void> {
  await upsertOrgUnit(unit);
}
