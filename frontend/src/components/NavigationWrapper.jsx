import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { InlineLoader } from "./Spinner";

// Protects the signed-in app shell and keeps the layout mounted while lazy
// pages load (Suspense boundary lives inside the layout).
const NavigationWrapper = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<InlineLoader />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
};

export default NavigationWrapper;
