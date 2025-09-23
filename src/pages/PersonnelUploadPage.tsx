import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import PersonnelUploadPreviewDialog, {
  PreviewStats,
} from "@/components/PersonnelUploadPreviewDialog";
import { readRows, downloadTemplatePersonnel } from "@/lib/xlsx";
import { PersonnelRow, rowToPersonnel, PersonnelRowType } from "@/schemas/personnel";
import { db, bulkUpsertPersonnel, Personnel } from "@/db";
import { normalizeRow, PERSONNEL_HEADERS } from "@/lib/headers";
import { useToast } from "@/components/ui/use-toast";

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

    rows.forEach((raw, idx) => {
      const normalized = normalizeRow(raw, PERSONNEL_HEADERS);
      if (Object.values(normalized).every((v) => !v)) return;
      const obj: PersonnelRowType = {
        emp_code: normalized.emp_code ?? "",
        name: normalized.name ?? "",
      };
      const parsed = PersonnelRow.safeParse(obj);
      if (!parsed.success) {
        errors.push({ row: raw, message: parsed.error.issues[0]?.message ?? "", rowNum: idx + 2 });
        return;
      }
      const person = rowToPersonnel(parsed.data);
      const current = existing.get(person.emp_code);
      if (!current) {
        toInsert.push(person);
      } else if (current.name !== person.name) {
        person.createdAt = current.createdAt;
        toUpdate.push(person);
      }
    });

    setPreview({ toInsert, toUpdate, errors });
    setDialogOpen(true);
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      await bulkUpsertPersonnel([...preview.toInsert, ...preview.toUpdate]);
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      toast({
        title: "✅ آپلود موفقیت‌آمیز",
        description: `${preview.toInsert.length} رکورد جدید اضافه شد، ${preview.toUpdate.length} رکورد به‌روزرسانی شد`,
        duration: 5000,
      });
      setDialogOpen(false);
      setPreview(null);
      setFile(null);
      navigate("/personnel?recent=1");
    } catch (error) {
      toast({
        title: "❌ خطا در آپلود",
        description: "خطایی در آپلود داده‌ها رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>آپلود پرسنل</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">دانلود تمپلیت</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadTemplatePersonnel("xlsx")}>XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTemplatePersonnel("csv")}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          loading={loading}
        />
      )}
    </div>
  );
};

export default PersonnelUploadPage;

