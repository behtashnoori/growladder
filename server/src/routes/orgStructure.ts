import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const prisma = new PrismaClient();
const router = Router();

// Schema for creating org unit
const createOrgUnitSchema = z.object({
  name: z.string().min(1),
  unitType: z.enum(["management", "department", "section"]),
  parentId: z.string().optional(),
  isIndependent: z.boolean().default(false),
  headRoleAllowed: z.boolean().default(false),
});

// Schema for updating org unit
const updateOrgUnitSchema = createOrgUnitSchema.partial();

// Schema for moving units
const moveUnitSchema = z.object({
  unitId: z.string(),
  newParentId: z.string().nullable(),
});

// Get full organizational tree
router.get("/tree", async (req, res, next) => {
  try {
    // Get all org units
    const allUnits = await prisma.orgUnit.findMany({
      orderBy: [
        { isIndependent: 'desc' },
        { name: 'asc' }
      ]
    });

    // Build tree structure
    const buildTree = (parentId: string | null = null): any[] => {
      return allUnits
        .filter(unit => unit.parentId === parentId)
        .map(unit => ({
          ...unit,
          children: buildTree(unit.id)
        }));
    };

    const tree = buildTree();
    res.json({ tree });
  } catch (e) {
    next(e);
  }
});

// Get available units for selection (exclude already assigned ones)
router.get("/available", async (req, res, next) => {
  try {
    const { unitType, excludeId } = req.query;
    
    const where: any = {};
    if (unitType) {
      where.unitType = unitType;
    }
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const units = await prisma.orgUnit.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json({ units });
  } catch (e) {
    next(e);
  }
});

// Create new org unit
router.post("/", validate(createOrgUnitSchema, "body"), async (req, res, next) => {
  try {
    const orgUnit = await prisma.orgUnit.create({
      data: req.body
    });
    res.status(201).json(orgUnit);
  } catch (e) {
    next(e);
  }
});

// Update org unit
router.put("/:id", validate(updateOrgUnitSchema, "body"), async (req, res, next) => {
  try {
    const orgUnit = await prisma.orgUnit.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(orgUnit);
  } catch (e) {
    next(e);
  }
});

// Move org unit to different parent
router.post("/move", validate(moveUnitSchema, "body"), async (req, res, next) => {
  try {
    const { unitId, newParentId } = req.body;

    // Prevent circular references
    if (newParentId) {
      const checkCircular = async (id: string, targetId: string): Promise<boolean> => {
        const unit = await prisma.orgUnit.findUnique({
          where: { id },
          select: { parentId: true }
        });
        
        if (!unit?.parentId) return false;
        if (unit.parentId === targetId) return true;
        
        return checkCircular(unit.parentId, targetId);
      };

      if (await checkCircular(unitId, newParentId)) {
        return res.status(400).json({ message: "Circular reference detected" });
      }
    }

    const orgUnit = await prisma.orgUnit.update({
      where: { id: unitId },
      data: { parentId: newParentId }
    });

    res.json(orgUnit);
  } catch (e) {
    next(e);
  }
});

// Delete org unit
router.delete("/:id", async (req, res, next) => {
  try {
    // Check if unit has children
    const childrenCount = await prisma.orgUnit.count({
      where: { parentId: req.params.id }
    });

    if (childrenCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete unit with children. Please move or delete children first." 
      });
    }

    await prisma.orgUnit.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// Initialize org structure from master data
router.post("/initialize", async (req, res, next) => {
  try {
    // Get all master data
    const [managements, departments, sections] = await Promise.all([
      prisma.management.findMany({ orderBy: { code: 'asc' } }),
      prisma.department.findMany({ orderBy: { code: 'asc' } }),
      prisma.section.findMany({ orderBy: { code: 'asc' } })
    ]);

    // Clear existing org units
    await prisma.orgUnit.deleteMany({});

    // Create management units (top level)
    const managementUnits = await Promise.all(
      managements.map(mgmt => 
        prisma.orgUnit.create({
          data: {
            id: `mgmt_${mgmt.code}`,
            name: mgmt.title,
            unitType: "management",
            isIndependent: false,
            headRoleAllowed: true
          }
        })
      )
    );

    // Create departments (will be assigned to managements later)
    const departmentUnits = await Promise.all(
      departments.map(dept => 
        prisma.orgUnit.create({
          data: {
            id: `dept_${dept.code}`,
            name: dept.title,
            unitType: "department",
            isIndependent: false,
            headRoleAllowed: true
          }
        })
      )
    );

    // Create sections (will be assigned to departments later)
    const sectionUnits = await Promise.all(
      sections.map(section => 
        prisma.orgUnit.create({
          data: {
            id: `sect_${section.code}`,
            name: section.title,
            unitType: "section",
            isIndependent: false,
            headRoleAllowed: false
          }
        })
      )
    );

    res.json({
      message: "Organization structure initialized successfully",
      counts: {
        managements: managementUnits.length,
        departments: departmentUnits.length,
        sections: sectionUnits.length
      }
    });
  } catch (e) {
    next(e);
  }
});

export default router;
