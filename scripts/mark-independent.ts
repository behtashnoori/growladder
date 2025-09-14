import fs from "fs";
import { parse } from "csv-parse/sync";
import { db } from "../src/db";
import { ROOT_ORG_ID } from "../src/types/org-unit";

async function mark(path: string) {
  const content = fs.readFileSync(path, "utf8");
  const rows: { name: string }[] = parse(content, { columns: true, skip_empty_lines: true });
  for (const r of rows) {
    const unit = await db.orgUnits.where("name").equals(r.name).first();
    if (!unit) {
      console.log(`not found: ${r.name}`);
      continue;
    }
    await db.orgUnits.update(unit.id, { isIndependent: true, parentId: ROOT_ORG_ID });
    console.log(`updated: ${r.name}`);
  }
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: bun tsx scripts/mark-independent.ts <file.csv>");
  process.exit(1);
}
mark(file).then(() => process.exit(0));
