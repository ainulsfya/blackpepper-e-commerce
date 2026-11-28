import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../lib/supabase";

type AdminRouteProps = {
  children: ReactNode;
  onUnauthorized?: () => void;
  fallback?: ReactNode;
};

export default function AdminRoute({
  children,
  onUnauthorized,
  fallback = null,
}: AdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminAccess(
      currentSession?: { user: { id: string } } | null
    ) {
      if (!active) return;
      setLoading(true);

      let session = currentSession;
      if (session === undefined) {
        const { data } = await supabase.auth.getSession();
        session = data.session;
      }

      if (!session?.user) {
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
        }
        return;
      }

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
    } = supabase.auth.onAuthStateChange(
      (_event: any, session: { user: { id: string; }; } | null | undefined) => {
        if (!active) return;
        if (!session) {
          setIsAuthorized(false);
          setLoading(false);
        } else {
          checkAdminAccess(session);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !isAuthorized && onUnauthorized) {
      onUnauthorized();
    }
  }, [loading, isAuthorized, onUnauthorized]);

  if (loading) {
    return <div style={{ padding: "24px" }}>Verifying admin access...</div>;
  }

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}