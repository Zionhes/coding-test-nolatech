import mongoose, { Schema, Document } from "mongoose";

export type IEvaluation = Document & {
  evaluatedUser: mongoose.Types.ObjectId;
  evaluatorUser: mongoose.Types.ObjectId; // (Manager or Admin)
  questions: { questionId: mongoose.Types.ObjectId; score: number; comment?: string }[];
  submittedAt: Date;
  status: "pending" | "completed";
};

const evaluationSchema = new Schema<IEvaluation>({
  evaluatedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  evaluatorUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
      score: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // 📌 Nuevo campo
});

export const Evaluation = mongoose.model<IEvaluation>("Evaluation", evaluationSchema);
