import { Router } from "express";
import { getEmployees, getEmployeeById, createEmployee, updateEmployee } from "./employee.controller";
import { authenticateToken, authorizeRoles } from "../../middlewares/authorizedRoles";
import validateRequest from "../../middlewares/validateRequest";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.schema";

const router = Router();

// 📌 Only Admins can create and see employees
router.get("/", authenticateToken, authorizeRoles("admin"), getEmployees);
router.post("/", authenticateToken, authorizeRoles("admin"), validateRequest(createEmployeeSchema), createEmployee);

// 📌 Only Managers can see his team and Employees can see only his profile
router.get("/:id", authenticateToken, authorizeRoles("admin", "manager", "employee"), getEmployeeById);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  validateRequest(updateEmployeeSchema),
  updateEmployee,
);

export default router;
