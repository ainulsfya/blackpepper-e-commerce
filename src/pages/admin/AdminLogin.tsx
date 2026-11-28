import { useState } from "react";
import { supabase } from "../../lib/supabase";

type AdminLoginProps = {
  onLoginSuccess: () => void;
};

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
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

    const { data: admin, error: adminError } = await supabase
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

    setLoading(false);
    onLoginSuccess();
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandHeader}>
          <img
            src="/images/piperine-logo.png"
            alt="Piperine Logo"
            style={styles.logo}
          />
          <h1 style={styles.brandName}>PIPERINE</h1>
          <p style={styles.subtitle}>Admin Login</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Admin Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.buttonWrapper}>
            <button type="submit" disabled={loading} style={styles.loginButton}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    backgroundColor: "#f6f0e4",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fffdf8",
    border: "1px solid #e6dcc8",
    borderRadius: "18px",
    padding: "36px 32px",
    boxShadow: "0 12px 30px rgba(38, 56, 29, 0.08)",
  },
  brandHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    width: "84px",
    height: "84px",
    objectFit: "contain",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    padding: "6px",
    border: "1px solid #e6dcc8",
    marginBottom: "14px",
  },
  brandName: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "#244723",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6d6252",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#3a3329",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#1f1d1a",
    backgroundColor: "#faf6ee",
    border: "1px solid #d5c7ae",
    borderRadius: "10px",
    outline: "none",
  },
  errorText: {
    margin: 0,
    fontSize: "13px",
    color: "#b91c1c",
    textAlign: "center",
    backgroundColor: "#fef2f2",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "8px",
  },
  loginButton: {
    minWidth: "150px",
    padding: "11px 28px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#2d5a27",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(45, 90, 39, 0.22)",
  },
};