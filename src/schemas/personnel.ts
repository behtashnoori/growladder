import { z } from "zod";
import { Personnel } from "@/db";
import { toStr, normalizeText } from "@/lib/normalize";

export const PersonnelRow = z.object({
  emp_code: z.preprocess(toStr, z.string().min(1, "کد پرسنلی خالی است")),
  name: z.preprocess(toStr, z.string().min(1, "نام خالی است")),
  employment_date: z.preprocess(toStr, z.string().optional()),
});

export type PersonnelRowType = z.infer<typeof PersonnelRow>;

export function rowToPersonnel(r: PersonnelRowType): Personnel {
  const now = Date.now();
  return {
    emp_code: normalizeText(r.emp_code),
    name: normalizeText(r.name),
    employment_date: r.employment_date ? new Date(r.employment_date).getTime() : undefined,
    updatedAt: now,
    createdAt: now,
  } as Personnel;
}
