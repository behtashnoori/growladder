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
  employeeId: z.string().optional(),
  courseId: z.string().optional(),
});

const bodySchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  courseId: z.string(),
  attendancePercent: z.number().int().min(0).max(100).optional(),
  date: z.coerce.date().optional(),
  status: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, page = "1", pageSize = "20", sort, employeeId, courseId } =
      req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.status = { contains: n };
    }
    if (employeeId) where.employeeId = employeeId;
    if (courseId) where.courseId = courseId;
    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const pageNum = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const skip = (pageNum - 1) * size;
    const [total, items] = await Promise.all([
      prisma.training.count({ where }),
      prisma.training.findMany({ where, orderBy, skip, take: size }),
    ]);
    res.json({ items, total, page: pageNum, pageSize: size });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.training.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.training.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.training.update({ where: { id: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", validate(bodySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.training.update({ where: { id: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await prisma.training.delete({ where: { id: req.params.id } });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

export default router;
