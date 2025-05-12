import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AdminNavbar } from "../components/AdminNavbar";

const AdminAuthGuard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/adminLogin" replace />;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const roles: string[] = decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
    console.log("🚀 ~ AdminAuthGuard ~ roles:", roles)

    if (!roles || !roles.includes("Staff")) {
      return <Navigate to="/adminLogin" replace />;
    }
  } catch (error) {
    return <Navigate to="/adminLogin" replace />;
  }

  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};

export default AdminAuthGuard;
