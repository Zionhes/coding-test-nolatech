import { z } from "zod";

export const createEvaluationSchema = z.object({
  evaluatorUser: z.string().min(1, "Evaluator user is required"),
  evaluatedUser: z.string().min(1, { message: "Evaluated user ID is required." }), // Debe ser un ID válido
  questions: z
    .array(
      z.object({
        questionId: z.string().min(1, { message: "Question ID is required." }), // Debe ser un ID válido
        score: z.number().min(1).max(5, { message: "Score must be between 1 and 5." }), // 1 a 5
        comment: z.string().optional(),
      }),
    )
    .min(1, { message: "At least one question must be included in the evaluation." }),
});

export const updateEvaluationSchema = z.object({
  questions: z
    .array(
      z.object({
        questionId: z.string().min(1, { message: "Question ID is required." }),
        score: z.number().min(1).max(5, { message: "Score must be between 1 and 5." }),
        comment: z.string().optional(),
      }),
    )
    .min(1, { message: "At least one question must be included in the evaluation." }),
});
