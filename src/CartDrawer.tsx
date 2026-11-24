import { useState } from "react";

export type CartProduct = {
  name: string;
  category: string;
  size: string;
  price: string;
  image?: string;
};

type CartDrawerProps = {
  mode: "cart" | "wishlist";
  cart: Record<string, number>;
  cartItems: CartProduct[];
  wishlistItems: CartProduct[];
  cartCount: number;
  cartTotal: number;
  onClose: () => void;
  onUpdateQuantity: (product: CartProduct, change: number) => void;
  onRemoveFromCart: (product: CartProduct) => void;
  onClearCart: () => void;
  onMoveWishlistToCart: (product: CartProduct) => void;
  onToggleWishlist: (product: CartProduct) => void;
  onBrowseCatalogue: () => void;
};

type CheckoutStep = "cart" | "checkout" | "completed";

export default function CartDrawer({
  mode,
  cart,
  cartItems,
  wishlistItems,
  cartCount,
  cartTotal,
  onClose,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onMoveWishlistToCart,
  onToggleWishlist,
  onBrowseCatalogue,
}: CartDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "fpx" | "ewallet">("card");
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paidTotal, setPaidTotal] = useState(0);

  // Group cart items by category (like Fruits / Juices / Salads in your mockup)
  const groupedCartItems = cartItems.reduce<Record<string, CartProduct[]>>(
    (groups, item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      return groups;
    },
    {}
  );

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError("");

    if (!customerName.trim() || !customerEmail.trim() || !deliveryAddress.trim()) {
      setCheckoutError("Please fill in your name, email, and delivery address.");
      return;
    }

    setSubmitting(true);

    const env = (import.meta as any).env ?? {};
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setSubmitting(false);
      setCheckoutError("Could not place order: Supabase configuration is missing.");
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          total_amount: Number(cartTotal.toFixed(2)),
          status: "Pending",
        }),
      });

      if (!response.ok) {
        const details = await response.json().catch(() => null);
        throw new Error(details?.message ?? response.statusText ?? "Request failed");
      }
    } catch (error) {
      setSubmitting(false);
      setCheckoutError(
        "Could not place order: " + (error instanceof Error ? error.message : "Request failed")
      );
      return;
    }

    setSubmitting(false);

    setPaidTotal(cartTotal);
    onClearCart();
    setStep("completed");
  }

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={styles.backdrop}
    >
      <aside role="dialog" aria-modal="true" style={styles.drawer}>
        {/* STEP 3: COMPLETED SCREEN */}
        {mode === "cart" && step === "completed" ? (
          <div style={styles.fullColumn}>
            <div style={styles.greenHeader}>
              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  onClose();
                }}
                style={styles.circleIconBtn}
                aria-label="Close"
              >
                ←
              </button>
              <h2 style={styles.greenHeaderTitle}>Completed</h2>
              <div style={{ width: 34 }} />
            </div>

            <div style={styles.completedBody}>
              <div style={styles.checkCircle}>
                <span style={styles.checkMark}>✓</span>
              </div>
              <h3 style={styles.completedHeading}>Payment Completed Successful</h3>
              <p style={styles.completedSub}>
                Your order of <strong>RM {paidTotal.toFixed(2)}</strong> has been placed.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  onClose();
                }}
                style={styles.greenFullBtn}
              >
                BACK TO STORE
              </button>
            </div>
          </div>
        ) : mode === "cart" && step === "checkout" ? (
          /* STEP 2: CHECKOUT & PAYMENT SCREEN */
          <form onSubmit={handlePayNow} style={styles.fullColumn}>
            <div style={styles.checkoutTopBar}>
              <button
                type="button"
                onClick={() => setStep("cart")}
                style={styles.outlineBackBtn}
                aria-label="Back to cart"
              >
                ←
              </button>
              <span style={styles.totalBillText}>
                Total Bill : <strong style={{ color: "#d9822b" }}>RM {cartTotal.toFixed(2)}</strong>
              </span>
            </div>

            <div style={styles.scrollBody}>
              {/* Store -> Home Address Route Card */}
              <div style={styles.routeCard}>
                <div style={styles.routeRow}>
                  <span style={styles.routeDot}>🏪</span>
                  <div>
                    <strong style={styles.routeTitle}>Piperine Botanical Store</strong>
                    <p style={styles.routeSub}>
                      {cartCount} {cartCount === 1 ? "Item" : "Items"} · Kuala Nerang, Kedah
                    </p>
                  </div>
                </div>

                <div style={styles.routeConnector} />

                <div style={styles.routeRow}>
                  <span style={styles.routeDot}>📍</span>
                  <div style={{ flex: 1 }}>
                    <strong style={styles.routeTitle}>Home Delivery Details</strong>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      style={styles.checkoutInput}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      style={styles.checkoutInput}
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address (Street, Postcode, State)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      style={styles.checkoutInput}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={styles.paymentSection}>
                <h3 style={styles.sectionLabel}>Payment Method</h3>

                {[
                  { id: "card", label: "Credit / Debit Card", badge: "VISA • MC" },
                  { id: "fpx", label: "Online Banking (FPX)", badge: "MYR" },
                  { id: "ewallet", label: "DuitNow QR / E-Wallet", badge: "QR" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as "card" | "fpx" | "ewallet")}
                    style={{
                      ...styles.paymentOption,
                      borderColor: paymentMethod === opt.id ? "#2d5a27" : "#e5dccb",
                      backgroundColor: paymentMethod === opt.id ? "#f2f7f1" : "#ffffff",
                    }}
                  >
                    <span style={styles.radioOuter}>
                      {paymentMethod === opt.id && <span style={styles.radioInner} />}
                    </span>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: "14px" }}>
                      {opt.label}
                    </span>
                    <span style={styles.payBadge}>{opt.badge}</span>
                  </label>
                ))}
              </div>

              {checkoutError && <p style={styles.errorBanner}>{checkoutError}</p>}
            </div>

            <div style={styles.bottomFooter}>
              <button type="submit" disabled={submitting} style={styles.greenFullBtn}>
                {submitting ? "PROCESSING..." : "PAY NOW"}
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: SHOPPING CART (OR WISHLIST) VIEW */
          <div style={styles.fullColumn}>
            <div style={styles.greenHeader}>
              <button
                type="button"
                onClick={onClose}
                style={styles.circleIconBtn}
                aria-label="Back"
              >
                ←
              </button>
              <h2 style={styles.greenHeaderTitle}>
                {mode === "cart" ? "Shopping Cart" : "Saved Wishlist"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                style={styles.circleIconBtn}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={styles.scrollBody}>
              {mode === "wishlist" ? (
                wishlistItems.length === 0 ? (
                  <div style={styles.emptyBox}>
                    <p style={{ fontWeight: 600 }}>No saved products yet.</p>
                    <button type="button" onClick={onBrowseCatalogue} style={styles.greenFullBtn}>
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  wishlistItems.map((item) => (
                    <div key={item.name} style={styles.itemCard}>
                      <img
                        src={item.image || "/images/piperine-logo.png"}
                        alt={item.name}
                        style={styles.itemThumb}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={styles.itemName}>{item.name}</strong>
                        <div style={styles.itemPrice}>{item.price}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onMoveWishlistToCart(item)}
                        style={styles.moveBtn}
                      >
                        + Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(item)}
                        style={styles.trashBtn}
                        aria-label="Remove"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                )
              ) : cartItems.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={{ fontWeight: 600, fontSize: "16px", marginBottom: "6px" }}>
                    Your shopping cart is empty.
                  </p>
                  <p style={{ fontSize: "13px", color: "#6d6252", marginBottom: "18px" }}>
                    Explore our black pepper botanicals and add items to begin.
                  </p>
                  <button type="button" onClick={onBrowseCatalogue} style={styles.greenFullBtn}>
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                Object.entries(groupedCartItems).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: "18px" }}>
                    <div style={styles.categoryHeader}>{category}</div>
                    {items.map((item) => {
                      const qty = cart[item.name] || 1;
                      return (
                        <div key={item.name} style={styles.itemCard}>
                          <img
                            src={item.image || "/images/piperine-logo.png"}
                            alt={item.name}
                            style={styles.itemThumb}
                          />

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.itemTopRow}>
                              <strong style={styles.itemName}>{item.name}</strong>
                              <button
                                type="button"
                                onClick={() => onRemoveFromCart(item)}
                                style={styles.trashBtn}
                                title="Remove item"
                                aria-label={`Remove ${item.name}`}
                              >
                                🗑
                              </button>
                            </div>

                            {item.size && <div style={styles.itemSize}>{item.size}</div>}

                            <div style={styles.itemBottomRow}>
                              <span style={styles.itemPrice}>{item.price}</span>

                              {/* Stepper [- 1 +] matching mockup */}
                              <div style={styles.stepper}>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item, -1)}
                                  style={styles.stepBtn}
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span style={styles.stepValue}>{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item, 1)}
                                  style={styles.stepBtn}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Dual-Pill Bottom Bar matching mockup: [ Total: RM XX | (Bag Count) | Place Order ] */}
            {mode === "cart" && cartItems.length > 0 && (
              <div style={styles.bottomFooter}>
                <div style={styles.dualPillBar}>
                  <div style={styles.dualPillLeft}>
                    <span style={{ fontSize: "12px", opacity: 0.9 }}>Total:</span>{" "}
                    <strong style={{ color: "#ffd54f", fontSize: "15px" }}>
                      RM {cartTotal.toFixed(2)}
                    </strong>
                  </div>

                  <div style={styles.centerBagBadge} title={`${cartCount} items in cart`}>
                    <span style={styles.centerBagInner}>
                      🛍 <small style={{ fontWeight: 700 }}>{cartCount}</small>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    style={styles.dualPillRightBtn}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(18, 28, 16, 0.52)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "100%",
    maxWidth: "420px",
    height: "100%",
    backgroundColor: "#f8f4ec",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  fullColumn: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  greenHeader: {
    backgroundColor: "#2d5a27",
    color: "#ffffff",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greenHeaderTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  circleIconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#2d5a27",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollBody: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 18px",
  },
  categoryHeader: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#4a4236",
    backgroundColor: "#ece4d4",
    padding: "6px 12px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  itemCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "10px",
    border: "1px solid #e7decb",
    boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
  },
  itemThumb: {
    width: "64px",
    height: "64px",
    borderRadius: "10px",
    objectFit: "cover",
    backgroundColor: "#f6f0e4",
    flexShrink: 0,
  },
  itemTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  itemName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f241d",
  },
  itemSize: {
    fontSize: "11.5px",
    color: "#7a7060",
    marginTop: "2px",
  },
  itemBottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  itemPrice: {
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#d9822b",
  },
  trashBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "15px",
    opacity: 0.65,
    padding: "2px 4px",
  },
  stepper: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #d5c9b4",
    borderRadius: "999px",
    padding: "2px 8px",
    backgroundColor: "#faf6ee",
  },
  stepBtn: {
    border: "none",
    background: "transparent",
    color: "#2d5a27",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    padding: "0 4px",
  },
  stepValue: {
    fontSize: "13px",
    fontWeight: 700,
    minWidth: "16px",
    textAlign: "center",
    color: "#1f241d",
  },
  bottomFooter: {
    padding: "14px 18px 18px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e7decb",
  },
  dualPillBar: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    height: "52px",
    borderRadius: "14px",
    overflow: "visible",
    boxShadow: "0 8px 20px rgba(45, 90, 39, 0.22)",
  },
  dualPillLeft: {
    flex: 1,
    backgroundColor: "#2d5a27",
    color: "#ffffff",
    borderTopLeftRadius: "14px",
    borderBottomLeftRadius: "14px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "16px",
    gap: "4px",
  },
  centerBagBadge: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
    zIndex: 2,
  },
  centerBagInner: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "2px solid #2d5a27",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    color: "#2d5a27",
  },
  dualPillRightBtn: {
    flex: 1,
    backgroundColor: "#e09126",
    color: "#ffffff",
    border: "none",
    borderTopRightRadius: "14px",
    borderBottomRightRadius: "14px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    paddingRight: "14px",
    textAlign: "right",
  },
  checkoutTopBar: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e7decb",
  },
  outlineBackBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1px solid #cbbda4",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  totalBillText: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1f241d",
  },
  routeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid #e7decb",
    marginBottom: "16px",
  },
  routeRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  routeDot: {
    fontSize: "18px",
    marginTop: "2px",
  },
  routeTitle: {
    display: "block",
    fontSize: "14px",
    color: "#1f241d",
  },
  routeSub: {
    margin: "2px 0 0",
    fontSize: "12px",
    color: "#6d6252",
  },
  routeConnector: {
    width: "2px",
    height: "20px",
    borderLeft: "2px dashed #cbbda4",
    marginLeft: "9px",
    marginTop: "6px",
    marginBottom: "6px",
  },
  checkoutInput: {
    width: "100%",
    boxSizing: "border-box",
    marginTop: "8px",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #d5c7ae",
    backgroundColor: "#faf6ee",
    fontSize: "13px",
  },
  paymentSection: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid #e7decb",
  },
  sectionLabel: {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f241d",
  },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 12px",
    borderRadius: "10px",
    border: "1.5px solid #e5dccb",
    marginBottom: "8px",
    cursor: "pointer",
  },
  radioOuter: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid #2d5a27",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#2d5a27",
  },
  payBadge: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#2d5a27",
    backgroundColor: "#e6f0e4",
    padding: "3px 8px",
    borderRadius: "6px",
  },
  greenFullBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2d5a27",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "14px",
    letterSpacing: "0.04em",
    cursor: "pointer",
  },
  completedBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    textAlign: "center",
  },
  checkCircle: {
    width: "86px",
    height: "86px",
    borderRadius: "50%",
    border: "3px solid #2d5a27",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    backgroundColor: "#eef6ed",
  },
  checkMark: {
    fontSize: "40px",
    color: "#2d5a27",
    fontWeight: 700,
  },
  completedHeading: {
    margin: "0 0 8px",
    fontSize: "19px",
    color: "#1f241d",
  },
  completedSub: {
    margin: "0 0 28px",
    fontSize: "14px",
    color: "#5f5648",
  },
  emptyBox: {
    textAlign: "center",
    padding: "48px 20px",
  },
  moveBtn: {
    padding: "6px 10px",
    backgroundColor: "#2d5a27",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBanner: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "12.5px",
  },
};