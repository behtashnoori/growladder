import * as XLSX from "xlsx";

export interface Rank {
  code: string;
  name: string;
}

const STORAGE_KEY = "ranks";

const DEFAULT_RANKS: Rank[] = [
  { code: "1", name: "کارمند" },
  { code: "2", name: "کاردان" },
  { code: "3", name: "کارشناس" },
  { code: "4", name: "مسئول" },
  { code: "5", name: "رئیس" },
  { code: "6", name: "مدیر" },
];

export async function getRanks(): Promise<Rank[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Rank[];
    } catch {
      // fall through to defaults
    }
  }
  return DEFAULT_RANKS;
}

export async function importRanks(file: File): Promise<Rank[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Rank>(sheet);
  if (!Array.isArray(rows) || rows.some((r) => !r.code || !r.name)) {
    throw new Error("invalid");
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  return rows;
}
