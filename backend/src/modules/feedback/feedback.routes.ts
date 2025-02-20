import { Router } from "express";
import { submitFeedback, getFeedbackByEvaluation } from "./feedback.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createFeedbackSchema } from "./feedback.schema";
import { authenticateToken, authorizeRoles } from "../../middlewares/authorizedRoles";

const router = Router();

// 📌 Employees pueden enviar feedback sobre sus evaluaciones
router.post("/", authenticateToken, authorizeRoles("employee"), validateRequest(createFeedbackSchema), submitFeedback);

// 📌 Todos los roles pueden ver feedback de una evaluación específica
router.get(
  "/:evaluationId",
  authenticateToken,
  authorizeRoles("admin", "manager", "employee"),
  getFeedbackByEvaluation,
);

export default router;
