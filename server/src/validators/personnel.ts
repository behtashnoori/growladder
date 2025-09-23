import { z } from "zod";

export const personnelSchema = z.object({
  emp_code: z.string(),
  name: z.string(),
  job_title_id: z.string().optional(),
  job_title: z.string().optional(),
  department_id: z.string().optional(),
  department_name: z.string().optional(),
  post_code: z.string().optional(),
  post_title: z.string().optional(),
  section_code: z.string().optional(),
  section_title: z.string().optional(),
  department_code: z.string().optional(),
  department_title: z.string().optional(),
  management_code: z.string().optional(),
  management_title: z.string().optional(),
});

export const personnelUpdateSchema = personnelSchema.partial();

