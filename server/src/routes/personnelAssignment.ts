import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const prisma = new PrismaClient();
const router = Router();

// Schema for personnel assignment
const assignPersonnelSchema = z.object({
  emp_code: z.string(),
  management_id: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  section_id: z.string().nullable().optional(),
  post_id: z.string().nullable().optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ شروع باید به فرمت YYYY-MM-DD باشد"),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ پایان باید به فرمت YYYY-MM-DD باشد").nullable().optional(),
  affiliation: z.string().optional(),
});

// Get all personnel with their current assignments
router.get("/", async (req, res, next) => {
  try {
    const personnel = await prisma.personnel.findMany({
      include: {
        orgHistory: {
          where: {
            to: null, // Current assignment
          },
          orderBy: {
            from: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(personnel);
  } catch (e) {
    next(e);
  }
});

// Get organizational structure for assignment
router.get("/structure", async (req, res, next) => {
  try {
    // Get all org units organized by type
    const orgUnits = await prisma.orgUnit.findMany({
      orderBy: [
        { unitType: 'asc' },
        { name: 'asc' }
      ]
    });

    // Organize by type
    const structure = {
      managements: orgUnits.filter(unit => unit.unitType === 'management'),
      departments: orgUnits.filter(unit => unit.unitType === 'department'),
      sections: orgUnits.filter(unit => unit.unitType === 'section'),
    };

    res.json(structure);
  } catch (e) {
    next(e);
  }
});

// Get departments for a specific management
router.get("/departments/:managementId", async (req, res, next) => {
  try {
    const { managementId } = req.params;
    
    const departments = await prisma.orgUnit.findMany({
      where: {
        unitType: 'department',
        parentId: managementId
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(departments);
  } catch (e) {
    next(e);
  }
});

// Get sections for a specific department
router.get("/sections/:departmentId", async (req, res, next) => {
  try {
    const { departmentId } = req.params;
    
    const sections = await prisma.orgUnit.findMany({
      where: {
        unitType: 'section',
        parentId: departmentId
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(sections);
  } catch (e) {
    next(e);
  }
});

// Assign personnel to organizational unit
router.post("/assign", validate(assignPersonnelSchema), async (req, res, next) => {
  try {
    const { emp_code, management_id, department_id, section_id, post_id, from_date, to_date, affiliation } = req.body;

    // First, end current assignment if exists
    await prisma.personOrgHistory.updateMany({
      where: {
        emp_code,
        to: null
      },
      data: {
        to: from_date // End current assignment
      }
    });

    // Get names for the assigned units
    const management = management_id ? await prisma.orgUnit.findUnique({
      where: { id: management_id }
    }) : null;

    const department = department_id ? await prisma.orgUnit.findUnique({
      where: { id: department_id }
    }) : null;

    const section = section_id ? await prisma.orgUnit.findUnique({
      where: { id: section_id }
    }) : null;

    const post = post_id ? await prisma.post.findUnique({
      where: { code: post_id }
    }) : null;

    // Create new assignment
    const assignment = await prisma.personOrgHistory.create({
      data: {
        emp_code,
        management_code: management?.id,
        management_title: management?.name,
        department_code: department?.id,
        department_title: department?.name,
        section_code: section?.id,
        section_title: section?.name,
        post_code: post?.code,
        post_title: post?.title,
        affiliation,
        from: from_date,
        to: to_date
      }
    });

    // Update personnel record with current assignment
    await prisma.personnel.update({
      where: { emp_code },
      data: {
        management_code: management?.id,
        management_title: management?.name,
        department_code: department?.id,
        department_title: department?.name,
        section_code: section?.id,
        section_title: section?.name,
        post_code: post?.code,
        post_title: post?.title,
      }
    });

    res.json({
      message: "تخصیص پرسنل با موفقیت انجام شد",
      assignment
    });
  } catch (e) {
    next(e);
  }
});

// Get personnel assignment history
router.get("/history/:emp_code", async (req, res, next) => {
  try {
    const { emp_code } = req.params;
    
    const history = await prisma.personOrgHistory.findMany({
      where: { emp_code },
      orderBy: {
        from: 'desc'
      }
    });

    res.json(history);
  } catch (e) {
    next(e);
  }
});

export default router;
