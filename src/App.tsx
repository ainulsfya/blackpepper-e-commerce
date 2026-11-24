import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

import { supabase } from "./lib/supabase";
import { getProductValueAdded } from "./productValueAdded";
import CartDrawer from "./CartDrawer";

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
        <path d="M20.5 3.5C13 4 7 8.5 6 15.5c4.5 1.5 8.5-.5 11-4 1.5-2.2 2.5-5 3.5-8Z" />
        <path d="M6 15.5c-1 2-1.5 4-1.5 5.5M6 15.5c3-3.5 7-6 14.5-12" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4 4" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-visual ${product.kind}${large ? " large" : ""}`}
      style={{ "--product": product.color } as CSSProperties}
    >
      {/* Product visual */}
    </div>
  );
}