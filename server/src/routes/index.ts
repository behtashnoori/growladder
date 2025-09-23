import { Router } from "express";
import employees from "./employees.js";
import personnel from "./personnel.js";
import courses from "./courses.js";
import jobs from "./jobs.js";
import jobRequirements from "./jobRequirements.js";
import trainings from "./trainings.js";
import bulk from "./bulk.js";
import posts from "./posts.js";
import postRanks from "./postRanks.js";
import sections from "./sections.js";
import departments from "./departments.js";
import managements from "./managements.js";
import orgStructure from "./orgStructure.js";
import personnelAssignment from "./personnelAssignment.js";
import positionHistory from "./positionHistory.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.use("/api/employees", employees);
router.use("/api/personnel", personnel);
router.use("/api/courses", courses);
router.use("/api/jobs", jobs);
router.use("/api/job-requirements", jobRequirements);
router.use("/api/trainings", trainings);
router.use("/api/bulk", bulk);
router.use("/api/posts", posts);
router.use("/api/post-ranks", postRanks);
router.use("/api/sections", sections);
router.use("/api/departments", departments);
router.use("/api/managements", managements);
router.use("/api/org-structure", orgStructure);
router.use("/api/personnel-assignment", personnelAssignment);
router.use("/api/position-history", positionHistory);

export default router;
