import { z } from "zod";
import { Course } from "../db";

export const CourseRow = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  category: z.string().optional(),
});

export type CourseRowType = z.infer<typeof CourseRow>;

export function canonicalizeTitle(s: string): string {
  return s
    .replace(/\u200c/g, "") // remove ZWNJ
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

export function rowToCourse(r: CourseRowType): Course {
  const now = Date.now();
  return {
    code: r.code,
    title: canonicalizeTitle(r.title),
    category: r.category,
    createdAt: now,
    updatedAt: now,
  };
}

