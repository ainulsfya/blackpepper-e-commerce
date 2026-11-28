import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  kind: string | null;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  description: string | null;
  image: string | null;
  featured: boolean;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type Tab = "overview" | "products" | "orders" | "customers" | "analytics";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Raw BlackPepper",
    price: 0,
    stock: 0,
    description: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);

    const { data: prodData } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (prodData) setProducts(prodData);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (orderData) setOrders(orderData);

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([newProduct]);
    if (!error) {
      setNewProduct({
        name: "",
        category: "Raw Pepper",
        price: 0,
        stock: 0,
        description: "",
      });
      fetchDashboardData();
    } else {
      alert("Error adding product: " + error.message);
    }
  }

  async function handleUpdateStock(id: string, newStock: number) {
    if (newStock < 0) return;
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    }
  }

  async function handleOrderStatus(id: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const uniqueCustomers = Array.from(
    new Map(orders.map((o) => [o.customer_email, o])).values()
  );

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>Piperine Admin</h2>
        <nav style={styles.nav}>
          {(["overview", "products", "orders", "customers", "analytics"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === tab ? "#2e7d32" : "transparent",
                color: activeTab === tab ? "#fff" : "#ccc",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div>
                <h1>Dashboard Overview</h1>
                <div style={styles.kpiGrid}>
                  <div style={styles.card}>
                    <h3>Total Revenue</h3>
                    <p style={styles.kpiValue}>RM {totalRevenue.toFixed(2)}</p>
                  </div>
                  <div style={styles.card}>
                    <h3>Total Orders</h3>
                    <p style={styles.kpiValue}>{orders.length}</p>
                  </div>
                  <div style={styles.card}>
                    <h3>Total Products</h3>
                    <p style={styles.kpiValue}>{products.length}</p>
                  </div>
                  <div style={styles.card}>
                    <h3>Low Stock Alerts (&lt;10)</h3>
                    <p style={{ ...styles.kpiValue, color: "#d32f2f" }}>
                      {products.filter((p) => (p.stock || 0) < 10).length}
                    </p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div style={{ ...styles.card, marginTop: "24px" }}>
                  <h3>Recent Activities</h3>
                  <ul style={styles.activityList}>
                    {orders.slice(0, 5).map((order) => (
                      <li key={order.id} style={styles.activityItem}>
                        <span>
                          <strong>{order.customer_name}</strong> placed an order worth{" "}
                          <strong>RM {Number(order.total_amount).toFixed(2)}</strong>
                        </span>
                        <span style={styles.badge}>{order.status}</span>
                      </li>
                    ))}
                    {orders.length === 0 && <p>No recent order activity.</p>}
                  </ul>
                </div>
              </div>
            )}

            {/* 2. PRODUCT & STOCK MANAGEMENT TAB */}
            {activeTab === "products" && (
              <div>
                <h1>Product & Stock Management</h1>

                <form onSubmit={handleAddProduct} style={styles.formCard}>
                  <h3>Add New Product</h3>
                  <div style={styles.formRow}>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      style={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                      style={styles.input}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price (RM)"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      required
                      style={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="Initial Stock"
                      value={newProduct.stock || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      required
                      style={styles.input}
                    />
                    <button type="submit" style={styles.primaryBtn}>
                      + Add Product
                    </button>
                  </div>
                </form>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Current Stock</th>
                      <th style={styles.th}>Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td style={styles.td}>{product.name}</td>
                        <td style={styles.td}>{product.category}</td>
                        <td style={styles.td}>RM {product.price.toFixed(2)}</td>
                        <td style={styles.td}>
                          <strong style={{ color: (product.stock || 0) < 10 ? "red" : "green" }}>
                            {product.stock ?? 0} units
                          </strong>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleUpdateStock(product.id, (product.stock || 0) - 1)}
                            style={styles.stockBtn}
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateStock(product.id, (product.stock || 0) + 1)}
                            style={styles.stockBtn}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleUpdateStock(product.id, (product.stock || 0) + 10)}
                            style={styles.stockBtn}
                          >
                            +10
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h1>Order Management</h1>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td style={styles.td}>{order.id.slice(0, 8)}...</td>
                        <td style={styles.td}>
                          {order.customer_name} <br />
                          <small>{order.customer_email}</small>
                        </td>
                        <td style={styles.td}>RM {Number(order.total_amount).toFixed(2)}</td>
                        <td style={styles.td}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                            style={styles.input}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. CUSTOMERS TAB */}
            {activeTab === "customers" && (
              <div>
                <h1>Customers ({uniqueCustomers.length})</h1>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Orders Placed</th>
                      <th style={styles.th}>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueCustomers.map((cust) => {
                      const custOrders = orders.filter((o) => o.customer_email === cust.customer_email);
                      const spent = custOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
                      return (
                        <tr key={cust.customer_email}>
                          <td style={styles.td}>{cust.customer_name}</td>
                          <td style={styles.td}>{cust.customer_email}</td>
                          <td style={styles.td}>{custOrders.length}</td>
                          <td style={styles.td}>RM {spent.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div>
                <h1>Sales & Inventory Analytics</h1>
                <div style={styles.kpiGrid}>
                  <div style={styles.card}>
                    <h3>Average Order Value</h3>
                    <p style={styles.kpiValue}>
                      RM {orders.length ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div style={styles.card}>
                    <h3>Total Inventory Value</h3>
                    <p style={styles.kpiValue}>
                      RM{" "}
                      {products
                        .reduce((sum, p) => sum + p.price * (p.stock || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ ...styles.card, marginTop: "24px" }}>
                  <h3>Stock Distribution by Category</h3>
                  {Array.from(new Set(products.map((p) => p.category))).map((cat) => {
                    const catStock = products
                      .filter((p) => p.category === cat)
                      .reduce((sum, p) => sum + (p.stock || 0), 0);
                    return (
                      <div key={cat} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{cat}</span>
                          <span>{catStock} units</span>
                        </div>
                        <div style={styles.progressBg}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${Math.min(catStock, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#f4f6f8" },
  sidebar: { width: "240px", backgroundColor: "#1b1f23", color: "#fff", padding: "20px", display: "flex", flexDirection: "column" },
  brand: { fontSize: "18px", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "15px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  navBtn: { padding: "12px", border: "none", borderRadius: "6px", textAlign: "left", cursor: "pointer", fontSize: "15px" },
  logoutBtn: { padding: "12px", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  main: { flex: 1, padding: "30px" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" },
  kpiValue: { fontSize: "24px", fontWeight: "bold", marginTop: "10px", color: "#2e7d32" },
  activityList: { listStyle: "none", padding: 0, marginTop: "15px" },
  activityItem: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" },
  badge: { backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  formCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" },
  formRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" },
  input: { padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" },
  primaryBtn: { padding: "8px 16px", backgroundColor: "#2e7d32", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" },
  th: { textAlign: "left", padding: "12px", backgroundColor: "#f0f2f5", borderBottom: "1px solid #ddd" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
  stockBtn: { marginRight: "5px", padding: "4px 10px", cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff" },
  progressBg: { width: "100%", height: "10px", backgroundColor: "#eee", borderRadius: "5px", marginTop: "5px" },
  progressFill: { height: "100%", backgroundColor: "#2e7d32", borderRadius: "5px" },
};