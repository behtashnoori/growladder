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
  department_id: z.string().optional(),
});

const bodySchema = z.object({
  job_title_id: z.string(),
  job_title: z.string(),
  department_name: z.string().optional(),
  department_id: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, page = "1", pageSize = "20", sort, department_id } =
      req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.job_title = { contains: n };
    }
    if (department_id) where.department_id = department_id;

    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }
    const pageNum = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const skip = (pageNum - 1) * size;

    const [total, items] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({ 
        where, 
        orderBy, 
        skip, 
        take: size,
        include: {
          jobCourseReqs: {
            include: {
              course: true
            }
          }
        }
      }),
    ]);
    res.json({ items, total, page: pageNum, pageSize: size });
  } catch (e) {
    next(e);
  }
});

router.get("/:job_title_id", async (req, res, next) => {
  try {
    const item = await prisma.job.findUnique({ 
      where: { job_title_id: req.params.job_title_id },
      include: {
        jobCourseReqs: {
          include: {
            course: true
          }
        }
      }
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.job.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:job_title_id", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.job.update({ 
      where: { job_title_id: req.params.job_title_id }, 
      data: req.body 
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:job_title_id", validate(bodySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.job.update({ 
      where: { job_title_id: req.params.job_title_id }, 
      data: req.body 
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:job_title_id", async (req, res, next) => {
  try {
    const item = await prisma.job.delete({
      where: { job_title_id: req.params.job_title_id },
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
    const result = await prisma.job.createMany({
      data: items,
      skipDuplicates: true
    });
    res.status(201).json({ count: result.count });
  } catch (e) {
    next(e);
  }
});

export default router;
