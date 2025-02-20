import { Response } from "express";
import { Evaluation } from "../../models/evaluations.model";
import { User } from "../../models/user.model";
import { Employee } from "../../models/employee.model";

export const getAllEvaluations = async (_: any, res: Response) => {
  try {
    const evaluations = await Evaluation.find().populate(["evaluatedUser", "evaluatorUser"]);
    res.status(201).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving evaluations" });
  }
};

// ADMIN, MANAGER
export const createEvaluation = async (req: any, res: Response) => {
  try {
    const { evaluatedUser, evaluatorUser, questions } = req.body;

    const existingUser = await User.findById(evaluatedUser);

    // Verify if user exists
    if (!existingUser) {
      res.status(404).json({ message: "Evaluated user not found" });
      return;
    }

    // // Nobody can evaluate themselves
    // if (evaluatedUser === req.user._id.toString()) {
    //   res.status(400).json({ message: "You cannot evaluate yourself" });
    //   return;
    // }

    // Register Date of last evaluation for reports
    await Employee.findOneAndUpdate({ user: evaluatedUser }, { lastEvaluatedAt: new Date() });

    const evaluation = new Evaluation({
      evaluatedUser,
      evaluatorUser,
      // evaluatorUser: req.user._id, // Manager or Admin
      questions,
      status: "pending",
    });

    await evaluation.save();
    res.status(201).json(evaluation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating evaluation" });
  }
};

// LIMITED ACCESS BY ROLE
export const getEvaluationById = async (req: any, res: Response) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate("evaluatedUser evaluatorUser");
    if (!evaluation) {
      res.status(404).json({ message: "Evaluation not found" });

      return;
    }
    // Employees solo pueden ver sus propias evaluaciones
    if (req.user.role === "employee" && req.user._id.toString() !== evaluation.evaluatedUser.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving evaluation" });
  }
};

// Obtener todas las evaluaciones de un empleado
export const getEmployeeEvaluations = async (req: any, res: Response) => {
  try {
    const employeeId = req.params.id;

    // Employees solo pueden ver sus propias evaluaciones
    if (req.user.role === "employee" && req.user._id.toString() !== employeeId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const evaluations = await Evaluation.find({ evaluatedUser: employeeId }).populate("evaluatorUser");
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving evaluations" });
  }
};
