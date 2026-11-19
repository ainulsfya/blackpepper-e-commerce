import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminRoute() {
const [checking, setChecking] = useState(true);
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
let active = true;

async function checkAdmin() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    if (active) setChecking(false);
    return;
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (active) {
    setIsAdmin(!!admin);
    setChecking(false);
  }
}

checkAdmin();

return () => {
  active = false;
};
}, []);

if (checking) return <p>Checking access...</p>;

return isAdmin
? <Outlet />
: <Navigate to="/admin" replace />;
}