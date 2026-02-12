import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export function readExcelRows(filePath: string): string[][] {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });
  return data as string[][];
}

export function findExcelInFolder(
  folder: string,
  pattern?: RegExp
): string | null {
  const dir = path.join(process.cwd(), folder);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const xlsx = files.find(
    (f) =>
      /\.xlsx$/i.test(f) &&
      (!pattern || pattern.test(f))
  );
  return xlsx ? path.join(dir, xlsx) : null;
}
