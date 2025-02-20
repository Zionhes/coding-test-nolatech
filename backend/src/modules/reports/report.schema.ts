import { z } from "zod";
export const employeeReportSchema = z.object({
  id: z.string().min(1, { message: "Employee ID is required." }),
});
