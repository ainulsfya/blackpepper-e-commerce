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
description: string | null;
details?: Record<string, unknown>;
highlights?: string[];
how_to_use: string | null;
image: string | null;
image_alt?: string | null;
photo_credit?: string | null;
featured: boolean;
is_active: boolean;
created_at?: string;
};

type ProductForm = {
name: string;
category: string;
kind: string;
color: string;
size: string;
price: string;
description: string;
how_to_use: string;
image: string;
featured: boolean;
is_active: boolean;
};

const initialForm: ProductForm = {
name: "",
category: "",
kind: "",
color: "",
size: "",
price: "",
description: "",
how_to_use: "",
image: "",
featured: false,
is_active: true,
};

export default function AdminDashboard() {
const [products, setProducts] = useState<Product[]>([]);
const [form, setForm] = useState<ProductForm>(initialForm);
const [editingId, setEditingId] = useState<string | null>(null);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [loadingProducts, setLoadingProducts] = useState(true);

// Load products from Supabase
async function loadProducts() {
setLoadingProducts(true);

const { data, error } = await supabase
  .from("products")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  setMessage("Error loading products: " + error.message);
  setLoadingProducts(false);
  return;
}

setProducts((data || []) as Product[]);
setLoadingProducts(false);
}

useEffect(() => {
loadProducts();
}, []);

// Handle form input changes
function handleChange(
e: React.ChangeEvent<
HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>
) {
const target = e.target;

const { name, value } = target;

if (target instanceof HTMLInputElement && target.type === "checkbox") {
  setForm((previous) => ({
    ...previous,
    [name]: target.checked,
  }));
} else {
  setForm((previous) => ({
    ...previous,
    [name]: value,
  }));
}
}

// Add or update product
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();
setMessage("");

if (!form.name.trim() || !form.category.trim() || form.price === "") {
  setMessage("Please fill in product name, category and price.");
  return;
}

const productPrice = Number(form.price);

if (!Number.isFinite(productPrice) || productPrice < 0) {
  setMessage("Please enter a valid product price.");
  return;
}

setLoading(true);

const productData = {
  name: form.name.trim(),
  category: form.category.trim(),
  kind: form.kind || null,
  color: form.color || null,
  size: form.size || null,
  price: productPrice,
  description: form.description || null,
  how_to_use: form.how_to_use || null,
  image: form.image || null,
  featured: form.featured,
  is_active: form.is_active,
  updated_at: new Date().toISOString(),
};

let error;

if (editingId) {
  const result = await supabase
    .from("products")
    .update(productData)
    .eq("id", editingId);

  error = result.error;
} else {
  const result = await supabase
    .from("products")
    .insert([productData]);

  error = result.error;
}

if (error) {
  setMessage("Error saving product: " + error.message);
  setLoading(false);
  return;
}

setMessage(
  editingId
    ? "Product updated successfully!"
    : "Product added successfully!"
);

setForm(initialForm);
setEditingId(null);

await loadProducts();

setLoading(false);
}

// Edit product
function handleEdit(product: Product) {
setEditingId(product.id);

setForm({
  name: product.name || "",
  category: product.category || "",
  kind: product.kind || "",
  color: product.color || "",
  size: product.size || "",
  price: String(product.price ?? ""),
  description: product.description || "",
  how_to_use: product.how_to_use || "",
  image: product.image || "",
  featured: product.featured ?? false,
  is_active: product.is_active ?? true,
});

setMessage("");

window.scrollTo({
  top: 0,
  behavior: "smooth",
});
}

// Cancel editing
function cancelEdit() {
setEditingId(null);
setForm(initialForm);
setMessage("");
}

// Delete product
async function handleDelete(id: string) {
const confirmed = window.confirm(
"Are you sure you want to delete this product?"
);

if (!confirmed) return;

setMessage("");

const { error } = await supabase
  .from("products")
  .delete()
  .eq("id", id);

if (error) {
  setMessage("Error deleting product: " + error.message);
  return;
}

setMessage("Product deleted successfully!");

if (editingId === id) {
  cancelEdit();
}

await loadProducts();
}

// Admin logout
async function handleLogout() {
const { error } = await supabase.auth.signOut();

if (error) {
  setMessage("Logout failed: " + error.message);
  return;
}

window.location.href = "/admin/login";
}

return (
<div style={styles.page}>
<header style={styles.header}>
<div>
<h1 style={styles.logo}>PIPERINE</h1>
<p style={styles.subtitle}>Admin Management Dashboard</p>
</div>

    <button
      type="button"
      style={styles.logoutButton}
      onClick={handleLogout}
    >
      Logout
    </button>
  </header>

  <main style={styles.container}>
    <h2 style={styles.heading}>Product Management</h2>

    <section style={styles.formCard}>
      <h3 style={styles.sectionTitle}>
        {editingId ? "Update Product" : "Add New Product"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter category"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Type</label>
            <input
              name="kind"
              value={form.kind}
              onChange={handleChange}
              placeholder="e.g. pouch, bottle, jar"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Colour</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Enter product colour"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Size</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="e.g. 100g, 250ml"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Price (RM) *</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroupFull}>
            <label style={styles.label}>Product Image URL</label>
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              style={styles.input}
            />

            {form.image && (
              <img
                src={form.image}
                alt="Product preview"
                style={styles.
                  imagePreview}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div style={styles.formGroupFull}>
            <label style={styles.label}>Product Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.formGroupFull}>
            <label style={styles.label}>How to Use</label>
            <textarea
              name="how_to_use"
              value={form.how_to_use}
              onChange={handleChange}
              placeholder="Enter product usage instructions"
              style={styles.textarea}
              rows={3}
            />
          </div>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured Product
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active Product
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p style={styles.message} role="status">
          {message}
        </p>
      )}
    </section>

    <section style={styles.productSection}>
      <div style={styles.listHeader}>
        <h3 style={styles.sectionTitle}>Product List</h3>
        <span style={styles.productCount}>
          Total Products: {products.length}
        </span>
      </div>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found. Add your first product above.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Featured</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={styles.td}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.tableImage}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>

                  <td style={styles.td}>
                    <strong>{product.name}</strong>
                    <br />
                    <small>{product.size || "-"}</small>
                  </td>

                  <td style={styles.td}>
                    {product.category}
                  </td>
                  <td style={styles.td}>
                    RM {Number(product.price).toFixed(2)}
                  </td>

                  <td style={styles.td}>
                    {product.featured ? "Yes" : "No"}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background: product.is_active
                          ? "#e2f4e5"
                          : "#f8dddd",
                        color: product.is_active
                          ? "#28743a"
                          : "#a12b2b",
                      }}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </main>
</div>
);
}

// Dashboard styles
const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "#f5f5f2",
fontFamily: "Arial, sans-serif",
color: "#333",
},

header: {
background: "#252b23",
color: "white",
padding: "20px 5%",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "15px",
},

logo: {
margin: 0,
fontSize: "27px",
letterSpacing: "3px",
},

subtitle: {
margin: "5px 0 0",
fontSize: "13px",
color: "#d5d5d0",
},

logoutButton: {
background: "#8b2929",
color: "white",
border: "none",
padding: "11px 20px",
borderRadius: "6px",
cursor: "pointer",
},

container: {
width: "90%",
maxWidth: "1250px",
margin: "30px auto",
},

heading: {
fontSize: "26px",
marginBottom: "25px",
},

formCard: {
background: "white",
padding: "25px",
borderRadius: "10px",
boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
marginBottom: "35px",
},

sectionTitle: {
fontSize: "20px",
marginTop: 0,
marginBottom: "20px",
},

formGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
gap: "18px",
},

formGroup: {
display: "flex",
flexDirection: "column",
gap: "8px",
},

formGroupFull: {
gridColumn: "1 / -1",
display: "flex",
flexDirection: "column",
gap: "8px",
},

label: {
fontWeight: 600,
fontSize: "14px",
},

input: {
width: "100%",
boxSizing: "border-box",
padding: "12px",
border: "1px solid #ccc",
borderRadius: "6px",
fontSize: "14px",
},

textarea: {
width: "100%",
boxSizing: "border-box",
padding: "12px",
border: "1px solid #ccc",
borderRadius: "6px",
fontSize: "14px",
resize: "vertical",
fontFamily: "Arial, sans-serif",
},

imagePreview: {
width: "150px",
height: "120px",
objectFit: "cover",
borderRadius: "6px",
marginTop: "8px",
},

checkboxGroup: {
display: "flex",
gap: "25px",
flexWrap: "wrap",
marginTop: "22px",
},

checkboxLabel: {
display: "flex",
alignItems: "center",
gap: "8px",
fontSize: "14px",
},

buttonGroup: {
display: "flex",
gap: "12px",
flexWrap: "wrap",
marginTop: "25px",
},

submitButton: {
background: "#344b32",
color: "white",
border: "none",
padding: "12px 22px",
borderRadius: "6px",
cursor: "pointer",
},

cancelButton: {
background: "#777",
color: "white",
border: "none",
padding: "12px 22px",
borderRadius: "6px",
cursor: "pointer",
},

message: {
marginTop: "18px",
fontWeight: 600,
fontSize: "14px",
},

productSection: {
background: "white",
padding: "25px",
borderRadius: "10px",
boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
},listHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "10px",
marginBottom: "15px",
},

productCount: {
fontSize: "14px",
color: "#666",
},

tableWrapper: {
width: "100%",
overflowX: "auto",
},

table: {
width: "100%",
borderCollapse: "collapse",
minWidth: "750px",
fontSize: "14px",
},

th: {
background: "#344b32",
color: "white",
padding: "13px",
textAlign: "left",
whiteSpace: "nowrap",
},

td: {
padding: "13px",
borderBottom: "1px solid #eee",
verticalAlign: "middle",
},

tableImage: {
width: "60px",
height: "60px",
objectFit: "cover",
borderRadius: "6px",
},

status: {
padding: "5px 10px",
borderRadius: "20px",
fontSize: "12px",
fontWeight: 600,
},

actionButtons: {
display: "flex",
gap: "8px",
},

editButton: {
background: "#315b8a",
color: "white",
border: "none",
padding: "8px 13px",
borderRadius: "5px",
cursor: "pointer",
},

deleteButton: {
background: "#a52d2d",
color: "white",
border: "none",
padding: "8px 13px",
borderRadius: "5px",
cursor: "pointer",
},
};