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
  job_title_id: z.string().optional(),
  department_id: z.string().optional(),
});

const dateString = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  z.string().datetime(),
]);

const bodySchema = z.object({
  emp_code: z.string(),
  name: z.string(),
  employment_date: dateString.optional(),
  job_title_id: z.string().optional(),
  job_title: z.string().optional(),
  department_id: z.string().optional(),
  department_name: z.string().optional(),
  post_code: z.string().optional(),
  post_title: z.string().optional(),
  section_code: z.string().optional(),
  section_title: z.string().optional(),
  department_code: z.string().optional(),
  department_title: z.string().optional(),
  management_code: z.string().optional(),
  management_title: z.string().optional(),
});

router.get("/", validate(querySchema, "query"), async (req, res, next) => {
  try {
    const { q, sort, job_title_id, department_id } =
      req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (q) {
      const n = persianNormalize(q);
      where.name = { contains: n };
    }
    if (job_title_id) where.job_title_id = job_title_id;
    if (department_id) where.department_id = department_id;

    let orderBy: Record<string, "asc" | "desc"> = { emp_code: "asc" }; // Default sort by emp_code
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
    }

    const [total, items] = await Promise.all([
      prisma.personnel.count({ where }),
      prisma.personnel.findMany({ 
        where, 
        orderBy,
        include: {
          personCourses: {
            include: {
              course: true
            }
          },
          orgHistory: true
        }
      }),
    ]);
    
    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/:emp_code", async (req, res, next) => {
  try {
    const item = await prisma.personnel.findUnique({ 
      where: { emp_code: req.params.emp_code },
      include: {
        personCourses: {
          include: {
            course: true
          }
        },
        orgHistory: true
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
    const item = await prisma.personnel.create({ data: req.body });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:emp_code", validate(bodySchema), async (req, res, next) => {
  try {
    const item = await prisma.personnel.update({ 
      where: { emp_code: req.params.emp_code }, 
      data: req.body 
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:emp_code", validate(bodySchema.partial()), async (req, res, next) => {
  try {
    const item = await prisma.personnel.update({ 
      where: { emp_code: req.params.emp_code }, 
      data: req.body 
    });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:emp_code", async (req, res, next) => {
  try {
    const item = await prisma.personnel.delete({
      where: { emp_code: req.params.emp_code },
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
    const result = await prisma.personnel.createMany({
      data: items,
      skipDuplicates: true
    });
    res.status(201).json({ count: result.count });
  } catch (e) {
    next(e);
  }
});

export default router;
