#!/usr/bin/env node
/**
 * Converts Fruits Excel from food-category-lists/ to JSON.
 * Run: npm run process-fruits
 * Then commit src/data/fruits.json and redeploy.
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(process.cwd(), "food-category-lists");
const outputFile = path.join(process.cwd(), "src", "data", "fruits.json");

const excelFile = fs.readdirSync(inputDir).find((f) => /fruits.*\.xlsx$/i.test(f));
if (!excelFile) {
  console.error("No Fruits*.xlsx found in food-category-lists/");
  process.exit(1);
}

function isBlank(v) {
  return v == null || String(v).trim() === "";
}

const workbook = XLSX.read(fs.readFileSync(path.join(inputDir, excelFile)), { type: "buffer" });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
let rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });

// Remove blank rows (entire row is empty)
rows = rows.filter((row) => !row.every((cell) => isBlank(cell)));

// Find columns that have at least one non-blank cell
const numCols = Math.max(...rows.map((r) => r.length), 0);
const colHasContent = Array(numCols)
  .fill(false)
  .map((_, i) => rows.some((row) => !isBlank(row[i])));

// Filter to only columns with content
rows = rows.map((row) =>
  row.filter((_, i) => i < colHasContent.length && colHasContent[i])
);

const dir = path.dirname(outputFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(rows, null, 0), "utf8");
console.log(`Wrote ${rows.length} rows to src/data/fruits.json`);
console.log("Commit and push to deploy the updated fruits list.");
