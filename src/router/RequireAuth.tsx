import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ROUTE_NAMES } from "@/components/utils/constant";

const RequireAuth = () => {
  const { isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.app
  );

  // 🚫 DO NOT redirect until Firebase is checked
  if (!authChecked) {
    return null; // or loader
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTE_NAMES.LOGIN} replace />
  );
};


export default RequireAuth;
