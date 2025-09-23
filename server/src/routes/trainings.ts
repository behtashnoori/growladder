import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { persianNormalize } from "../utils/persianNormalize.js";

const prisma = new PrismaClient();
const router = Router();

const querySchema = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sort: z.string().optional(),
  emp_code: z.string().optional(),
  course_code: z.string().optional(),
});

const bodySchema = z.object({
  emp_code: z.string(),
  course_code: z.string(),
  status: z.string().optional(),
  attendancePercent: z.number().int().min(0).max(100).optional(),
  absencePercent: z.number().int().min(0).max(100).optional(),
  hours: z.number().int().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, page = "1", pageSize = "20", sort, emp_code, course_code } =
      req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.status = { contains: n };
    }
    if (emp_code) where.emp_code = emp_code;
    if (course_code) where.course_code = course_code;
    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const pageNum = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const skip = (pageNum - 1) * size;
    const [total, items] = await Promise.all([
      prisma.personCourse.count({ where }),
      prisma.personCourse.findMany({ where, orderBy, skip, take: size }),
    ]);
    res.json({ items, total, page: pageNum, pageSize: size });
  } catch (e) {
    next(e);
  }
});

router.get("/:emp_code/:course_code", async (req, res, next) => {
  try {
    const item = await prisma.personCourse.findUnique({ where: { emp_code_course_code: { emp_code: req.params.emp_code, course_code: req.params.course_code } } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.personCourse.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:emp_code/:course_code", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.personCourse.update({ where: { emp_code_course_code: { emp_code: req.params.emp_code, course_code: req.params.course_code } }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:emp_code/:course_code", validate(bodySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.personCourse.update({ where: { emp_code_course_code: { emp_code: req.params.emp_code, course_code: req.params.course_code } }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:emp_code/:course_code", async (req, res, next) => {
  try {
    const item = await prisma.personCourse.delete({ where: { emp_code_course_code: { emp_code: req.params.emp_code, course_code: req.params.course_code } } });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

export default router;
