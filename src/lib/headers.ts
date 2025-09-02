import { normalizeText } from "./normalize";

export type AliasMap = Record<string, string[]>;

const COMMON: AliasMap = {
  code: ["code", "کد", "کُد", "شماره"],
  title: ["title", "عنوان", "نام", "تيتل"],
  note: ["note", "یادداشت", "توضیحات"],
};

export const PERSONNEL_HEADERS: AliasMap = {
  emp_code: ["emp_code", "کد پرسنلی", "PersonnelCode"],
  name: ["name", "نام", "نام و نام خانوادگی"],
};

export const MASTER_HEADERS: AliasMap = {
  code: COMMON.code,
  title: COMMON.title,
};

export function mergeAliases(...maps: AliasMap[]): Record<string, string[]> {
  return Object.assign({}, ...maps);
}

export function normalizeRow(
  row: Record<string, string>,
  map: AliasMap
): Record<string, string> {
  const res: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = findKey(k);
    if (key) res[key] = normalizeText(v);
  }
  return res;

  function findKey(header: string): string | undefined {
    const h = normalizeText(header).toLowerCase();
    for (const [canon, aliases] of Object.entries(map)) {
      if (aliases.some((a) => normalizeText(a).toLowerCase() === h)) {
        return canon;
      }
    }
    return undefined;
  }
}

export const COMMON_HEADERS = COMMON;
