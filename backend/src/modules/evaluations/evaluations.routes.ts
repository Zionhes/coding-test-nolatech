import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../../middlewares/authorizedRoles";
import {
  createEvaluation,
  getAllEvaluations,
  getEmployeeEvaluations,
  getEvaluationById,
} from "./evaluations.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createEvaluationSchema } from "./evaluations.schema";

const router = Router();

// 📌 Get all evaluations
router.get("/", authenticateToken, authorizeRoles("admin"), getAllEvaluations);

// 📌 Create evaluations
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  validateRequest(createEvaluationSchema),
  createEvaluation,
);

router.get("/:id", authenticateToken, authorizeRoles("admin", "manager", "employee"), getEvaluationById);

// 📌 Employee can only see his evaluations
router.get("/employee/:id", authenticateToken, authorizeRoles("admin", "manager", "employee"), getEmployeeEvaluations);

export default router;
