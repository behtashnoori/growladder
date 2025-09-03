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
import type { Table } from "dexie";
import { Master, bulkUpsertMasters } from "@/db";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  table: Table<Master, string>;
  title: string;
  queryKey: string;
  templateFn: (type: "xlsx" | "csv") => void;
  exportName: string;
  navigateTo: string;
}

const MasterUploadPage = ({
  table,
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
    const rows = await readRows(file);
    const existingArr = await table.toArray();
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
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!preview) return;
    await bulkUpsertMasters(table, [...preview.toInsert, ...preview.toUpdate]);
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    toast({
      description: `افزوده ${preview.toInsert.length}، به‌روزرسانی ${preview.toUpdate.length}، تکراری ${preview.duplicates.length}، خطا ${preview.errors.length}`,
    });
    navigate(navigateTo);
  };

  const handleExport = async (type: "xlsx" | "csv") => {
    const items = await table.toArray();
    exportRows(items, exportName, type);
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
        />
      )}
    </div>
  );
};

export default MasterUploadPage;
