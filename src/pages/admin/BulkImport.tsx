import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { bulkUpsert, BulkResult, BulkResource } from "@/services/api/bulk";
import * as XLSX from "xlsx";

const resources: { value: BulkResource; label: string }[] = [
  { value: "employees", label: "پرسنل" },
  { value: "courses", label: "دوره‌ها" },
  { value: "job-requirements", label: "نیازمندی‌های شغلی" },
  { value: "trainings", label: "آموزش‌ها" },
];

const BulkImport = () => {
  const { toast } = useToast();
  const [resource, setResource] = useState<BulkResource>("employees");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [result, setResult] = useState<BulkResult | null>(null);

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    setRows(json);
    setResult(null);
  };

  const upload = async () => {
    if (!rows.length) {
      toast({ variant: "destructive", title: "فایل نامعتبر است" });
      return;
    }
    try {
      const res = await bulkUpsert(resource, rows);
      setResult(res);
      toast({ title: "با موفقیت ذخیره شد" });
    } catch {
      toast({ variant: "destructive", title: "خطا در ذخیره" });
    }
  };

  const downloadFailed = () => {
    if (!result?.failed.length) return;
    const csv = ["rowIndex,reason", ...result.failed.map(f => `${f.rowIndex},"${f.reason}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "failed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <Select value={resource} onValueChange={(v: BulkResource) => setResource(v)}>
        <SelectTrigger className="w-64" dir="rtl">
          <SelectValue placeholder="انتخاب منبع" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {resources.map(r => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="file" accept=".xlsx" onChange={e => e.target.files && handleFile(e.target.files[0])} />
      {rows.length > 0 && <div className="text-sm">{rows.length} ردیف</div>}
      <Button onClick={upload}>ارسال</Button>
      {result && (
        <div className="space-y-1 text-sm">
          <div>افزوده‌ها: {result.inserted}</div>
          <div>به‌روزرسانی‌ها: {result.updated}</div>
          <div>خطاها: {result.failed.length}</div>
          {result.failed.length > 0 && (
            <Button variant="secondary" onClick={downloadFailed}>دانلود خطاها</Button>
          )}
        </div>
      )}
      {rows.length > 0 && (
        <pre className="bg-muted p-2 text-xs max-h-64 overflow-auto" dir="ltr">
          {JSON.stringify(rows.slice(0, 5), null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BulkImport;
