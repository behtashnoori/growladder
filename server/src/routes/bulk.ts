import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const prisma = new PrismaClient();
const router = Router();

const employeeSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  unitId: z.string().optional(),
  rank: z.string().optional(),
  hireDate: z.coerce.date().optional(),
  positionStartDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});
const employeesSchema = z.object({ rows: z.array(employeeSchema) });

router.post("/employees/upsert", validate(employeesSchema), async (req, res, next) => {
  const { rows } = req.body as z.infer<typeof employeesSchema>;
  let inserted = 0;
  let updated = 0;
  const failed: { rowIndex: number; reason: string }[] = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < rows.length; i++) {
      const data = rows[i];
      try {
        const exists = await tx.employee.findUnique({ where: { id: data.id } });
        if (exists) {
          await tx.employee.update({ where: { id: data.id }, data });
          updated++;
        } else {
          await tx.employee.create({ data });
          inserted++;
        }
      } catch (e) {
        failed.push({ rowIndex: i, reason: (e as Error).message });
      }
    }
  });
  res.json({ inserted, updated, failed });
});

const courseSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  isActive: z.boolean().optional(),
});
const coursesSchema = z.object({ rows: z.array(courseSchema) });

router.post("/courses/upsert", validate(coursesSchema), async (req, res, next) => {
  const { rows } = req.body as z.infer<typeof coursesSchema>;
  let inserted = 0;
  let updated = 0;
  const failed: { rowIndex: number; reason: string }[] = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < rows.length; i++) {
      const data = rows[i];
      try {
        const exists = await tx.course.findUnique({ where: { courseId: data.courseId } });
        if (exists) {
          await tx.course.update({ where: { courseId: data.courseId }, data });
          updated++;
        } else {
          await tx.course.create({ data });
          inserted++;
        }
      } catch (e) {
        failed.push({ rowIndex: i, reason: (e as Error).message });
      }
    }
  });
  res.json({ inserted, updated, failed });
});

const jobRequirementSchema = z.object({
  id: z.string(),
  unitId: z.string().optional(),
  jobTitle: z.string(),
  courseId: z.string(),
  type: z.string().optional(),
  priority: z.string().optional(),
});
const jobRequirementsSchema = z.object({ rows: z.array(jobRequirementSchema) });

router.post("/job-requirements/upsert", validate(jobRequirementsSchema), async (req, res, next) => {
  const { rows } = req.body as z.infer<typeof jobRequirementsSchema>;
  let inserted = 0;
  let updated = 0;
  const failed: { rowIndex: number; reason: string }[] = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < rows.length; i++) {
      const data = rows[i];
      try {
        const exists = await tx.jobRequirement.findUnique({ where: { id: data.id } });
        if (exists) {
          await tx.jobRequirement.update({ where: { id: data.id }, data });
          updated++;
        } else {
          await tx.jobRequirement.create({ data });
          inserted++;
        }
      } catch (e) {
        failed.push({ rowIndex: i, reason: (e as Error).message });
      }
    }
  });
  res.json({ inserted, updated, failed });
});

const trainingSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  courseId: z.string(),
  attendancePercent: z.number().min(0).max(100).optional(),
  date: z.coerce.date().optional(),
  status: z.string().optional(),
});
const trainingsSchema = z.object({ rows: z.array(trainingSchema) });

router.post("/trainings/upsert", validate(trainingsSchema), async (req, res, next) => {
  const { rows } = req.body as z.infer<typeof trainingsSchema>;
  let inserted = 0;
  let updated = 0;
  const failed: { rowIndex: number; reason: string }[] = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < rows.length; i++) {
      const data = rows[i];
      try {
        const exists = await tx.training.findUnique({ where: { id: data.id } });
        if (exists) {
          await tx.training.update({ where: { id: data.id }, data });
          updated++;
        } else {
          await tx.training.create({ data });
          inserted++;
        }
      } catch (e) {
        failed.push({ rowIndex: i, reason: (e as Error).message });
      }
    }
  });
  res.json({ inserted, updated, failed });
});

export default router;
