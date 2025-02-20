import mongoose, { Schema, Document } from "mongoose";

export type Employee = {
  user: mongoose.Types.ObjectId;
  department: string;
  position: string;
  manager: mongoose.Types.ObjectId | null; // Manager assignated
  lastEvaluatedAt: { type: Date; default: null }; // Recently added
} & Document;

// Mongoose Schema ====================================================================================================
const employeeSchemaMoongose = new Schema<Employee>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  manager: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

export const Employee = mongoose.model<Employee>("Employee", employeeSchemaMoongose);
