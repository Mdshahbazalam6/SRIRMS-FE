// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useContext, type JSX } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  requiredRole?: "ADMIN" | "USER";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, admin, userToken, adminToken } = useContext(AuthContext);
  //  userToken: null,
  //   adminToken: null,
  console.log("iuoewpdc[ iewofpdc", requiredRole);
  if (
    (requiredRole === "USER" && !userToken) ||
    (requiredRole === "ADMIN" && !adminToken)
  ) {
    console.log(requiredRole, "requiredRole");
    // Not logged in? Go to login
    return (
      <Navigate
        to={requiredRole === "USER" ? "/login" : "/admin-login"}
        replace
      />
    );
  }

  if (
    requiredRole &&
    requiredRole === "ADMIN" &&
    // @ts-ignore
    admin?.role !== requiredRole
  ) {
    // Logged in but wrong role? Go to unauthorized or dashboard
    return <Navigate to="/admin-login" replace />;
  } else if (
    requiredRole &&
    requiredRole === "USER" &&
    // @ts-ignore
    user?.role !== requiredRole
  ) {
    // Logged in but wrong role? Go to unauthorized or dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
