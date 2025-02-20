import mongoose, { Schema, Document } from "mongoose";

export type IFeedback = Document & {
  evaluation: mongoose.Types.ObjectId; // Relación con Evaluations
  author: mongoose.Types.ObjectId; // Relación con Users
  comment: string;
  createdAt: Date;
};

const feedbackSchema = new Schema<IFeedback>({
  evaluation: { type: Schema.Types.ObjectId, ref: "Evaluation", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true, minlength: 5 },
  createdAt: { type: Date, default: Date.now },
});

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
