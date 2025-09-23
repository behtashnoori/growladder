import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MasterUploadPreviewDialog, { PreviewStats } from "@/components/MasterUploadPreviewDialog";
import { readRows, exportRows } from "@/lib/xlsx";
import { normalizeRow, MASTER_HEADERS } from "@/lib/headers";
import { MasterRow, rowToMaster, MasterRowType } from "@/schemas/master";
import { Master } from "@/db";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { postApi, Post } from "@/services/api/posts";
import { sectionApi, Section } from "@/services/api/sections";
import { departmentApi, Department } from "@/services/api/departments";
import { managementApi, Management } from "@/services/api/managements";

interface Props {
  title: string;
  queryKey: string;
  templateFn: (type: "xlsx" | "csv") => void;
  exportName: string;
  navigateTo: string;
}

const MasterUploadPage = ({
  title,
  queryKey,
  templateFn,
  exportName,
  navigateTo,
}: Props) => {
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
    try {
      const rows = await readRows(file);
      
      // Determine which API to use based on queryKey
      let existingResponse;
      if (queryKey === 'posts') {
        existingResponse = await postApi.getAll();
      } else if (queryKey === 'sections') {
        existingResponse = await sectionApi.getAll();
      } else if (queryKey === 'departments') {
        existingResponse = await departmentApi.getAll();
      } else if (queryKey === 'managements') {
        existingResponse = await managementApi.getAll();
      } else {
        throw new Error('Unsupported master data type');
      }
      
      const existingArr = existingResponse.items;
      const existing = new Map(existingArr.map((m) => [m.code, m]));
      const toInsert: Master[] = [];
      const toUpdate: Master[] = [];
      const duplicates: Master[] = [];
      const errors: PreviewStats["errors"] = [];

      rows.forEach((raw, idx) => {
        const normalized = normalizeRow(raw, MASTER_HEADERS);
        if (Object.values(normalized).every((v) => !v)) return;
        const obj: MasterRowType = {
          code: normalized.code ?? "",
          title: normalized.title ?? "",
        };
        const parsed = MasterRow.safeParse(obj);
        if (!parsed.success) {
          errors.push({ row: raw, message: parsed.error.issues[0]?.message ?? "", rowNum: idx + 2 });
          return;
        }
        const item = rowToMaster(parsed.data);
        const current = existing.get(item.code);
        if (!current) {
          toInsert.push(item);
        } else if (current.title !== item.title) {
          item.createdAt = current.createdAt;
          toUpdate.push(item);
        } else {
          duplicates.push(current);
        }
      });

      setPreview({ toInsert, toUpdate, duplicates, errors });
      setDialogOpen(true);
    } catch (error) {
      toast({
        title: "❌ خطا در خواندن فایل",
        description: "خطایی در خواندن فایل رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!preview) return;
    console.log('Starting commit with preview:', preview);
    setLoading(true);
    try {
      // Determine which API to use based on queryKey
      let apiService;
      if (queryKey === 'posts') {
        apiService = postApi;
      } else if (queryKey === 'sections') {
        apiService = sectionApi;
      } else if (queryKey === 'departments') {
        apiService = departmentApi;
      } else if (queryKey === 'managements') {
        apiService = managementApi;
      } else {
        throw new Error('Unsupported master data type for upload');
      }

      // Create new records
      if (preview.toInsert.length > 0) {
        console.log('Creating new records:', preview.toInsert.length);
        const result = await apiService.bulkCreate(preview.toInsert);
        console.log('Bulk create result:', result);
      }
      
      // Update existing records
      if (preview.toUpdate.length > 0) {
        console.log('Updating existing records:', preview.toUpdate.length);
        for (const update of preview.toUpdate) {
          await apiService.update(update.code, update);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({
        title: "✅ آپلود موفقیت‌آمیز",
        description: `${preview.toInsert.length} ${title} جدید اضافه شد، ${preview.toUpdate.length} ${title} به‌روزرسانی شد`,
        duration: 5000,
      });
      setDialogOpen(false);
      setPreview(null);
      setFile(null);
      navigate(navigateTo);
    } catch (error) {
      console.error('Commit error:', error);
      toast({
        title: "❌ خطا در آپلود",
        description: `خطایی در آپلود داده‌ها رخ داد: ${error instanceof Error ? error.message : 'خطای نامشخص'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: "xlsx" | "csv") => {
    // Determine which API to use based on queryKey
    let response;
    if (queryKey === 'posts') {
      response = await postApi.getAll();
    } else if (queryKey === 'sections') {
      response = await sectionApi.getAll();
    } else if (queryKey === 'departments') {
      response = await departmentApi.getAll();
    } else if (queryKey === 'managements') {
      response = await managementApi.getAll();
    } else {
      throw new Error('Unsupported master data type for export');
    }
    exportRows(response.items, exportName, type);
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">دانلود تمپلیت</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => templateFn("xlsx")}>XLSX</DropdownMenuItem>
                <DropdownMenuItem onClick={() => templateFn("csv")}>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">خروجی همه</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>XLSX</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button onClick={handleRead} disabled={!file || loading}>
            خواندن فایل
          </Button>
        </CardContent>
      </Card>
      {preview && (
        <MasterUploadPreviewDialog
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

export default MasterUploadPage;
