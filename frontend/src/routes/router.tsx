import { ErrorBoundaryPage } from "@/pages/ErrorBoundaryPage";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import NotRequireAuth from "./HOC/NotRequireAuth";
import { LoginPage } from "@/pages/surface/login/LoginPage";
import { RegisterPage } from "@/pages/surface/register/RegisterPage";
import { INDEX, privates, publics } from "./pathConstants";
import HomePage from "@/pages/dashboard/00-home/HomePage";
import RequireAuth from "./HOC/RequireAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import EmployeesPage from "@/pages/dashboard/03-employees/EmployeesPage";
import UsersPage from "@/pages/dashboard/01-users/UsersPage";
import EvaluationsPage from "@/pages/dashboard/04-evaluations/EvaluationsPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
// import ReportsPage from "@/pages/dashboard/05-reports/ReportsPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundaryPage />}>
      {/* Surface routes */}
      <Route element={<NotRequireAuth />}>
        <Route path={INDEX} element={<LoginPage />} />
        <Route path={publics.REGISTER} element={<RegisterPage />} />
        <Route path={publics.RECOVERY} element={<span>Recovery Page</span>} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route element={<RequireAuth allowedRoles={["admin", "manager", "employee"]} />}>
          <Route path={privates.DASHBOARD} element={<HomePage />} />

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path={privates.USERS} element={<UsersPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin", "manager"]} />}>
            <Route path={privates.EVALUATIONS} element={<EvaluationsPage />} />
          </Route>

          <Route path={privates.EMPLOYEES} element={<EmployeesPage />} />
          {/* <Route path={privates.REPORTS} element={<ReportsPage />} /> */}
        </Route>
      </Route>
      <Route path={"/unauthorized"} element={<UnauthorizedPage />} />
    </Route>,
  ),
);
