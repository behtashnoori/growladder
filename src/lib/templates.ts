import { utils, writeFile, WorkBook } from "xlsx";

function download(rows: Record<string, unknown>[], name: string, type: "xlsx" | "csv") {
  const ws = utils.json_to_sheet(rows);
  if (type === "xlsx") {
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, name.endsWith(".xlsx") ? name : `${name}.xlsx`);
  } else {
    const csv = utils.sheet_to_csv(ws);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.endsWith(".csv") ? name : `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export function downloadTemplatePersonnel(type: "xlsx" | "csv") {
  const rows = [
    { emp_code: "123", name: "نمونه" },
    { emp_code: "456", name: "نمونه دوم" },
    { emp_code: "789", name: "" },
  ];
  download(rows, "personnel_template", type);
}

function masterTemplate(name: string, type: "xlsx" | "csv") {
  const rows = [
    { code: "M1", title: "نمونه ۱", note: "" },
    { code: "M2", title: "نمونه ۲", note: "" },
    { code: "M3", title: "نمونه ۳", note: "" },
  ];
  download(rows, `${name}_template`, type);
}

export const downloadTemplatePosts = (type: "xlsx" | "csv") => masterTemplate("posts", type);
export const downloadTemplatePostRanks = (type: "xlsx" | "csv") => masterTemplate("post_ranks", type);
export const downloadTemplateSections = (type: "xlsx" | "csv") => masterTemplate("sections", type);
export const downloadTemplateDepartments = (type: "xlsx" | "csv") => masterTemplate("departments", type);
export const downloadTemplateManagements = (type: "xlsx" | "csv") => masterTemplate("managements", type);
