export const brandColors: Record<string, string[]> = {
  // Streaming & Entertainment
  netflix: ["#E50914", "#E50914", "#E50914"],
  youtube: ["#FF0000", "#FF0000", "#FF0000"],
  disney: ["#113CCF", "#113CCF", "#113CCF"],
  hulu: ["#1CE783", "#1CE783", "#1CE783"],
  primevideo: ["#00A8E1", "#00A8E1", "#00A8E1"],
  spotify: ["#1DB954", "#1DB954", "#1DB954"],
  twitch: ["#9146FF", "#9146FF", "#9146FF"],
  reddit: ["#FF4500", "#FF4500", "#FF4500"],
  pinterest: ["#E60023", "#E60023", "#E60023"],

  // Finance & Payment
  boursobank: ["#E6007E", "#1D3F8F", "#00A3E0"],
  paypal: ["#003087", "#003087", "#003087"],
  visa: ["#1A1F71", "#1A1F71", "#1A1F71"],
  mastercard: ["#EB001B", "#EB001B", "#EB001B"],
  revolut: ["#1326FD", "#1326FD", "#1326FD"],
  stripe: ["#635BFF", "#635BFF", "#635BFF"],
  coinbase: ["#0052FF", "#0052FF", "#0052FF"],
  binance: ["#F3BA2F", "#F3BA2F", "#F3BA2F"],
  n26: ["#36A18B", "#36A18B", "#36A18B"],

  // Social Media
  whatsapp: ["#25D366", "#25D366", "#25D366"],
  snapchat: ["#FFFC00", "#FFFC00", "#FFFC00"],
  telegram: ["#0088CC", "#0088CC", "#0088CC"],
  linkedin: ["#0A66C2", "#0A66C2", "#0A66C2"],
  facebook: ["#1877F2", "#1877F2", "#1877F2"],
  instagram: ["#E1306C", "#E1306C", "#E1306C"],
  tiktok: ["#EE1D52", "#EE1D52", "#EE1D52"],
  twitter: ["#1DA1F2", "#1DA1F2", "#1DA1F2"],

  // Retail
  zalando: ["#FF6900", "#FF6900", "#FF6900"],
  amazon: ["#FF9900", "#FF9900", "#FF9900"],
  ebay: ["#E53238", "#E53238", "#E53238"],
  shopify: ["#96BF48", "#96BF48", "#96BF48"],
  walmart: ["#0071CE", "#0071CE", "#0071CE"],
  target: ["#CC0000", "#CC0000", "#CC0000"],
  ikea: ["#0051BA", "#0051BA", "#0051BA"],
  carrefour: ["#0051BA", "#0051BA", "#0051BA"],
  leclerc: ["#0051BA", "#0051BA", "#0051BA"],
  auchan: ["#ED1C24", "#ED1C24", "#ED1C24"],
  intermarche: ["#E30613", "#E30613", "#E30613"],
  laboutiqueofficielle: ["#E30613", "#E30613", "#E30613"],

  // Fashion
  nike: ["#D50000", "#D50000", "#D50000"],
  adidas: ["#1D428A", "#1D428A", "#1D428A"],
  zara: ["#FFFFFF", "#FFFFFF", "#FFFFFF"], // logo noir/blanc → on garde blanc
  uniqlo: ["#FF0000", "#FF0000", "#FF0000"],
  hm: ["#E50010", "#E50010", "#E50010"],
  puma: ["#E41B23", "#E41B23", "#E41B23"],

  // Tech
  apple: ["#FFFFFF", "#FFFFFF", "#FFFFFF"], // marque noir/blanc → blanc uniquement
  google: ["#4285F4", "#4285F4", "#4285F4"],
  microsoft: ["#F25022", "#F25022", "#F25022"],
  openai: ["#10A37F", "#10A37F", "#10A37F"],
  chatgpt: ["#10A37F", "#10A37F", "#10A37F"],
  github: ["#4078C0", "#4078C0", "#4078C0"], // on évite le noir officiel
  vercel: ["#0070F3", "#0070F3", "#0070F3"],

  // Travel
  britishairways: ["#075AAA", "#BA0C2F", "#FFFFFF"],
  vueling: ["#FFCC00", "#4D4D4D", "#FFFFFF"],
  transavia: ["#00A94F", "#005A2B", "#FFFFFF"],
  ryanair: ["#073590", "#FEC800", "#FFFFFF"],
  easyjet: ["#FF6600", "#FFFFFF", "#FF8C42"],
  iberia: ["#DA291C", "#F6BE00", "#FFFFFF"],
  lufthansa: ["#05164D", "#FFCC00", "#FFFFFF"],
  airfrance: ["#002157", "#E1000F", "#FFFFFF"],
  airbnb: ["#FF5A5F", "#FF5A5F", "#FF5A5F"],
  booking: ["#003580", "#003580", "#003580"],
  expedia: ["#FFB700", "#FFB700", "#FFB700"],
  tripadvisor: ["#00EB5B", "#00EB5B", "#00EB5B"],
  ouigo: ["#DF2180", "#DF2180", "#DF2180"],
  sncf: ["#E60012", "#E60012", "#E60012"],

  // Food
  mcdonalds: ["#FFC72C", "#FFC72C", "#FFC72C"],
  starbucks: ["#00704A", "#00704A", "#00704A"],
  uber: ["#276EF1", "#276EF1", "#276EF1"],
  ubereats: ["#06C167", "#06C167", "#06C167"],
  deliveroo: ["#00C1B2", "#00C1B2", "#00C1B2"],
  burgerking: ["#D62300", "#D62300", "#D62300"],
  dominos: ["#0B5ED7", "#0B5ED7", "#0B5ED7"],

  // Default
  default: ["#3B82F6", "#3B82F6", "#3B82F6"],
};

// 🎲 Sélection aléatoire
export const getRandomBrandColor = (brandName: string): string => {
  const normalized = brandName?.toLowerCase().trim();
  const colors = brandColors[normalized] || brandColors.default;
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
