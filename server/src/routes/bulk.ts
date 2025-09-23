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
  res.status(501).json({ message: "Bulk employee upsert not implemented yet" });
});

const courseSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  isActive: z.boolean().optional(),
});
const coursesSchema = z.object({ rows: z.array(courseSchema) });

router.post("/courses/upsert", validate(coursesSchema), async (req, res, next) => {
  res.status(501).json({ message: "Bulk course upsert not implemented yet" });
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
  res.status(501).json({ message: "Bulk job requirements upsert not implemented yet" });
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
  res.status(501).json({ message: "Bulk trainings upsert not implemented yet" });
});

export default router;
