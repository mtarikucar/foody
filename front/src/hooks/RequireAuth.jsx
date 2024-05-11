import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({allowedRoles}) => {
  const { currentUser,companyId } = useSelector((store) => store.auth);

/*  if (!currentUser) return <Navigate to={"/auth/sign-in"} />
  if (companyId == null) return <Navigate to={"/auth/new-company"} />*/
  return <Outlet />;
};

export default RequireAuth;
