import z from "zod";

const required = "field required";

export const createUserSchema = z.object({
  firstName: z.string().min(2, required),
  lastName: z.string().min(2, required),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "manager", "employee"], { message: "Select a role" }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
