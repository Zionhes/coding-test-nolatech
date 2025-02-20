import { Navigate, Outlet, useLocation } from "react-router";
import { privates } from "../pathConstants";
import { useAppSelector } from "@/hooks/reduxTypedHooks";

export default function NotRequireAuth() {
  const location = useLocation();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to={privates.DASHBOARD} state={{ from: location }} replace />;
}
