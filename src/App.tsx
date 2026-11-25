import { useEffect, useMemo, useState } from "react";

type Product = {
  name: string;
  category: string;
  kind: "pouch" | "bottle" | "jar" | "spray";
  color: string;
  size: string;
  price: string;
  description: string;
  details: string;
  highlights: string[];
  howToUse: string;
  image?: string;
  imageAlt?: string;
  photoCredit?: string;
  featured?: boolean;
};

type ChatMessage = {
  from: "bot" | "customer";
  text: string;
};

const categories = [
  { name: "F&B", description: "Honey, tea & pepper candy", number: "01" },
  { name: "Personal Care", description: "Oils, scrubs & artisan soap", number: "02" },
  { name: "Healthcare", description: "Herbal care & slimming gel", number: "03" },
  { name: "Safety", description: "Everyday pepper protection", number: "04" },
];

const catalogueContent: Record<string, { title: string; subtitle: string; collection: string }> = {
  All: {
    title: "Purposeful care,\nrooted in pepper.",
    subtitle: "The complete Piperine collection · 10 products",
    collection: "Products crafted with locally grown pepper in Kuala Nerang, Kedah.",
  },
  "F&B": {
    title: "A little warmth\nfor your table.",
    subtitle: "F&B · Honey, tea & pepper candy · 3 products",
    collection: "Pantry essentials with a warm Piperine finish.",
  },
  "Personal Care": {
    title: "Botanical rituals\nfor everyday care.",
    subtitle: "Personal Care · Oils, scrub, soap & massage care · 4 products",
    collection: "Body-care essentials created for thoughtful daily rituals.",
  },
  Healthcare: {
    title: "Warmth made\nfor daily wellbeing.",
    subtitle: "Healthcare · Herbal care & body gel · 2 products",
    collection: "Traditional-inspired products for a considered wellness routine.",
  },
  Safety: {
    title: "Confidence that\ntravels with you.",
    subtitle: "Safety · Everyday personal protection · 1 product",
    collection: "A compact personal-safety essential designed for everyday carry.",
  },
};

const products: Product[] = [
  {
    name: "Pepper Candy",
    category: "F&B",
    kind: "pouch",
    color: "#d97b2f",
    size: "80g",
    price: "RM 12.90",
    description: "A sweet, gently warming candy with the bright finish of local black pepper.",
    details:
      "A pocket-sized treat balancing gentle sweetness with the distinctive warmth of locally grown black pepper. Individually wrapped for sharing or enjoying on the go.",
    highlights: ["Made with Kedah black pepper", "Individually wrapped", "Convenient travel pouch"],
    howToUse: "Enjoy one piece whenever you want a sweet treat with a warming pepper finish.",
    image: "/images/products/pepper-candy.png",
    imageAlt: "Piperine black pepper candy pouch",
    featured: true,
  },
  {
    name: "Black Pepper Honey",
    category: "F&B",
    kind: "jar",
    color: "#bd7428",
    size: "250g",
    price: "RM 28.90",
    description: "Golden honey infused with an aromatic pepper warmth for drinks and breakfast.",
    details:
      "Smooth golden honey infused with aromatic black pepper for a layered sweet-and-warm flavour. A versatile pantry companion for both drinks and food.",
    highlights: ["Aromatic pepper infusion", "Versatile pantry staple", "Rich golden texture"],
    howToUse: "Stir into warm water or tea, drizzle over toast, or pair with breakfast dishes.",
    image: "/images/products/black-pepper-honey.png",
    imageAlt: "Piperine black pepper honey jar",
  },
  {
    name: "Pepper Leaf Tea",
    category: "F&B",
    kind: "pouch",
    color: "#667c43",
    size: "20 sachets",
    price: "RM 18.90",
    description: "A soothing herbal infusion made for a calm and comforting daily ritual.",
    details:
      "A fragrant herbal tea made with pepper leaves and selected botanicals. Each sachet is portioned for an easy, comforting cup at home or at work.",
    highlights: ["20 convenient sachets", "Naturally aromatic", "Caffeine-free herbal ritual"],
    howToUse: "Steep one sachet in hot water for 3–5 minutes. Enjoy warm, with honey if preferred.",
    image: "/images/products/pepper-leaf-tea.png",
    imageAlt: "Piperine black pepper tea box",
    featured: true,
  },
  {
    name: "Pepper Essential Oil",
    category: "Personal Care",
    kind: "bottle",
    color: "#536d3e",
    size: "15ml",
    price: "RM 24.90",
    description: "A concentrated, earthy essential oil with a warm and grounding aroma.",
    details:
      "A concentrated aromatic oil capturing black pepper’s warm, woody character. Created for carefully diluted use in personal aromatherapy routines.",
    highlights: [
      "Concentrated botanical aroma",
      "Warm and grounding profile",
      "Compact amber bottle",
    ],
    howToUse:
      "Dilute with a suitable carrier oil before topical use or add a few drops to a compatible diffuser. Do not use undiluted.",
    image: "/images/products/pepper-essential-oil.png",
    imageAlt: "Piperine black pepper essential oil dropper bottle",
  },
  {
    name: "Pepper Body Scrub",
    category: "Personal Care",
    kind: "jar",
    color: "#a9704f",
    size: "180g",
    price: "RM 32.90",
    description: "A rich exfoliating scrub that leaves skin smooth, refreshed and softly scented.",
    details:
      "A textured body polish combining botanical ingredients with a subtle black pepper warmth. Designed to support a smooth, refreshed body-care routine.",
    highlights: ["Gentle physical exfoliation", "Botanical body care", "Warm aromatic finish"],
    howToUse:
      "Massage a small amount onto damp body skin in circular motions, then rinse thoroughly. Use 1–2 times weekly.",
    image: "/images/products/pepper-body-scrub.png",
    imageAlt: "Piperine black pepper body scrub jar",
    featured: true,
  },
  {
    name: "Herbal Massage Oil",
    category: "Personal Care",
    kind: "bottle",
    color: "#d0a33c",
    size: "100ml",
    price: "RM 26.90",
    description: "A warming botanical massage blend designed for a relaxing body-care routine.",
    details:
      "A ready-to-use botanical massage blend with the comforting aroma of black pepper. Its smooth glide makes it suitable for focused or full-body massage.",
    highlights: ["Ready-to-use massage blend", "Smooth, warming glide", "Botanical aroma"],
    howToUse:
      "Warm a small amount between the palms and massage gently onto the body. External use only.",
    image: "/images/products/herbal-massage-oil.png",
    imageAlt: "Piperine black pepper massage oil bottle",
  },
  {
    name: "Botanical Soft Soap",
    category: "Personal Care",
    kind: "jar",
    color: "#87976d",
    size: "50ml",
    price: "RM 22.90",
    description:
      "A gentle botanical soft soap created to cleanse while leaving skin feeling nourished.",
    details:
      "A creamy botanical cleanser inspired by the leaves and berries of the pepper plant. Its gentle lather refreshes the skin while supporting a soft, comfortable finish.",
    highlights: [
      "Gentle daily cleansing",
      "Botanical-inspired formula",
      "Soft and nourishing finish",
    ],
    howToUse:
      "Massage a small amount onto damp skin to create a light lather, then rinse thoroughly. External use only.",
    image: "/images/products/botanical-soft-soap.png",
    imageAlt: "Piperine botanical soft soap jar with product box",
  },
  {
    name: "Pepper Slimming Gel",
    category: "Healthcare",
    kind: "jar",
    color: "#4d8870",
    size: "120g",
    price: "RM 39.90",
    description: "A lightweight warming gel created to complement massage and an active lifestyle.",
    details:
      "A fast-spreading body gel with a warming botanical sensation. Made to complement targeted massage as part of a consistent active-lifestyle routine.",
    highlights: [
      "Lightweight gel texture",
      "Warming massage sensation",
      "Easy targeted application",
    ],
    howToUse:
      "Apply a small amount to the desired body area and massage until absorbed. Wash hands after use.",
    image: "/images/products/pepper-slimming-gel.png",
    imageAlt: "Piperine black pepper slimming gel tube with product box",
  },
  {
    name: "Herbal Cough Relief",
    category: "Healthcare",
    kind: "bottle",
    color: "#8f5034",
    size: "100ml",
    price: "RM 22.90",
    description: "A traditional herbal blend with black pepper warmth for everyday throat comfort.",
    details:
      "A traditional-style herbal preparation pairing selected botanicals with black pepper’s distinctive warmth for a soothing everyday routine.",
    highlights: [
      "Traditional herbal blend",
      "Convenient measured bottle",
      "Warm botanical profile",
    ],
    howToUse:
      "Follow the serving directions printed on the product label. Consult a healthcare professional if symptoms persist.",
    image: "/images/products/herbal-cough-relief.png",
    imageAlt: "Piperine cough medicine bottle with product box",
  },
  {
    name: "Pocket Pepper Spray",
    category: "Safety",
    kind: "spray",
    color: "#b94a34",
    size: "20ml",
    price: "RM 29.90",
    description: "A compact personal-safety spray made to travel discreetly wherever you go.",
    details:
      "A compact personal-safety format designed for convenient carrying and quick access. Its pocket-sized body fits easily in a bag or attached carry pouch.",
    highlights: ["Compact 20ml format", "Portable everyday design", "Quick-access spray top"],
    howToUse:
      "Read all label instructions before carrying. Use only where lawful and strictly for personal safety in an emergency.",
    image: "/images/products/pocket-pepper-spray.png",
    imageAlt: "Piperine black pepper spray bottle",
    featured: true,
  },
];

const Icon = ({
  name,
}: {
  name:
    | "bag"
    | "arrow"
    | "menu"
    | "close"
    | "instagram"
    | "tiktok"
    | "whatsapp"
    | "threads"
    | "leaf"
    | "heart"
    | "search";
}) => {
  const paths = {
    bag: (
      <>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    tiktok: (
      <>
        <path d="M14 4v10a4 4 0 1 1-4-4" />
        <path d="M14 4c.5 3 2.2 4.5 5 5" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" />
        <path d="M9 8.5c.4 3 2 4.5 5 5" />
      </>
    ),
    threads: (
      <>
        <path d="M8 15c.6 2.5 5.6 3 7.5.4 2.3-3.2-.6-6.7-3.7-5.9-3.6.9-2.7 4.6.1 4.7 4.2.2 6.3-4.7 3.4-7.5-2.4-2.3-7.8-1.7-9.3 2.7-1.8 5.4 2 10.6 6.8 10.6 5.1 0 8.2-3.4 7.4-8.4" />
      </>
    ),
    leaf: (
      <>
        <path d="M19 4C12 4 6 7 5 13c-.5 3 1 5 4 5 6-1 9-7 10-14Z" />
        <path d="M5 20c2-5 5-8 10-11" />
      </>
    ),
    heart: (
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-visual ${product.kind} ${large ? "large" : ""}`}
      style={{ "--product": product.color } as React.CSSProperties}
    >
      <div className="pack-cap" />
      <div className="pack-body">
        <div className="pack-brand">PIPERINE</div>
        <div className="pack-line" />
        <div className="pack-name">{product.name}</div>
        <div className="pack-pepper">
          •••
          <br />
          •••••
        </div>
        <div className="pack-size">{product.size}</div>
      </div>
    </div>
  );
}

function ProductMedia({ product }: { product: Product }) {
  if (!product.image) return <ProductVisual product={product} />;

  return (
    <div className="product-photo">
      <img src={product.image} alt={product.imageAlt || product.name} loading="lazy" />
      <span className="real-photo-label">Real product view</span>
      {product.photoCredit && <small>Photo: {product.photoCredit} / Unsplash</small>}
    </div>
  );
}

const productKeywords: Record<string, string[]> = {
  "Pepper Candy": ["candy", "sweet", "snack", "travel", "warming", "gift"],
  "Black Pepper Honey": ["honey", "breakfast", "drink", "tea", "sweet", "throat"],
  "Pepper Leaf Tea": ["tea", "calm", "drink", "relax", "caffeine free", "herbal"],
  "Pepper Essential Oil": ["aroma", "diffuser", "essential oil", "grounding", "relax"],
  "Pepper Body Scrub": ["scrub", "exfoliate", "rough skin", "smooth", "body care"],
  "Herbal Massage Oil": ["massage", "muscle", "relax", "body", "warming", "oil"],
  "Botanical Soft Soap": ["soap", "cleanse", "wash", "gentle", "skin", "daily"],
  "Pepper Slimming Gel": ["gel", "active", "massage", "warming", "body", "fitness"],
  "Herbal Cough Relief": ["cough", "throat", "herbal", "comfort", "wellness"],
  "Pocket Pepper Spray": ["safety", "protection", "travel", "spray", "emergency"],
};

function findRecommendations(query: string) {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1);

  return products
    .map((product) => {
      const searchable = [
        product.name,
        product.category,
        product.description,
        product.details,
        product.highlights.join(" "),
        ...(productKeywords[product.name] || []),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce(
        (total, term) =>
          total +
          (searchable.includes(term) ? (product.name.toLowerCase().includes(term) ? 3 : 1) : 0),
        0,
      );
      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}

function ProductFinder({
  onBack,
  onChoose,
}: {
  onBack: () => void;
  onChoose: (product: Product) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Tell me what you need help with—for example relaxation, gentle cleansing, throat comfort, a warming drink, or personal safety.",
    },
  ]);
  const [recommended, setRecommended] = useState<Product[]>([]);

  const searchResults = useMemo(
    () => (searchQuery.trim() ? findRecommendations(searchQuery) : products),
    [searchQuery],
  );

  const submitChat = (event: React.FormEvent) => {
    event.preventDefault();
    const request = chatInput.trim();
    if (!request) return;
    const matches = findRecommendations(request).slice(0, 3);
    setRecommended(matches);
    setMessages((current) => [
      ...current,
      { from: "customer", text: request },
      {
        from: "bot",
        text: matches.length
          ? `Based on your needs, I recommend ${matches.map((product) => product.name).join(", ")}. Review the usage guidance before choosing.`
          : "I could not find a close match yet. Try a keyword such as tea, massage, skin, cough, aroma, sweet, or safety.",
      },
    ]);
    setChatInput("");
  };

  return (
    <section className="finder-page">
      <div className="finder-hero">
        <button className="finder-back" onClick={onBack}>
          ← Back to Piperine
        </button>
        <p className="eyebrow">Personal product guidance</p>
        <h1>
          Find your
          <br />
          <em>Piperine match.</em>
        </h1>
        <p>
          Search by keyword or describe your routine to receive suitable catalogue suggestions.
          Recommendations are general product guidance, not medical advice.
        </p>
      </div>

      <div className="finder-tools">
        <section className="keyword-search" aria-labelledby="keyword-search-title">
          <span>01 · Keyword search</span>
          <h2 id="keyword-search-title">What are you looking for?</h2>
          <label>
            <span className="sr-only">Search products by keyword</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Try “relax”, “tea”, “skin” or “safety”"
            />
          </label>
          <p>{searchResults.length} matching products</p>
          <div className="finder-results">
            {searchResults.map((product) => (
              <button key={product.name} onClick={() => onChoose(product)}>
                <ProductMedia product={product} />
                <span>
                  <small>{product.category}</small>
                  <strong>{product.name}</strong>
                  <em>{product.price}</em>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="recommendation-chat" aria-labelledby="recommendation-chat-title">
          <span>02 · Product advisor</span>
          <h2 id="recommendation-chat-title">Tell us what you need.</h2>
          <div className="chat-window" aria-live="polite">
            {messages.map((message, index) => (
              <p className={message.from} key={`${message.from}-${index}`}>
                <small>{message.from === "bot" ? "Piperine advisor" : "You"}</small>
                {message.text}
              </p>
            ))}
          </div>
          <form onSubmit={submitChat}>
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="I need something for..."
              rows={3}
            />
            <button className="primary-btn" type="submit">
              Get recommendations <Icon name="arrow" />
            </button>
          </form>
          {recommended.length > 0 && (
            <div className="chat-recommendations">
              {recommended.map((product) => (
                <button key={product.name} onClick={() => onChoose(product)}>
                  <strong>{product.name}</strong>
                  <span>
                    {product.size} · {product.price}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("piperine-cart") || "{}");
    } catch {
      return {};
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("piperine-wishlist") || "[]");
    } catch {
      return [];
    }
  });
  const [shoppingPanel, setShoppingPanel] = useState<"cart" | "wishlist" | null>(null);
  const [productVideos, setProductVideos] = useState<Record<string, string>>({});
  const [messageSent, setMessageSent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [finderOpen, setFinderOpen] = useState(window.location.hash === "#product-finder");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );
  const featured = products.filter((product) => product.featured);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const cartItems = products.filter((product) => cart[product.name]);
  const wishlistItems = products.filter((product) => wishlist.includes(product.name));
  const cartTotal = cartItems.reduce(
    (total, product) => total + Number(product.price.replace(/[^\d.]/g, "")) * cart[product.name],
    0,
  );

  useEffect(() => {
    localStorage.setItem("piperine-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("piperine-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!selectedProduct) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProduct]);

  useEffect(() => {
    if (!shoppingPanel) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShoppingPanel(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [shoppingPanel]);

  useEffect(() => {
    const syncPage = () => setFinderOpen(window.location.hash === "#product-finder");
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  const openFinder = () => {
    window.location.hash = "product-finder";
    setFinderOpen(true);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const returnHome = (sectionId = "home") => {
    setFinderOpen(false);
    window.history.pushState(null, "", `#${sectionId}`);
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView(), 0);
  };

  const scrollTo = (id: string) => {
    if (finderOpen) {
      returnHome(id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const addProductVideo = (slot: string, file?: File) => {
    if (!file) return;
    setProductVideos((current) => {
      if (current[slot]) URL.revokeObjectURL(current[slot]);
      return { ...current, [slot]: URL.createObjectURL(file) };
    });
  };

  const addToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.name]: (current[product.name] || 0) + 1,
    }));
  };

  const updateCartQuantity = (product: Product, change: number) => {
    setCart((current) => {
      const nextQuantity = (current[product.name] || 0) + change;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[product.name];
        return next;
      }
      return { ...current, [product.name]: nextQuantity };
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((current) =>
      current.includes(product.name)
        ? current.filter((name) => name !== product.name)
        : [...current, product.name],
    );
  };

  return (
    <main>
      <header className="nav-shell">
        <button
          className="brand brand-button"
          onClick={() => returnHome()}
          aria-label="Piperine home"
        >
          <span className="brand-mark brand-logo">
            <img src="/images/piperine-logo.png" alt="" />
          </span>
          <span className="brand-lockup">
            <b>PIPERINE</b>
            <small>PRECISION HEALING THROUGH PIPERINE</small>
          </span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          {[
            { label: "Home", id: "home" },
            { label: "Featured", id: "featured" },
            { label: "Catalogue", id: "catalogue" },
            { label: "Reviews", id: "reviews" },
            { label: "Contact", id: "contact" },
          ].map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="nav-icon-button finder-icon-button"
            onClick={openFinder}
            aria-label="Open product recommendations and search"
            title="Product recommendations"
          >
            <Icon name="search" />
          </button>
          <button
            className="nav-icon-button wishlist-button"
            aria-label={`${wishlist.length} products in wishlist`}
            onClick={() => setShoppingPanel("wishlist")}
          >
            <Icon name="heart" />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </button>
          <button
            className="cart-button"
            aria-label={`${cartCount} items in cart`}
            onClick={() => setShoppingPanel("cart")}
          >
            <Icon name="bag" />
            <span>{cartCount}</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {shoppingPanel && (
        <div
          className="shopping-panel-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShoppingPanel(null);
          }}
        >
          <aside
            className="shopping-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shopping-panel-title"
          >
            <div className="shopping-panel-header">
              <div>
                <p className="eyebrow">
                  {shoppingPanel === "cart" ? "Your selection" : "Saved items"}
                </p>
                <h2 id="shopping-panel-title">
                  {shoppingPanel === "cart" ? "Shopping bag" : "Wishlist"}
                </h2>
              </div>
              <button onClick={() => setShoppingPanel(null)} aria-label="Close panel">
                <Icon name="close" />
              </button>
            </div>

            <div className="shopping-panel-items">
              {(shoppingPanel === "cart" ? cartItems : wishlistItems).length === 0 ? (
                <div className="shopping-empty">
                  <Icon name={shoppingPanel === "cart" ? "bag" : "heart"} />
                  <h3>
                    {shoppingPanel === "cart" ? "Your bag is empty." : "No saved products yet."}
                  </h3>
                  <p>
                    Browse the catalogue and{" "}
                    {shoppingPanel === "cart" ? "add something purposeful" : "save your favourites"}
                    .
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setShoppingPanel(null);
                      scrollTo("catalogue");
                    }}
                  >
                    Browse catalogue <Icon name="arrow" />
                  </button>
                </div>
              ) : (
                (shoppingPanel === "cart" ? cartItems : wishlistItems).map((product) => (
                  <article className="shopping-line-item" key={product.name}>
                    <div className="shopping-line-media">
                      <ProductMedia product={product} />
                    </div>
                    <div>
                      <small>{product.category}</small>
                      <h3>{product.name}</h3>
                      <strong>{product.price}</strong>
                      {shoppingPanel === "cart" ? (
                        <div className="quantity-control" aria-label={`${product.name} quantity`}>
                          <button
                            onClick={() => updateCartQuantity(product, -1)}
                            aria-label={`Remove one ${product.name}`}
                          >
                            −
                          </button>
                          <span>{cart[product.name]}</span>
                          <button
                            onClick={() => updateCartQuantity(product, 1)}
                            aria-label={`Add one more ${product.name}`}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="move-to-cart"
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product);
                          }}
                        >
                          Move to bag
                        </button>
                      )}
                    </div>
                    <button
                      className="line-remove"
                      onClick={() =>
                        shoppingPanel === "cart"
                          ? setCart((current) => {
                              const next = { ...current };
                              delete next[product.name];
                              return next;
                            })
                          : toggleWishlist(product)
                      }
                      aria-label={`Remove ${product.name}`}
                    >
                      <Icon name="close" />
                    </button>
                  </article>
                ))
              )}
            </div>

            {shoppingPanel === "cart" && cartItems.length > 0 && (
              <div className="shopping-panel-footer">
                <div>
                  <span>Subtotal</span>
                  <strong>RM {cartTotal.toFixed(2)}</strong>
                </div>
                <a
                  className="primary-btn"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Hello Piperine, I would like to order:\n${cartItems
                      .map((product) => `${cart[product.name]} × ${product.name}`)
                      .join("\n")}\nSubtotal: RM ${cartTotal.toFixed(2)}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Order via WhatsApp <Icon name="arrow" />
                </a>
                <button className="clear-bag" onClick={() => setCart({})}>
                  Clear bag
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {finderOpen ? (
        <ProductFinder
          onBack={() => returnHome()}
          onChoose={(product) => {
            returnHome("catalogue");
            setSelectedProduct(product);
          }}
        />
      ) : (
        <>
          <section id="home" className="hero">
            <div className="hero-spice spice-a">
              ● · ●<br />· ● ● ·
            </div>
            <div className="hero-spice spice-b">
              ●<br />● · ●
            </div>
            <div className="hero-copy">
              <p className="eyebrow">Botanical wellness · Kuala Nerang, Kedah</p>
              <h1>
                Precision healing.
                <br />
                <em>Powered by piperine.</em>
              </h1>
              <p className="hero-intro">
                Discover purposeful everyday wellness made with locally grown black pepper. From
                nourishing pantry staples to personal care, Piperine brings the precision of nature
                into every ritual.
              </p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => scrollTo("catalogue")}>
                  Explore catalogue <Icon name="arrow" />
                </button>
                <button className="text-btn" onClick={() => scrollTo("reviews")}>
                  Customer reviews
                </button>
              </div>
              <div className="hero-meta">
                <div>
                  <strong>100%</strong>
                  <span>Locally sourced</span>
                </div>
                <div>
                  <strong>4</strong>
                  <span>Product families</span>
                </div>
                <div>
                  <strong>Worldwide</strong>
                  <span>Delivery</span>
                </div>
              </div>
            </div>
            <div className="hero-stage" aria-label="Featured Piperine products">
              <div className="sun-disc" />
              <img className="hero-brand-leaf" src="/images/piperine-logo.png" alt="" />
              <div className="leaf-sketch leaf-one">⌁</div>
              <div className="leaf-sketch leaf-two">⌁</div>
              <div className="floating-product product-one">
                <img
                  className="hero-product-cutout"
                  src="/images/products/hero/pepper-body-scrub-cutout.png"
                  alt="Piperine black pepper body scrub"
                />
              </div>
              <div className="floating-product product-two">
                <img
                  className="hero-product-cutout"
                  src="/images/products/hero/pepper-candy-cutout.png"
                  alt="Piperine black pepper candy"
                />
              </div>
              <div className="floating-product product-three">
                <img
                  className="hero-product-cutout"
                  src="/images/products/hero/pepper-leaf-tea-cutout.png"
                  alt="Piperine black pepper tea"
                />
              </div>
              <div className="floating-product product-four">
                <img
                  className="hero-product-cutout"
                  src="/images/products/hero/pocket-pepper-spray-cutout.png"
                  alt="Piperine black pepper spray"
                />
              </div>
              <span className="stage-note note-one">warming & earthy</span>
              <span className="stage-note note-two">made in Kedah</span>
            </div>
            <button className="scroll-cue" onClick={() => scrollTo("categories")}>
              <span>Scroll to discover</span>
              <i />
            </button>
          </section>

          <aside className="social-rail" aria-label="Social media links">
            <span>Follow the harvest</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <Icon name="tiktok" />
            </a>
            <a
              className="wa"
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <Icon name="whatsapp" />
            </a>
            <a href="https://threads.net" target="_blank" rel="noreferrer" aria-label="Threads">
              <Icon name="threads" />
            </a>
          </aside>

          <button
            className="spice-scroll-card"
            onClick={() => scrollTo("reviews")}
            aria-label="View Piperine customer reviews"
          >
            <span className="spice-image">
              <img
                src="/images/black-pepper-spice-transparent.png"
                alt="Fresh green pepper berries beside dried black peppercorns"
              />
            </span>
          </button>

          <section id="categories" className="categories section-pad">
            <div className="section-heading">
              <div>
                <p className="eyebrow">More than a spice</p>
                <h2>
                  Made for every
                  <br />
                  part of your day.
                </h2>
              </div>
              <p>
                From morning tea to nightly rituals, the warmth of Kuala Nerang black pepper finds a
                natural place in everyday life.
              </p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => (
                <button
                  className={`category-card cat-${index + 1}`}
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    scrollTo("catalogue");
                  }}
                >
                  <span>{category.number}</span>
                  <div className="category-art">
                    {index === 0 && (
                      <>
                        <i className="cup" />
                        <b className="steam">∿</b>
                      </>
                    )}
                    {index === 1 && <ProductVisual product={products[3]} />}
                    {index === 2 && (
                      <>
                        <i className="mortar" />
                        <b className="herb">⌁</b>
                      </>
                    )}
                    {index === 3 && <ProductVisual product={products[9]} />}
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <i className="round-arrow">
                    <Icon name="arrow" />
                  </i>
                </button>
              ))}
            </div>
          </section>

          <section id="featured" className="featured">
            <div className="featured-title">
              <p className="eyebrow">The local favourites</p>
              <h2>
                Meet our
                <br />
                <em>best sellers.</em>
              </h2>
              <p>Thoughtfully made in small batches using our homegrown black pepper.</p>
              <button className="text-btn" onClick={() => scrollTo("catalogue")}>
                View all products <Icon name="arrow" />
              </button>
            </div>
            <div className="marquee-window">
              <div className="product-marquee">
                {[...featured, ...featured].map((product, index) => (
                  <article className="feature-card" key={`${product.name}-${index}`}>
                    <span className="product-tag">{product.category}</span>
                    <div className="feature-art">
                      <strong className="feature-price">{product.price}</strong>
                      <ProductMedia product={product} />
                    </div>
                    <div className="feature-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p>
                          {product.size} · {product.price}
                        </p>
                      </div>
                      <div className="feature-card-actions">
                        <button
                          className={wishlist.includes(product.name) ? "active" : ""}
                          onClick={() => toggleWishlist(product)}
                          aria-label={`${wishlist.includes(product.name) ? "Remove" : "Add"} ${product.name} ${wishlist.includes(product.name) ? "from" : "to"} wishlist`}
                        >
                          <Icon name="heart" />
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p className="drag-note">Products move automatically · hover to pause</p>
            </div>
          </section>

          <section id="reviews" className="reviews section-pad">
            <div className="reviews-heading">
              <div>
                <p className="eyebrow">Customer voices</p>
                <h2>
                  Everyday rituals,
                  <br />
                  <em>shared by our community.</em>
                </h2>
              </div>
              <p>
                Feedback from customers who have made Piperine part of their pantry, personal-care,
                and wellbeing routines.
              </p>
            </div>
            <div className="review-grid">
              {[
                {
                  quote:
                    "The pepper honey has become my favourite addition to warm drinks. It is smooth, aromatic, and gently warming.",
                  customer: "Aina R.",
                  detail: "Returning customer · Kedah",
                },
                {
                  quote:
                    "I enjoy the massage oil after a long day. The texture glides well and the botanical aroma feels comforting.",
                  customer: "Mei L.",
                  detail: "Personal Care customer · Penang",
                },
                {
                  quote:
                    "The pepper candy is easy to carry and has a lovely balance of sweetness and warmth. I always keep a pouch nearby.",
                  customer: "Hafiz M.",
                  detail: "F&B customer · Selangor",
                },
              ].map((review, index) => (
                <article key={review.customer}>
                  <span>0{index + 1}</span>
                  <div className="review-stars" aria-label="Five out of five stars">
                    ★ ★ ★ ★ ★
                  </div>
                  <blockquote>“{review.quote}”</blockquote>
                  <strong>{review.customer}</strong>
                  <small>{review.detail}</small>
                </article>
              ))}
            </div>
            <div className="loyalty-panel">
              <div>
                <p className="eyebrow">For our loyal customers</p>
                <h3>
                  Welcome to the
                  <br />
                  Piperine Circle.
                </h3>
              </div>
              <p>
                Returning customers can enjoy early access to new small-batch releases, members-only
                bundles, and thoughtful rewards on selected purchases.
              </p>
              <div className="loyalty-benefits">
                <span>
                  <b>01</b> Early product access
                </span>
                <span>
                  <b>02</b> Members-only bundles
                </span>
                <span>
                  <b>03</b> Birthday rewards
                </span>
              </div>
              <button className="primary-btn" onClick={() => scrollTo("contact")}>
                Join the Circle <Icon name="arrow" />
              </button>
            </div>
          </section>

          <section id="catalogue" className="shop section-pad">
            <div className="catalogue-breadcrumb">
              Piperine / E-catalogue / {activeCategory === "All" ? "All products" : activeCategory}
            </div>
            <div className="filters catalogue-filters" aria-label="Product catalogue categories">
              {["All", ...categories.map((category) => category.name)].map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === "All" ? "All products" : category}
                </button>
              ))}
            </div>
            <div className="catalogue-hero">
              <h2>{catalogueContent[activeCategory].title}</h2>
              <p>{catalogueContent[activeCategory].subtitle}</p>
            </div>
            <div className="catalogue-collection-note">
              <span>The {activeCategory === "All" ? "complete" : activeCategory} collection</span>
              <p>{catalogueContent[activeCategory].collection}</p>
            </div>
            <div className="catalogue-list">
              {filtered.map((product, index) => (
                <article className="catalogue-product" key={product.name}>
                  <div className="catalogue-product-media">
                    <strong>{product.price}</strong>
                    {productVideos[product.name] ? (
                      <video
                        className="catalogue-product-video"
                        src={productVideos[product.name]}
                        controls
                        playsInline
                      />
                    ) : (
                      <ProductMedia product={product} />
                    )}
                    <small>Piperine · Kuala Nerang, Kedah</small>
                    <label className="catalogue-video-upload">
                      {productVideos[product.name] ? "Change video" : "Add product video"}
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        onChange={(event) => addProductVideo(product.name, event.target.files?.[0])}
                      />
                    </label>
                  </div>
                  <div className="catalogue-product-copy">
                    <span className="catalogue-product-number">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(filtered.length).padStart(2, "0")}
                    </span>
                    <h3>{product.name}</h3>
                    <p className="catalogue-short-description">{product.description}</p>
                    <div className="catalogue-specs">
                      <div>
                        <span>Size</span>
                        <strong>{product.size}</strong>
                      </div>
                      <div>
                        <span>Price</span>
                        <strong>{product.price}</strong>
                      </div>
                    </div>
                    <div className="catalogue-origin">
                      <h4>From the Piperine collection</h4>
                      <p>
                        Made for everyday rituals, breakfast and little moments of warmth. See the
                        product details for highlights, usage guidance and important information.
                      </p>
                    </div>
                    <div className="catalogue-product-actions">
                      <button
                        className="primary-btn dark"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Explore this product <Icon name="arrow" />
                      </button>
                      <button className="catalogue-quick-add" onClick={() => addToCart(product)}>
                        Add to bag
                      </button>
                      <button
                        className={`catalogue-wishlist ${wishlist.includes(product.name) ? "active" : ""}`}
                        onClick={() => toggleWishlist(product)}
                        aria-label={`${wishlist.includes(product.name) ? "Remove" : "Add"} ${product.name} ${wishlist.includes(product.name) ? "from" : "to"} wishlist`}
                      >
                        <Icon name="heart" />
                        {wishlist.includes(product.name) ? "Saved" : "Wishlist"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {selectedProduct && (
            <div
              className="product-modal-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setSelectedProduct(null);
              }}
            >
              <section
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close product details"
                >
                  <Icon name="close" />
                </button>
                <div className="modal-art">
                  <span>{selectedProduct.category}</span>
                  <ProductMedia product={selectedProduct} />
                </div>
                <div className="modal-content">
                  <p className="eyebrow">Piperine product catalogue</p>
                  <h2 id="product-modal-title">{selectedProduct.name}</h2>
                  <div className="modal-product-meta">
                    <span>{selectedProduct.size}</span>
                    <strong>{selectedProduct.price}</strong>
                  </div>
                  <p className="modal-description">{selectedProduct.details}</p>
                  <div className="modal-detail-block">
                    <h3>Product highlights</h3>
                    <ul>
                      {selectedProduct.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="modal-detail-block">
                    <h3>How to use</h3>
                    <p>{selectedProduct.howToUse}</p>
                  </div>
                  <div className="modal-actions">
                    <button className="primary-btn" onClick={() => addToCart(selectedProduct)}>
                      Add to bag <Icon name="bag" />
                    </button>
                    <button
                      className={`modal-wishlist ${wishlist.includes(selectedProduct.name) ? "active" : ""}`}
                      onClick={() => toggleWishlist(selectedProduct)}
                    >
                      <Icon name="heart" />
                      {wishlist.includes(selectedProduct.name) ? "Saved" : "Add to wishlist"}
                    </button>
                    <button className="text-btn" onClick={() => setSelectedProduct(null)}>
                      Continue browsing
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          <section id="contact" className="contact">
            <div className="contact-intro">
              <p className="eyebrow">Let’s talk pepper</p>
              <h2>
                Contact
                <br /> <em>Piperine.</em>
              </h2>
              <p>
                We would love to hear from you. Connect with our team for product questions,
                wholesale enquiries, and worldwide orders.
              </p>
              <div className="contact-details">
                <a href="mailto:hello@piperine.my">hello@piperine.my</a>
                <span>Kuala Nerang, Kedah, Malaysia</span>
              </div>
            </div>
            <form
              className="contact-form"
              onSubmit={(event) => {
                event.preventDefault();
                setMessageSent(true);
                event.currentTarget.reset();
              }}
            >
              <div className="form-row">
                <label>
                  Your name
                  <input name="name" type="text" placeholder="Full name" required />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" placeholder="you@example.com" required />
                </label>
              </div>
              <label>
                How can we help?
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your enquiry"
                  required
                />
              </label>
              <div className="form-submit">
                <button className="primary-btn" type="submit">
                  Send enquiry <Icon name="arrow" />
                </button>
                {messageSent && <p role="status">Thank you. Your enquiry has been received.</p>}
              </div>
            </form>
            <div className="contact-whatsapp">
              <span>Prefer a quick reply?</span>
              <a href="https://wa.me/" target="_blank" rel="noreferrer">
                Chat on WhatsApp <Icon name="arrow" />
              </a>
            </div>
            <div className="contact-peppers">
              ● · ● ·<br />· ● ● ● ·
            </div>
          </section>

          <footer>
            <a className="brand footer-brand" href="#home">
              <span className="brand-mark brand-logo">
                <img src="/images/piperine-logo.png" alt="" />
              </span>
              <span className="brand-lockup">
                <b>PIPERINE</b>
                <small>PRECISION HEALING THROUGH PIPERINE</small>
              </span>
            </a>
            <p>Precision healing through piperine.</p>
            <div>
              {["Instagram", "TikTok", "WhatsApp", "Threads"].map((social) => (
                <a
                  key={social}
                  href={
                    social === "WhatsApp" ? "https://wa.me/" : `https://${social.toLowerCase()}.com`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {social}
                </a>
              ))}
            </div>
            <small>© 2025 Piperine. Rooted locally, shared globally.</small>
          </footer>
        </>
      )}
    </main>
  );
}

export default App;
