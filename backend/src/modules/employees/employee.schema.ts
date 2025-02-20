import { z } from "zod";

// 📌 Validación para crear un nuevo empleado
export const createEmployeeSchema = z.object({
  user: z.string().min(1, { message: "User ID is required." }), // Debe ser un ID válido
  department: z.string().min(2, { message: "Department must have at least 2 characters." }),
  position: z.string().min(2, { message: "Position must have at least 2 characters." }),
  manager: z.string().optional(), // Puede ser null si no tiene manager
});

// 📌 Validación para actualizar un empleado
export const updateEmployeeSchema = z.object({
  department: z.string().min(2, { message: "Department must have at least 2 characters." }).optional(),
  position: z.string().min(2, { message: "Position must have at least 2 characters." }).optional(),
  manager: z.string().optional(),
});
