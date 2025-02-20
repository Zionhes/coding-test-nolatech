import { Navigate, Outlet, useLocation } from "react-router";
import { publics } from "../pathConstants";
import { useAppSelector } from "@/hooks/reduxTypedHooks";

type Props = {
  allowedRoles: string | string[];
};

export default function RequireAuth({ allowedRoles }: Props) {
  const location = useLocation();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  if (!isAuthenticated) return <Navigate to={publics.LOGIN} state={{ from: location }} replace />;

  return isAuthenticated && allowedRoles?.includes(user?.role!) ? (
    <Outlet />
  ) : (
    isAuthenticated && <Navigate to={"/unauthorized"} state={{ from: location }} replace />
  );
}
