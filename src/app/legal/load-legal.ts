import fs from "fs";
import path from "path";

export type LegalSections = {
  privacy: string;
  terms: string;
  disclaimerConsumer: string;
  disclaimerCommercial: string;
  zhCn: string;
  zhTw: string;
};

/** Plain text extracted from `public/legal/Legal Perspectives 20260415.docx.pdf` (see `npm run extract-legal`). */
export function getLegalSections(): LegalSections {
  const fp = path.join(process.cwd(), "src/app/legal/legal-document.txt");
  const full = fs.readFileSync(fp, "utf-8");

  const markerTerms = "Terms of Service  \nSobie";
  const iT = full.indexOf(markerTerms);
  const iC = full.indexOf("\nDisclaimer for Consumer Section");
  const iM = full.indexOf("\nDisclaimer for Commercial Section");
  const iZh = full.indexOf("隐私政策和服务条款");
  const iZhTw = full.indexOf("隱私政策和服務條款");

  if (iT < 0 || iC < 0 || iM < 0 || iZh < 0 || iZhTw < 0) {
    throw new Error(
      "Legal document markers missing in legal-document.txt. Run `npm run extract-legal` after updating the PDF."
    );
  }

  return {
    privacy: full.slice(0, iT).trim(),
    terms: full.slice(iT, iC).trim(),
    disclaimerConsumer: full.slice(iC, iM).trim(),
    disclaimerCommercial: full.slice(iM, iZh).trim(),
    zhCn: full.slice(iZh, iZhTw).trim(),
    zhTw: full.slice(iZhTw).trim(),
  };
}
