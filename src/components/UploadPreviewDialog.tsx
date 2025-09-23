import { useState } from "react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type { Course } from "@/db";

interface ErrorItem {
  row: Record<string, string>;
  message: string;
}

export interface PreviewStats {
  toInsert: Course[];
  toUpdate: Course[];
  duplicates: Course[];
  errors: ErrorItem[];
}

interface SectionProps {
  title: string;
  rows: (Course | ErrorItem)[];
  render: (r: Course | ErrorItem) => React.ReactNode;
}

const Section = ({ title, rows, render }: SectionProps) => {
  const [open, setOpen] = useState(false);
  const preview = rows.slice(0, 10);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          {title}
          <Badge variant="secondary">{rows.length}</Badge>
        </h4>
        {rows.length > 10 && (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="link" size="sm">مشاهده همه</Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="h-80">
                <Table>
                  <TableBody>{rows.map((r, i) => <TableRow key={i}>{render(r)}</TableRow>)}</TableBody>
                </Table>
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <DrawerClose asChild>
                  <Button variant="outline">بستن</Button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      <ScrollArea className="h-48">
        <Table>
          <TableBody>
            {preview.map((r, i) => (
              <TableRow key={i}>{render(r)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Separator className="my-2" />
    </div>
  );
};

interface Props {
  open: boolean;
  stats: PreviewStats;
  onCommit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const UploadPreviewDialog = ({ open, stats, onCommit, onCancel, loading = false }: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>پیش نمایش داده ها</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
        <Section
          title="داده های جدید"
          rows={stats.toInsert}
          render={(r) => (
            <>
              {"code" in r ? (
                <>
                  <TableCell>{r.code}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.category ?? ""}</TableCell>
                </>
              ) : null}
            </>
          )}
        />
        <Section
          title="به روز رسانی"
          rows={stats.toUpdate}
          render={(r) => (
            <>
              {"code" in r ? (
                <>
                  <TableCell>{r.code}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.category ?? ""}</TableCell>
                </>
              ) : null}
            </>
          )}
        />
        <Section
          title="تکراری"
          rows={stats.duplicates}
          render={(r) => (
            <>
              {"code" in r ? (
                <>
                  <TableCell>{r.code}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.category ?? ""}</TableCell>
                </>
              ) : null}
            </>
          )}
        />
        <Section
          title="خطاها"
          rows={stats.errors}
          render={(r) => (
            <>
              {"message" in r && (
                <>
                  <TableCell>{r.row.code}</TableCell>
                  <TableCell className="text-red-600">{r.message}</TableCell>
                </>
              )}
            </>
          )}
        />
          </div>
        </ScrollArea>
      </div>
      <DialogFooter className="flex-shrink-0 mt-4 border-t pt-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          بازگشت
        </Button>
        <Button onClick={onCommit} disabled={loading}>
          {loading ? "در حال پردازش..." : "تایید"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default UploadPreviewDialog;

