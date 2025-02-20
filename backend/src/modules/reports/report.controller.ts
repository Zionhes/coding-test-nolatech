import { Request, Response } from "express";
import { Feedback } from "../../models/feedback.model";
import { User } from "../../models/user.model";
import { Evaluation } from "../../models/evaluations.model";

const PDFDocument = require("pdfkit");
import ExcelJS from "exceljs";

// 📌 Reporte Individual de un Empleado
export const getEmployeeReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 📌 Verificar que el usuario exista
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // 📌 Obtener Evaluaciones y Feedbacks
    const evaluations = await Evaluation.find({ evaluatedUser: id }).populate(
      "evaluatorUser",
      "firstName lastName role",
    );
    const feedbacks = await Feedback.find({ evaluation: { $in: evaluations.map((e) => e._id) } })
      .lean()
      .populate("author", "firstName lastName");

    // // 📌 Calcular promedio de puntajes del empleado
    // const totalScores = evaluations.reduce((sum, evalDoc) => sum + evalDoc.questions.reduce((qSum, q) => qSum + q.score, 0), 0);
    // const totalQuestions = evaluations.reduce((count, evalDoc) => count + evalDoc.questions.length, 0);
    // const averageScore = totalQuestions > 0 ? totalScores / totalQuestions : 0;

    res.json({ user, evaluations, feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
};

interface QuestionStats {
  total: number;
  count: number;
}

// 📌 Reporte General de Evaluaciones
export const getGeneralReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    // 📌 Aplicar filtro de fecha si se proporcionan
    const dateFilter: Record<string, any> = {};
    if (startDate) dateFilter["submittedAt"] = { $gte: new Date(startDate as string) };
    if (endDate) dateFilter["submittedAt"] = { ...dateFilter["submittedAt"], $lte: new Date(endDate as string) };

    const evaluations = await Evaluation.find(dateFilter)
      .populate("evaluatedUser", "firstName lastName")
      .populate("evaluatorUser", "firstName lastName");

    // 📌 Cambiamos la estructura para que TypeScript lo reconozca
    const stats: Record<string, QuestionStats> = {};

    evaluations.forEach((evalDoc) => {
      evalDoc.questions.forEach((q) => {
        const questionId = q.questionId.toString(); // Convertir ObjectId a string

        if (!stats[questionId]) {
          stats[questionId] = { total: 0, count: 0 };
        }

        stats[questionId].total += q.score;
        stats[questionId].count += 1;
      });
    });

    const averages = Object.entries(stats).map(([questionId, data]) => ({
      questionId,
      averageScore: data.total / data.count,
    }));

    res.json({ totalEvaluations: evaluations.length, averages });
  } catch (error) {
    res.status(500).json({ message: "Error generating general report" });
  }
};

// 📌 Exportar Reporte de un Empleado a PDF
export const exportEmployeeReportPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 📌 Verificar si el empleado existe
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // 📌 Obtener las evaluaciones del empleado
    const evaluations = await Evaluation.find({ evaluatedUser: id }).populate("evaluatorUser", "firstName lastName");

    // 📌 Configurar el PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename=employee_report_${id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(16).text(`Employee Report: ${user.firstName} ${user.lastName}`, { align: "center" });
    doc.moveDown();

    evaluations.forEach((evalDoc, index) => {
      doc.fontSize(12).text(`Evaluation #${index + 1}`);
      //@ts-ignore
      doc.text(`Evaluator: ${evalDoc.evaluatorUser.firstName} ${evalDoc.evaluatorUser.lastName}`);
      doc.text(`Date: ${evalDoc.submittedAt.toDateString()}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF report" });
  }
};

// 📌 Exportar Reporte de un Empleado a Excel
export const exportEmployeeReportExcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 📌 Verificar si el empleado existe
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // 📌 Obtener las evaluaciones del empleado
    const evaluations = await Evaluation.find({ evaluatedUser: id }).populate("evaluatorUser", "firstName lastName");

    // 📌 Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employee Report");

    // 📌 Agregar encabezados
    sheet.addRow(["Evaluation #", "Evaluator", "Date"]);

    evaluations.forEach((evalDoc, index) => {
      sheet.addRow([
        index + 1,
        //@ts-ignore
        `${evalDoc.evaluatorUser.firstName} ${evalDoc.evaluatorUser.lastName}`,
        evalDoc.submittedAt.toDateString(),
      ]);
    });

    // 📌 Configurar la respuesta HTTP para descargar el archivo
    res.setHeader("Content-Disposition", `attachment; filename=employee_report_${id}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // 📌 Enviar el archivo al cliente
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating Excel report" });
  }
};
