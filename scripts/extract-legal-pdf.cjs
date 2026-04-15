/**
 * Regenerate `src/app/legal/legal-document.txt` from the canonical PDF in /public/legal.
 * Run: npm run extract-legal
 */
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

async function main() {
  const root = path.join(__dirname, "..");
  const pdfPath = path.join(
    root,
    "public",
    "legal",
    "Legal Perspectives 20260415.docx.pdf"
  );
  const outPath = path.join(root, "src", "app", "legal", "legal-document.txt");

  const buf = fs.readFileSync(pdfPath);
  const data = await pdf(buf);
  let t = data.text.replace(/\f/g, "\n").replace(/\r\n/g, "\n");
  t = t.replace(/\n*--\s*\d+\s+of\s+\d+\s+--\n*/g, "\n\n");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, t.trim(), "utf8");
  console.log("Wrote", path.relative(root, outPath), "—", t.trim().length, "characters");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
