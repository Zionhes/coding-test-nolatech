import { Request, Response } from "express";
import { Feedback } from "../../models/feedback.model";
import { Evaluation } from "../../models/evaluations.model";

// EMPLOYEE
export const submitFeedback = async (req: any, res: Response) => {
  try {
    const { evaluation, comment } = req.body;

    // Verify if evaluation exists
    const existingEvaluation = await Evaluation.findById(evaluation);
    if (!existingEvaluation) {
      res.status(404).json({ message: "Evaluation not found" });
      return;
    }

    // Verificar que el empleado solo envíe feedback sobre sus evaluaciones
    if (req.user.role === "employee" && req.user._id.toString() !== existingEvaluation.evaluatedUser.toString()) {
      res.status(403).json({ message: "Unauthorized to submit feedback for this evaluation" });
      return;
    }

    // Verificar que no exista un feedback previo de este empleado para esta evaluación
    const existingFeedback = await Feedback.findOne({
      evaluation,
      author: req.user._id,
    });
    if (existingFeedback) {
      res.status(400).json({ message: "You have already submitted feedback for this evaluation" });
      return;
    }

    // Prevent submit feedback if evaluation is pending
    if (existingEvaluation.status !== "completed") {
      res.status(400).json({ message: "You cannot submit feedback for an evaluation that is not completed." });
      return;
    }

    const feedback = new Feedback({ evaluation, author: req.user._id, comment });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback" });
  }
};

export const getFeedbackByEvaluation = async (req: Request, res: Response) => {
  try {
    const { evaluationId } = req.params;
    const feedback = await Feedback.find({ evaluation: evaluationId })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });

    if (!feedback.length) {
      res.status(404).json({ message: "No feedback found for this evaluation" });
      return;
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving feedback" });
  }
};
