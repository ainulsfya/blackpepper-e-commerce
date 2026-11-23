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

      // Check the same admin_users table that AdminLogin.tsx uses
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (active) {
        setIsAuthorized(Boolean(!error && admin));
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
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}