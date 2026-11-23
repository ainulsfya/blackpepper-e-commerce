import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
        }
        return;
      }

      // Option A: Check role in user_metadata / app_metadata
      const metadataRole =
        session.user.app_metadata?.role || session.user.user_metadata?.role;

      // Option B: Check a profiles/admins table in Supabase (recommended)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const hasAdminRole =
        metadataRole === "admin" || profile?.role === "admin";

      if (active) {
        setIsAuthorized(Boolean(hasAdminRole));
        setLoading(false);
      }
    }

    checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthorized(false);
        setLoading(false);
      } else {
        checkAdminAccess();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: "24px" }}>Verifying admin access...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}