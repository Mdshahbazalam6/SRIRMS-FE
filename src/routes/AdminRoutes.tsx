import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminRoute from "../components/ProtectedAdminRoute";
import AdminDashboard from "../pages/AdminDashboard";

const AdminRoutes = () => {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/admin-login" element={<AdminLogin />} />

    //     <Route
    //       path="/admin"
    //       element={
    //         <AdminRoute>
    //           <AdminDashboard />
    //         </AdminRoute>
    //       }
    //     />
    //   </Routes>
    // </BrowserRouter>
    <></>
  );
};

export default AdminRoutes;
