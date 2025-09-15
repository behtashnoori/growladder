import { Router } from "express";
import employees from "./employees.js";
import courses from "./courses.js";
import jobRequirements from "./jobRequirements.js";
import trainings from "./trainings.js";
import bulk from "./bulk.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.use("/api/employees", employees);
router.use("/api/courses", courses);
router.use("/api/job-requirements", jobRequirements);
router.use("/api/trainings", trainings);
router.use("/api/bulk", bulk);

export default router;
