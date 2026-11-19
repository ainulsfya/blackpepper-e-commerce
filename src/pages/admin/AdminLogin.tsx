import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleLogin(e: React.FormEvent) {
e.preventDefault();
setError("");
setLoading(true);

const { data, error: loginError } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

if (loginError || !data.user) {
  setError(loginError?.message || "Login failed.");
  setLoading(false);
  return;
}

const { data: admin, error: adminError } =
  await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

if (adminError || !admin) {
  await supabase.auth.signOut();
  setError("You are not authorised as an admin.");
  setLoading(false);
  return;
}

navigate("/admin/dashboard");
setLoading(false);
}

return (
<div className="admin-login">
<h1>PIPERINE</h1>
<h2>Admin Login</h2>

  <form onSubmit={handleLogin}>
    <input
      type="email"
      placeholder="Admin Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    {error && <p style={{ color: "red" }}>{error}</p>}

    <button type="submit" disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>
);
}