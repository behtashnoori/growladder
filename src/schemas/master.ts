import { z } from "zod";
import { Master } from "@/db";
import { toStr, normalizeText } from "@/lib/normalize";

export const MasterRow = z.object({
  code: z.preprocess(toStr, z.string().min(1, "کد خالی است")),
  title: z.preprocess(toStr, z.string().min(1, "عنوان خالی است")),
});

export type MasterRowType = z.infer<typeof MasterRow>;

export function rowToMaster(r: MasterRowType): Master {
  const now = Date.now();
  return {
    code: normalizeText(r.code),
    title: normalizeText(r.title),
    updatedAt: now,
    createdAt: now,
  } as Master;
}
