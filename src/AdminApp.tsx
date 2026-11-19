import {
BrowserRouter,
Routes,
Route,
Navigate,
} from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/admin/AdminRoute";

function AdminApp() {
return (
<BrowserRouter>
<Routes>
<Route
path="/admin"
element={<AdminLogin />}
/>

    <Route element={<AdminRoute />}>
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
    </Route>

    <Route
      path="*"
      element={<Navigate to="/admin" replace />}
    />
  </Routes>
</BrowserRouter>
);
}

export default AdminApp;
