import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import "./index.css";

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
  backImage?: string;
  imageAlt?: string;
  photoCredit?: string;
  featured?: boolean;
};

type DatabaseProduct = {
  name: string;
  category: string;
  kind: string | null;
  color: string | null;
  size: string | null;
  price: number | string;
  description: string | null;
  details: unknown;
  highlights: string[] | null;
  how_to_use: string | null;
  image: string | null;
  back_image?: string | null;
  image_alt: string | null;
  photo_credit: string | null;
  featured: boolean | null;
};

function mapDatabaseProduct(row: DatabaseProduct): Product {
  const allowedKinds = ["pouch", "bottle", "jar", "spray"];

  const kind: Product["kind"] = allowedKinds.includes(row.kind || "")
    ? (row.kind as Product["kind"])
    : "jar";

  return {
    name: row.name,
    category: row.category,
    kind,
    color: row.color || "#667c43",
    size: row.size || "",
    price: `RM ${Number(row.price).toFixed(2)}`,
    description: row.description || "",
    details:
      typeof row.details === "string"
        ? row.details
        : row.description || "",
    highlights: row.highlights || [],
    howToUse: row.how_to_use || "",
    image: row.image || undefined,
    backImage: row.back_image || undefined,
    imageAlt: row.image_alt || undefined,
    photoCredit: row.photo_credit || undefined,
    featured: Boolean(row.featured),
  };
}

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
    backImage: "/images/products/backimage/back-candy.jpg",
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
    backImage: "/images/products/backimage/back-honey.jpg",
    imageAlt: "Piperine black pepper honey jar",
  },
  {
    name: "Pepper Tea",
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
    backImage: "/images/products/backimage/back-tea.jpg",
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
    backImage: "/images/products/backimage/back-essential.jpg",
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
    backImage: "/images/products/backimage/back-scrub.jpg",
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
    backImage: "/images/products/backimage/back-massage.jpg",
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
    backImage: "/images/products/backimage/back-soap.jpg",
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
    backImage: "/images/products/backimage/back-slimming.jpg",
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
    backImage: "/images/products/backimage/back-cough.jpg",
    imageAlt: "Piperine cough medicine bottle with product box",
  },
  {
    name: "Pepper Spray",
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
    backImage: "/images/products/backimage/back-spray.jpg",
    imageAlt: "Piperine black pepper spray bottle",
    featured: true,
  },
];

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-visual ${product.kind}${large ? " large" : ""}`}
      style={{ "--product": product.color } as CSSProperties}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          loading="lazy"
        />
      ) : null}
    </div>
  );
}

export default function App(): ReactElement {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const activeCollection = catalogueContent[category] ?? catalogueContent.All;

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "All" || product.category === category;
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [category, search],
  );

  return (
    <main className="shop section-pad">
      <div className="shop-top">
        <div>
          <p className="eyebrow">Botanical Wellness · Kuala Nerang, Kedah</p>
          <h2>{activeCollection.title}</h2>
          <p className="catalogue-short-description">{activeCollection.subtitle}</p>
        </div>

        <div className="catalogue-controls">
          <p>{activeCollection.collection}</p>
          <div className="filters">
            {["All", ...categories.map(({ name }) => name)].map((name) => (
              <button
                key={name}
                type="button"
                className={category === name ? "active" : ""}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-right text-xs font-medium">
            Search products:{" "}
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="ml-2 rounded border border-emerald-950/30 bg-white px-3 py-1.5 text-sm text-emerald-950"
            />
          </label>
        </div>
      </div>

      <div className="catalogue-list">
        {visibleProducts.map((product, index) => (
          <article key={product.name} className="catalogue-product">
            <div className="catalogue-product-media">
              <strong>{product.price}</strong>
              <ProductVisual product={product} large />
              <small>{product.size}</small>
            </div>
            <div className="catalogue-product-copy">
              <span className="catalogue-product-number">
                0{index + 1} · {product.category}
              </span>
              <h3>{product.name}</h3>
              <p className="catalogue-short-description">{product.description}</p>
              <div className="catalogue-specs">
                <div>
                  <span>Format</span>
                  <strong>{product.kind}</strong>
                </div>
                <div>
                  <span>Size</span>
                  <strong>{product.size}</strong>
                </div>
              </div>
              <div className="catalogue-origin">
                <h4>How to use</h4>
                <p>{product.howToUse}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
