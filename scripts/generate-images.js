const fs = require("fs");
const path = require("path");

const publicImagesDir = path.join(__dirname, "..", "public", "images");

// Helper to copy file
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.basename(src)} -> ${path.basename(dest)}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err);
  }
}

// Helper to generate beautiful SVG placeholders
function generateSVG(filename, text, colorStart, colorEnd, categoryIcon = "") {
  const width = 800;
  const height = 800;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
    <defs>
      <linearGradient id="grad-${filename}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colorStart};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colorEnd};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad-${filename})" />
    <g transform="translate(100, 100)" filter="url(#shadow)">
      <rect width="600" height="600" rx="30" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2"/>
    </g>
    <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="120" font-weight="900" opacity="0.12">${categoryIcon || "STORE"}</text>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="36" font-weight="700" letter-spacing="1.5">${text.toUpperCase()}</text>
    <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255, 255, 255, 0.7)" font-family="'Outfit', sans-serif" font-size="18" font-weight="400" letter-spacing="3">PREMIUM COLLECTION</text>
  </svg>`;

  fs.writeFileSync(path.join(publicImagesDir, filename), svg);
  console.log(`Generated SVG: ${filename}`);
}

// 1. Ensure directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// 2. Setup product images
// Copy premium generated assets to their corresponding slots (and fallbacks)
const p1_src = path.join(publicImagesDir, "product-1-1.png");
const p2_src = path.join(publicImagesDir, "product-2-1.png");
const p3_src = path.join(publicImagesDir, "product-3-1.png");

// Copy them to the .jpg extension to match products.json database references
copyFile(p1_src, path.join(publicImagesDir, "product-1-1.jpg"));
copyFile(p1_src, path.join(publicImagesDir, "product-1-2.jpg"));
copyFile(p1_src, path.join(publicImagesDir, "product-1-3.jpg"));

copyFile(p2_src, path.join(publicImagesDir, "product-2-1.jpg"));
copyFile(p2_src, path.join(publicImagesDir, "product-2-2.jpg"));
copyFile(p2_src, path.join(publicImagesDir, "product-2-3.jpg"));

copyFile(p3_src, path.join(publicImagesDir, "product-3-1.jpg"));
copyFile(p3_src, path.join(publicImagesDir, "product-3-2.jpg"));
copyFile(p3_src, path.join(publicImagesDir, "product-3-3.jpg"));

// Generate 360-degree rotation view mockup images for products 1, 2, 3, 5, 8, 11 (the ones with has360: true)
const rotateProducts = ["1", "2", "3", "5", "8", "11"];
const anglesCount = 8;

rotateProducts.forEach(prodId => {
  let colorStart = "#4f46e5";
  let colorEnd = "#312e81";
  let name = `Product ${prodId}`;

  if (prodId === "1") { name = "Casaco"; colorStart = "#1e293b"; colorEnd = "#0f172a"; }
  if (prodId === "2") { name = "Sapatilhas"; colorStart = "#2563eb"; colorEnd = "#1e3a8a"; }
  if (prodId === "3") { name = "Smartwatch"; colorStart = "#7c3aed"; colorEnd = "#4c1d95"; }
  if (prodId === "5") { name = "Teclado"; colorStart = "#dc2626"; colorEnd = "#7f1d1d"; }
  if (prodId === "8") { name = "Halteres"; colorStart = "#16a34a"; colorEnd = "#14532d"; }
  if (prodId === "11") { name = "Auscultadores"; colorStart = "#ea580c"; colorEnd = "#7c2d12"; }

  for (let i = 1; i <= anglesCount; i++) {
    const angleText = `${name} 360° - Frame ${i}`;
    // We can generate interactive SVGs that show the product rotating
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <linearGradient id="grad-360-${prodId}-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorStart};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorEnd};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#grad-360-${prodId}-${i})" />
      
      <!-- Rotating grid visualizer -->
      <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="2" />
      <circle cx="400" cy="400" r="200" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1.5" />
      <ellipse cx="400" cy="400" rx="300" ry="100" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="2" transform="rotate(${(i - 1) * 45} 400 400)" />
      
      <!-- 3D rotation frame text and indicators -->
      <g transform="translate(400, 400) rotate(${(i - 1) * 45})">
        <rect x="-80" y="-80" width="160" height="160" rx="20" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3" />
        <text x="0" y="10" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="48" font-weight="800">360°</text>
      </g>
      
      <text x="50%" y="15%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="28" font-weight="700" letter-spacing="1">${name.toUpperCase()}</text>
      <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255, 255, 255, 0.6)" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">FRAME ${i} / ${anglesCount} (DRAG TO ROTATE)</text>
    </svg>`;
    fs.writeFileSync(path.join(publicImagesDir, `product-${prodId}-360-${i}.svg`), svg);
  }
  console.log(`Generated 8 360-degree frames for Product ${prodId}`);
});

// 3. Generate placeholders for other products
generateSVG("product-4-1.jpg", "Mochila UrbanTravel", "#4f46e5", "#312e81", "BAG");
generateSVG("product-4-2.jpg", "UrbanTravel Interior", "#3b82f6", "#1d4ed8", "BAG");

generateSVG("product-5-1.jpg", "Teclado Vulcan", "#b91c1c", "#450a0a", "KEY");
generateSVG("product-5-2.jpg", "Vulcan Switches", "#ef4444", "#991b1b", "KEY");

generateSVG("product-6-1.jpg", "Rato Wraith", "#1e293b", "#0f172a", "MOUSE");
generateSVG("product-6-2.jpg", "Wraith Sensor", "#334155", "#1e293b", "MOUSE");

generateSVG("product-7-1.jpg", "Candeeiro Aura", "#d97706", "#78350f", "LAMP");
generateSVG("product-7-2.jpg", "Aura Charger", "#f59e0b", "#b45309", "LAMP");

generateSVG("product-8-1.jpg", "Halteres Ajustáveis", "#10b981", "#064e3b", "GYM");
generateSVG("product-8-2.jpg", "Halteres Suporte", "#34d399", "#047857", "GYM");

generateSVG("product-9-1.jpg", "Suporte Magneto", "#1e293b", "#0f172a", "CAR");
generateSVG("product-9-2.jpg", "Magneto Grelha", "#475569", "#334155", "CAR");

generateSVG("product-10-1.jpg", "Sérum Glow", "#db2777", "#831843", "GLOW");
generateSVG("product-10-2.jpg", "Glow Ingredients", "#ec4899", "#9d174d", "GLOW");

generateSVG("product-11-1.jpg", "Auscultadores SonicShield", "#ea580c", "#7c2d12", "AUDIO");
generateSVG("product-11-2.jpg", "SonicShield Case", "#f97316", "#c2410c", "AUDIO");

generateSVG("product-12-1.jpg", "Coluna TerraBass", "#0d9488", "#115e59", "BASS");
generateSVG("product-12-2.jpg", "TerraBass IPX7", "#14b8a6", "#0f766e", "BASS");

// 4. Generate placeholders for Categories
const categories = [
  { file: "cat-clothing.svg", name: "Roupa / Clothing", start: "#8b5cf6", end: "#4c1d95", icon: "👕" },
  { file: "cat-footwear.svg", name: "Calçado / Footwear", start: "#3b82f6", end: "#1d4ed8", icon: "👟" },
  { file: "cat-accessories.svg", name: "Acessórios / Accessories", start: "#f59e0b", end: "#b45309", icon: "🎒" },
  { file: "cat-technology.svg", name: "Tecnologia / Tech", start: "#10b981", end: "#047857", icon: "⌚" },
  { file: "cat-gaming.svg", name: "Gaming / Gaming", start: "#ef4444", end: "#991b1b", icon: "🎮" },
  { file: "cat-home.svg", name: "Casa / Home & Decor", start: "#06b6d4", end: "#0891b2", icon: "🏠" },
  { file: "cat-sports.svg", name: "Desporto / Sports", start: "#ec4899", end: "#be185d", icon: "🏋️" },
  { file: "cat-auto.svg", name: "Automóvel / Automotive", start: "#64748b", end: "#334155", icon: "🚗" },
  { file: "cat-beauty.svg", name: "Beleza / Beauty", start: "#d946ef", end: "#a21caf", icon: "💄" },
  { file: "cat-sales.svg", name: "Promoções / Sales", start: "#ea580c", end: "#c2410c", icon: "🏷️" }
];

categories.forEach(cat => {
  generateSVG(cat.file, cat.name.split(" / ")[0], cat.start, cat.end, cat.icon);
});

console.log("All assets created successfully!");
