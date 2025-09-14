import { z } from "zod";
import type { Employee } from "@/types/employee";

export const employeeSchema = z
  .object({
    id: z.string().min(1, "شناسه الزامی است"),
    name: z.string().min(1, "نام الزامی است"),
    position: z.string().min(1, "پست الزامی است"),
    department: z.string().optional(),
    section: z.string().optional(),
    rank: z.string().min(1, "رده الزامی است"),
    positionStartDate: z.string().min(1, "تاریخ شروع سمت الزامی است"),
    hireDate: z.string().min(1, "تاریخ استخدام الزامی است"),
  })
  .refine((data) => new Date(data.hireDate) <= new Date(), {
    message: "تاریخ استخدام نمی‌تواند در آینده باشد",
    path: ["hireDate"],
  })
  .refine(
    (data) => new Date(data.hireDate) <= new Date(data.positionStartDate),
    {
      message: "تاریخ استخدام باید قبل از تاریخ شروع سمت باشد",
      path: ["hireDate"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.rank !== "مدیر" && !data.department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "اداره الزامی است",
      });
    }
    if (data.rank !== "مدیر" && data.rank !== "رئیس" && !data.section) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["section"],
        message: "بخش الزامی است",
      });
    }
  });

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
