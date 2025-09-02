import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PersonnelUploadPreviewDialog, {
  PreviewStats,
} from "@/components/PersonnelUploadPreviewDialog";
import { readRows } from "@/lib/xlsx";
import { PersonnelRow, rowToPersonnel, PersonnelRowType } from "@/schemas/personnel";
import { db, bulkUpsertPersonnel, Personnel } from "@/db";
import { useToast } from "@/components/ui/use-toast";

const headerMap: Record<string, keyof PersonnelRowType> = {
  emp_code: "emp_code",
  "کد پرسنلی": "emp_code",
  "کدپرسنلی": "emp_code",
  PersonnelCode: "emp_code",
  name: "name",
  "نام": "name",
  "نام و نام خانوادگی": "name",
  Job_Title_id: "job_title_id",
  job_title_id: "job_title_id",
  "کد عنوان شغلی": "job_title_id",
  Job_Title: "job_title",
  job_title: "job_title",
  "عنوان شغلی": "job_title",
  Department_id: "department_id",
  dept_id: "department_id",
  "کد دپارتمان": "department_id",
  Department_Name: "department_name",
  dept_name: "department_name",
  "نام دپارتمان": "department_name",
  "گروه": "department_name",
};

const PersonnelUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewStats | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRead = async () => {
    if (!file) return;
    setLoading(true);
    const rows = await readRows(file);
    const existingArr = await db.personnel.toArray();
    const existing = new Map(existingArr.map((p) => [p.emp_code, p]));
    const toInsert: Personnel[] = [];
    const toUpdate: Personnel[] = [];
    const errors: PreviewStats["errors"] = [];

    for (const raw of rows) {
      const normalized: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw)) {
        const key = headerMap[k.trim()];
        if (key) normalized[key] = v;
      }
      if (Object.values(normalized).every((v) => !v.trim())) continue;
      const obj: PersonnelRowType = {
        emp_code: (normalized.emp_code ?? "").trim(),
        name: (normalized.name ?? "").trim(),
        job_title_id: normalized.job_title_id?.trim(),
        job_title: normalized.job_title?.trim(),
        department_id: normalized.department_id?.trim(),
        department_name: normalized.department_name?.trim(),
      };
      const parsed = PersonnelRow.safeParse(obj);
      if (!parsed.success) {
        errors.push({ row: raw, message: parsed.error.issues[0]?.message ?? "" });
        continue;
      }
      const person = rowToPersonnel(parsed.data);
      const current = existing.get(person.emp_code);
      if (!current) {
        toInsert.push(person);
      } else if (
        current.name !== person.name ||
        current.job_title_id !== person.job_title_id ||
        current.job_title !== person.job_title ||
        current.department_id !== person.department_id ||
        current.department_name !== person.department_name
      ) {
        person.createdAt = current.createdAt;
        toUpdate.push(person);
      }
    }
    setPreview({ toInsert, toUpdate, errors });
    setDialogOpen(true);
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!preview) return;
    await bulkUpsertPersonnel([...preview.toInsert, ...preview.toUpdate]);
    queryClient.invalidateQueries({ queryKey: ["personnel"] });
    toast({
      description: `افزوده ${preview.toInsert.length}، به‌روزرسانی ${preview.toUpdate.length}، خطا ${preview.errors.length}`,
    });
    navigate("/personnel?recent=1");
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>آپلود پرسنل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button onClick={handleRead} disabled={!file || loading}>
            خواندن فایل
          </Button>
        </CardContent>
      </Card>
      {preview && (
        <PersonnelUploadPreviewDialog
          open={dialogOpen}
          stats={preview}
          onCancel={() => setDialogOpen(false)}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
};

export default PersonnelUploadPage;

