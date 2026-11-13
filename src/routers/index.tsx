import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";
import Area from "../pages/area/Area";
import EditArea from "../pages/area/EditArea";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import Login from "../pages/auth/Login/Login";
import SetupArea from "../pages/auth/Signup/SetupArea";
import Signup from "../pages/auth/Signup/Signup";
import Home from "../pages/home/Home";
import NewReport from "../pages/reports/NewReport";
import ReportSaved from "../pages/reports/ReportSaved";
import Reports from "../pages/reports/Reports";

export default function Routers() {
  return (
    <Routes>
      {/* Auth — observers register themselves; no invitation needed. */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/area" element={<SetupArea />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Observer screens */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/new" element={<NewReport />} />
          <Route path="/reports/saved" element={<ReportSaved />} />
          <Route path="/area" element={<Area />} />
          <Route path="/area/edit" element={<EditArea />} />
        </Route>
      </Route>

      {/* The landing site lives on its own domain; everything else, the root
          included, resolves to the dashboard — or to the auth screens via
          ProtectedRoute. */}
      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

/** Carries the hash along, so a `/#login` link still reaches Sign in. */
function Fallback() {
  const { hash } = useLocation();
  return <Navigate to={{ pathname: "/app", hash }} replace />;
}
