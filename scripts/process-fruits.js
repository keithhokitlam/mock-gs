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

const workbook = XLSX.read(fs.readFileSync(path.join(inputDir, excelFile)), { type: "buffer" });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });

const dir = path.dirname(outputFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(rows, null, 0), "utf8");
console.log(`Wrote ${rows.length} rows to src/data/fruits.json`);
console.log("Commit and push to deploy the updated fruits list.");
