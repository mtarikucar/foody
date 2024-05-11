import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";

const RequireAuth = ({allowedRoles}) => {
  const auth = useAuth()

  if (!auth.currentUser) return <Navigate to={"/auth/sign-in"} />
  if (auth.companyId == null) return <Navigate to={"/auth/new-company"} />
  if (auth.branchId == null) return <Navigate to={"/auth/select-branch"} />
  /* if (!currentUser?.role?.find(role => allowedRoles?.includes(role))) return <Navigate to={"/"} /> */
  return <Outlet />;
};

export default RequireAuth;
