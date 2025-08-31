import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadPreviewDialog, { PreviewStats } from "@/components/UploadPreviewDialog";
import { readRows } from "@/lib/xlsx";
import { CourseRow, rowToCourse, CourseRowType } from "@/schemas/course";
import { db, bulkUpsertCourses, Course } from "@/db";
import { useToast } from "@/components/ui/use-toast";

const UploadPage = () => {
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
    const existingArr = await db.courses.toArray();
    const existing = new Map(existingArr.map((c) => [c.code, c]));
    const toInsert: Course[] = [];
    const toUpdate: Course[] = [];
    const duplicates: Course[] = [];
    const errors: PreviewStats["errors"] = [];
    for (const raw of rows) {
      const obj: CourseRowType = {
        code: (raw.code ?? "").trim(),
        title: (raw.title ?? "").trim(),
        category: raw.category?.trim() || undefined,
      };
      const parsed = CourseRow.safeParse(obj);
      if (!parsed.success) {
        errors.push({ row: raw, message: parsed.error.issues[0]?.message ?? "" });
        continue;
      }
      const course = rowToCourse(parsed.data);
      const current = existing.get(course.code);
      if (!current) {
        toInsert.push(course);
      } else if (
        current.title !== course.title || current.category !== course.category
      ) {
        course.createdAt = current.createdAt;
        toUpdate.push(course);
      } else {
        duplicates.push(current);
      }
    }
    setPreview({ toInsert, toUpdate, duplicates, errors });
    setDialogOpen(true);
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!preview) return;
    await bulkUpsertCourses([...preview.toInsert, ...preview.toUpdate]);
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    toast({
      description: `افزوده ${preview.toInsert.length}، به‌روزرسانی ${preview.toUpdate.length}، تکراری ${preview.duplicates.length}، خطا ${preview.errors.length}`,
    });
    navigate("/courses?recent=1");
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>آپلود دوره‌ها</CardTitle>
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
        <UploadPreviewDialog
          open={dialogOpen}
          stats={preview}
          onCancel={() => setDialogOpen(false)}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
};

export default UploadPage;

