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
  note: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, sort } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.OR = [
        { code: { contains: n } },
        { title: { contains: n } },
      ];
    }
    let orderBy: Record<string, "asc" | "desc"> = { code: "asc" };
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const [total, items] = await Promise.all([
      prisma.section.count({ where }),
      prisma.section.findMany({ where, orderBy }),
    ]);
    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    const item = await prisma.section.findUnique({ where: { code: req.params.code } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema, "body"), async (req, res, next) => {
  try {
    const item = await prisma.section.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:code", validate(bodySchema, "body"), async (req, res, next) => {
  try {
    const item = await prisma.section.update({
      where: { code: req.params.code },
      data: req.body,
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:code", async (req, res, next) => {
  try {
    const item = await prisma.section.update({
      where: { code: req.params.code },
      data: req.body,
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    await prisma.section.delete({ where: { code: req.params.code } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// Bulk operations
const bulkSchema = z.array(bodySchema);
router.post("/bulk", validate(bulkSchema, "body"), async (req, res, next) => {
  try {
    const items = req.body;
    console.log('Bulk create sections:', items.length, 'items');
    const result = await prisma.section.createMany({
      data: items,
      skipDuplicates: true
    });
    console.log('Bulk create result:', result);
    res.status(201).json({ count: result.count });
  } catch (e) {
    console.error('Bulk create error:', e);
    next(e);
  }
});

export default router;
