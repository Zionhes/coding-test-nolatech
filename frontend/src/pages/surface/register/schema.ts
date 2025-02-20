import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must have at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must have at least 2 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  role: z.enum(["admin", "manager", "employee"]).optional(),
});

export type RegisteSchema = z.infer<typeof registerSchema>;
