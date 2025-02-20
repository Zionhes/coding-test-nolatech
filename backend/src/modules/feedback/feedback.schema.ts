import { z } from "zod";

export const createFeedbackSchema = z.object({
  evaluation: z.string().min(1, { message: "Evaluation ID is required." }), // Must be a valid ID
  comment: z
    .string()
    .min(5, { message: "Comment must have at least 5 characters." })
    .max(500, { message: "Comment cannot exceed 500 characters." }),
});
