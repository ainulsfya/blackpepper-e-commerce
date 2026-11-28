export type ProductValueAdded = {
  aspects: string;
  highlights: string[];
  valueAddedImage?: string;
};

export const VALUE_ADDED_BY_KEY: Record<string, ProductValueAdded> = {
  candy: {
    aspects: "Formulation & Health • Packaging",
    highlights: [
      "Infused with ginger, kelulut honey, or mint; sugar-free & Halal options",
      "Pocket-sized resealable metal tins instead of standard plastic bags",
    ],
    valueAddedImage: "/images/value-added-candy.jpg",
  },
  honey: {
    aspects: "Quality & Versatility • Convenience & Traceability",
    highlights: [
      "Raw stingless bee honey for daily immunity & gourmet glazes",
      "10g–15g single-serve sachets + QR code to lab purity & farm origin",
    ],
    valueAddedImage: "/images/value-added-honey.jpg",
  },
  slimming: {
    aspects: "Active Ingredients • Applicator & Texture",
    highlights: [
      "Paired with caffeine, green tea, or aloe vera for gentle firming",
      "Built-in massage roller-ball + fast-absorbing citrus/lemongrass gel",
    ],
    valueAddedImage: "/images/value-added/slimming-gel.jpg",
  },
  cough: {
    aspects: "Herbal Synergy • Format & Clean Label",
    highlights: [
      "Blended with licorice root, thyme, or elderberry for cough & phlegm relief",
      "Non-drowsy, alcohol-free formula + ready-to-drink liquid sachets",
    ],
    valueAddedImage: "/images/value-added-cough-medicine.jpg",
  },
  essential: {
    aspects: "Purity & Pre-Blends • Product Protection",
    highlights: [
      "100% pure steam-distilled oil + ready-to-use roll-on blends",
      "UV-protected amber/cobalt glass bottles with precision droppers",
    ],
    valueAddedImage: "/images/value-added-essential-oil.jpg",
  },
  spray: {
    aspects: "Therapeutic Function • Bottle Design",
    highlights: [
      "Blended with menthol, camphor, or magnesium for hot/cold relief",
      "360-degree continuous mist nozzle + 100ml home & 30ml mini combo",
    ],
    valueAddedImage: "/images/value-added-spray.jpg",
  },
  scrub: {
    aspects: "Exfoliation & Skin Care • Water-Safe Packaging",
    highlights: [
      "Fine black pepper with pink salt/brown sugar & shea butter detox",
      "Waterproof PET jars or aluminum tins with included wooden scoop",
    ],
    valueAddedImage: "/images/value-added-scrub.jpg",
  },
  soap: {
    aspects: "Skin Benefits • Aesthetics & Eco-Friendly",
    highlights: [
      "Charcoal, goat's milk, or turmeric blends with artisanal textures",
      "Biodegradable seed paper or kraft bands highlighting Sarawak origin",
    ],
    valueAddedImage: "/images/value-added-soap.jpg",
  },
  massage: {
    aspects: "Targeted Blends • Carrier Base & Pump",
    highlights: [
      "Sports Recovery & Postnatal/Urut blends in non-greasy carrier oils",
      "Dark glass with lockable pump + 1L–5L spa & therapist bulk refills",
    ],
    valueAddedImage: "/images/value-added-massage-oil.jpg",
  },
  tea: {
    aspects: "Flavor & Health Synergy • Brewing Format",
    highlights: [
      "Paired with turmeric, red ginger, or lemongrass for enhanced absorption",
      "Biodegradable pyramid bags, 3-in-1 sachets & airtight tin canisters",
    ],
    valueAddedImage: "/images/value-added-tea.jpg",
  },
};

const DEFAULT_VALUE_ADDED: ProductValueAdded = {
  aspects: "Value-Added Formulation & Packaging",
  highlights: [
    "Enhanced ingredients and practical packaging tailored for daily use",
  ],
};

export function getProductValueAdded(productName: string): ProductValueAdded {
  const name = productName.toLowerCase();

  if (name.includes("candy")) return VALUE_ADDED_BY_KEY.candy;
  if (name.includes("honey")) return VALUE_ADDED_BY_KEY.honey;
  if (name.includes("slimming")) return VALUE_ADDED_BY_KEY.slimming;
  if (name.includes("cough")) return VALUE_ADDED_BY_KEY.cough;
  if (name.includes("essential")) return VALUE_ADDED_BY_KEY.essential;
  if (name.includes("spray")) return VALUE_ADDED_BY_KEY.spray;
  if (name.includes("scrub")) return VALUE_ADDED_BY_KEY.scrub;
  if (name.includes("soap")) return VALUE_ADDED_BY_KEY.soap;
  if (name.includes("massage")) return VALUE_ADDED_BY_KEY.massage;
  if (name.includes("tea")) return VALUE_ADDED_BY_KEY.tea;

  return DEFAULT_VALUE_ADDED;
}