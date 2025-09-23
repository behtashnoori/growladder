import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const prisma = new PrismaClient();
const router = Router();

const dateString = z.union([
  // YYYY-MM-DD
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // ISO 8601
  z.string().datetime(),
]);

const positionHistorySchema = z.object({
  emp_code: z.string(),
  post_code: z.string().optional(),
  post_title: z.string().optional(),
  post_rank_code: z.string().optional(),
  post_rank_title: z.string().optional(),
  section_code: z.string().optional(),
  section_title: z.string().optional(),
  department_code: z.string().optional(),
  department_title: z.string().optional(),
  management_code: z.string().optional(),
  management_title: z.string().optional(),
  affiliation: z.string().optional(),
  from_date: dateString,
  to_date: dateString.optional(),
  is_current: z.boolean().optional().default(true),
});

// Get position history for a personnel
router.get("/:emp_code", async (req, res, next) => {
  try {
    const { emp_code } = req.params;
    
    const history = await prisma.personOrgHistory.findMany({
      where: { emp_code },
      orderBy: { from_date: 'desc' }
    });
    
    res.json(history);
  } catch (e) {
    next(e);
  }
});

// Create new position history entry
router.post("/", validate(positionHistorySchema), async (req, res, next) => {
  try {
    const data = req.body;
    
    // If this is a current position, mark all other positions as not current
    if (data.is_current) {
      await prisma.personOrgHistory.updateMany({
        where: { 
          emp_code: data.emp_code,
          is_current: true 
        },
        data: { 
          is_current: false,
          to_date: new Date().toISOString()
        }
      });
    }
    
    const entry = await prisma.personOrgHistory.create({
      data: {
        ...data,
        from_date: new Date(data.from_date),
        to_date: data.to_date ? new Date(data.to_date) : null,
      }
    });
    
    res.status(201).json(entry);
  } catch (e) {
    next(e);
  }
});

// Update position history entry
router.put("/:id", validate(positionHistorySchema.partial()), async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // If making this current, mark others as not current
    if (data.is_current) {
      const entry = await prisma.personOrgHistory.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (entry) {
        await prisma.personOrgHistory.updateMany({
          where: { 
            emp_code: entry.emp_code,
            is_current: true,
            id: { not: parseInt(id) }
          },
          data: { 
            is_current: false,
            to_date: new Date().toISOString()
          }
        });
      }
    }
    
    const updatedEntry = await prisma.personOrgHistory.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        from_date: data.from_date ? new Date(data.from_date) : undefined,
        to_date: data.to_date ? new Date(data.to_date) : undefined,
      }
    });
    
    res.json(updatedEntry);
  } catch (e) {
    next(e);
  }
});

// Delete position history entry
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.personOrgHistory.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// Bulk update position history (for personnel assignment changes)
router.post("/bulk-update", async (req, res, next) => {
  try {
    const { emp_code, newPosition, effectiveDate } = req.body;
    
    // Mark current position as ended
    await prisma.personOrgHistory.updateMany({
      where: { 
        emp_code,
        is_current: true 
      },
      data: { 
        is_current: false,
        to_date: new Date(effectiveDate)
      }
    });
    
    // Create new position entry
    const newEntry = await prisma.personOrgHistory.create({
      data: {
        emp_code,
        ...newPosition,
        from_date: new Date(effectiveDate),
        is_current: true
      }
    });
    
    res.status(201).json(newEntry);
  } catch (e) {
    next(e);
  }
});

export default router;
