import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import limitRequests from "./middlewares/limitRequests";
import { applyMiddlewares } from "./middlewares";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import evaluationsRoutes from "./modules/evaluations/evaluations.routes";
import reportsRoutes from "./modules/reports/report.routes";

dotenv.config();
connectDB();

const app = express();

applyMiddlewares(app);

app.use("/api/auth", limitRequests, authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/evaluations", evaluationsRoutes);
app.use("/api/reports", reportsRoutes);
// app.use("/api/questions", employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on PORT ", PORT));
