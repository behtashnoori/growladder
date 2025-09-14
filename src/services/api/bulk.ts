import http from "../http";

export interface BulkResult {
  inserted: number;
  updated: number;
  failed: { rowIndex: number; reason: string }[];
}

export type BulkResource = "employees" | "courses" | "job-requirements" | "trainings";

export async function bulkUpsert<T>(resource: BulkResource, rows: T[]): Promise<BulkResult> {
  const res = await http.post(`/bulk/${resource}/upsert`, { rows });
  return res.data as BulkResult;
}
