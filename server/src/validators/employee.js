import { z } from "zod";

export const employeeSchema = z
  .object({
    id: z.string(),
    fullName: z.string(),
    unitId: z.string().optional(),
    departmentId: z.string().optional(),
    sectionId: z.string().optional(),
    rank: z.string().optional(),
    hireDate: z.coerce.date().optional(),
    positionStartDate: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.rank === "مدیر") {
      if (data.departmentId || data.sectionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "مدیر نباید اداره یا بخش داشته باشد",
          path: ["departmentId"],
        });
      }
    } else if (data.rank === "رئیس") {
      if (data.sectionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رئیس نباید بخش داشته باشد",
          path: ["sectionId"],
        });
      }
    }
  });
