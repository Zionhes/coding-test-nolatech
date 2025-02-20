import { Router } from "express";
import {
  exportEmployeeReportExcel,
  exportEmployeeReportPDF,
  getEmployeeReport,
  getGeneralReport,
} from "./report.controller";
import { authenticateToken, authorizeRoles } from "../../middlewares/authorizedRoles";

const router = Router();

// 📌 Managers y Admins pueden ver reportes individuales de empleados
router.get("/employee/:id", authenticateToken, authorizeRoles("admin", "manager"), getEmployeeReport);

// 📌 Solo Admins pueden ver reportes generales
router.get("/general", authenticateToken, authorizeRoles("admin"), getGeneralReport);

// 📌 Exportar Reporte de un Empleado en PDF y Excel
router.get("/employee/:id/pdf", authenticateToken, authorizeRoles("admin", "manager"), exportEmployeeReportPDF);
router.get("/employee/:id/excel", authenticateToken, authorizeRoles("admin", "manager"), exportEmployeeReportExcel);

export default router;
