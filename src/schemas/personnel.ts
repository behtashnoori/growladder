import { z } from "zod";
import { Personnel } from "@/db";
import { toStr, normalizeText } from "@/lib/normalize";

export const PersonnelRow = z.object({
  emp_code: z.preprocess(toStr, z.string().min(1, "کد پرسنلی خالی است")),
  name: z.preprocess(toStr, z.string().min(1, "نام خالی است")),
});

export type PersonnelRowType = z.infer<typeof PersonnelRow>;

export function rowToPersonnel(r: PersonnelRowType): Personnel {
  const now = Date.now();
  return {
    emp_code: normalizeText(r.emp_code),
    name: normalizeText(r.name),
    updatedAt: now,
    createdAt: now,
  } as Personnel;
}
