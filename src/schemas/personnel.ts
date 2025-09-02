import { z } from "zod";
import { Personnel } from "@/db";

export const PersonnelRow = z.object({
  emp_code: z.string().min(1),
  name: z.string().min(1),
  job_title_id: z.string().optional(),
  job_title: z.string().optional(),
  department_id: z.string().optional(),
  department_name: z.string().optional(),
});

export type PersonnelRowType = z.infer<typeof PersonnelRow>;

function canonicalize(s: string): string {
  return s
    .replace(/\u200c/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

export function rowToPersonnel(r: PersonnelRowType): Personnel {
  const now = Date.now();
  return {
    emp_code: r.emp_code,
    name: canonicalize(r.name),
    job_title_id: r.job_title_id,
    job_title: r.job_title ? canonicalize(r.job_title) : undefined,
    department_id: r.department_id,
    department_name: r.department_name
      ? canonicalize(r.department_name)
      : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

