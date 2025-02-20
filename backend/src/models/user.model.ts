import mongoose, { ObjectId } from "mongoose";
import { z } from "zod";
import { ROLES } from "../types/Roles";

// Zod schema and types ===============================================================================================
const userSchemaZod = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters long"),
  lastName: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(ROLES),
  department: z.string().optional(),
});

const userLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

type UserSchema = z.infer<typeof userSchemaZod>;
type UserLoginSchema = z.infer<typeof userSchemaZod>;

// Model type ====================================================================================================
export type IUser = UserSchema & {
  id?: ObjectId;
  createdAt: unknown;
  updatedAt: unknown;
};

// Mongoose Schema ====================================================================================================
const userSchemaMongoose = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    department: { type: String },
  },
  { timestamps: true },
);

// EXPORTS ============================================================================================================
export { userSchemaZod, userLoginSchema };
export type { UserSchema, UserLoginSchema };

export const User = mongoose.model<IUser>("User", userSchemaMongoose);
