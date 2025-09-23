import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { personnelSchema, personnelUpdateSchema } from "../validators/personnel.js";
import { persianNormalize } from "../utils/persianNormalize.js";

const prisma = new PrismaClient();
const router = Router();

const querySchema = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sort: z.string().optional(),
  unitId: z.string().optional(),
  rank: z.string().optional(),
});

const bodySchema = personnelSchema;

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, page = "1", pageSize = "20", sort, unitId, rank } =
      req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.name = { contains: n };
    }
    if (unitId) where.job_title_id = unitId;
    if (rank) where.department_id = rank;

    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const pageNum = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const skip = (pageNum - 1) * size;

    const [total, items] = await Promise.all([
      prisma.personnel.count({ where }),
      prisma.personnel.findMany({ where, orderBy, skip, take: size }),
    ]);
    res.json({ items, total, page: pageNum, pageSize: size });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.personnel.findUnique({ where: { emp_code: req.params.id } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.personnel.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.personnel.update({ where: { emp_code: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:emp_code", validate(personnelUpdateSchema), async (req, res, next) => {
  try {
    const item = await prisma.personnel.update({ where: { emp_code: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await prisma.personnel.delete({
      where: { emp_code: req.params.id },
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

export default router;
