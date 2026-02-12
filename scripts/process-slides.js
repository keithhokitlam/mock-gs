#!/usr/bin/env node
/**
 * Copies slide images from slides-input/ to public/foodcategory/.
 * Run: npm run process-slides
 *
 * Usage:
 * 1. Export PowerPoint slides as PNG/JPG to slides-input/
 * 2. Run: npm run process-slides
 * 3. Rebuild/redeploy so the food category page picks up the new images
 */

const fs = require("fs");
const path = require("path");

const inputDir = path.join(process.cwd(), "slides-input");
const outputDir = path.join(process.cwd(), "public", "foodcategory");

const IMAGE_EXT = /\.(png|jpg|jpeg|webp)$/i;

if (!fs.existsSync(inputDir)) {
  console.error("slides-input/ folder not found. Create it and add your slide images.");
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => IMAGE_EXT.test(f)).sort();

if (files.length === 0) {
  console.log("No image files found in slides-input/. Add PNG/JPG images and run again.");
  process.exit(0);
}

let copied = 0;
for (let i = 0; i < files.length; i++) {
  const base = path.basename(files[i], path.extname(files[i]));
  const ext = path.extname(files[i]).toLowerCase();
  const outName = `slide-${String(i + 1).padStart(2, "0")}-${base}${ext}`;
  const src = path.join(inputDir, files[i]);
  const dest = path.join(outputDir, outName);
  fs.copyFileSync(src, dest);
  console.log(`  ${files[i]} → foodcategory/${outName}`);
  copied++;
}

console.log(`\nCopied ${copied} slide(s) to public/foodcategory/`);
console.log("Run 'npm run build' (or deploy) to see them on the food category page.");
