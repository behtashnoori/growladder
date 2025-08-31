import { read, utils, writeFile, WorkBook } from "xlsx";

export async function readRows(file: File): Promise<Record<string, string>[]> {
  const data = await file.arrayBuffer();
  const workbook = read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
}

export function downloadTemplateCourses(type: "xlsx" | "csv") {
  const rows = [
    { code: "CRS001", title: "نمونه دوره اول", category: "عمومی" },
    { code: "CRS002", title: "نمونه دوره دوم", category: "تخصصی" },
    { code: "CRS003", title: "نمونه دوره سوم", category: "" },
  ];
  const ws = utils.json_to_sheet(rows);
  if (type === "xlsx") {
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Courses");
    writeFile(wb, "courses_template.xlsx");
  } else {
    const csv = utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
}

