import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

const UserAuthGuard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const roles: string[] = decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
    console.log("🚀 ~ UserAuthGuard ~ roles:", roles)

    if (!roles || !roles.includes("Member")) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserAuthGuard;
