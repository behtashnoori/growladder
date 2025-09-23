import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { persianNormalize } from "../utils/persianNormalize.js";

const prisma = new PrismaClient();
const router = Router();

const querySchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
});

const bodySchema = z.object({
  code: z.string(),
  title: z.string(),
  category: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, sort } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.title = { contains: n };
    }
    let orderBy: Record<string, "asc" | "desc"> = { code: "asc" }; // Default sort by code
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const [total, items] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({ where, orderBy }),
    ]);
    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.course.findUnique({ where: { code: req.params.id } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.course.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.course.update({ where: { code: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", validate(bodySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.course.update({ where: { code: req.params.id }, data: req.body });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await prisma.course.delete({
      where: { code: req.params.id },
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Bulk operations
router.post("/bulk", async (req, res, next) => {
  try {
    const items = req.body as any[];
    const result = await prisma.course.createMany({
      data: items,
      skipDuplicates: true
    });
    res.status(201).json({ count: result.count });
  } catch (e) {
    next(e);
  }
});

export default router;
