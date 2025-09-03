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
import type { Job, JobCourseReq } from "@/db";

interface ErrorItem {
  row: number;
  message: string;
}

interface MissingCourse {
  row: number;
  course_code: string;
}

export interface PreviewStats {
  jobsToInsert: Job[];
  jobsToUpdate: Job[];
  linksToInsert: JobCourseReq[];
  linkDuplicates: JobCourseReq[];
  errors: ErrorItem[];
  missingCourses: MissingCourse[];
}

interface SectionProps<T> {
  title: string;
  rows: T[];
  render: (r: T) => React.ReactNode;
}

function Section<T>({ title, rows, render }: SectionProps<T>) {
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
              <Button variant="link" size="sm">
                مشاهده همه
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="h-80">
                <Table>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>{render(r)}</TableRow>
                    ))}
                  </TableBody>
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
}

interface Props {
  open: boolean;
  stats: PreviewStats;
  onCommit: () => void;
  onCancel: () => void;
}

const JobCoursePreviewDialog = ({ open, stats, onCommit, onCancel }: Props) => (
  <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <DialogContent className="max-w-5xl">
      <DialogHeader>
        <DialogTitle>پیش‌نمایش شغل و دوره</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Section
          title="شغل‌های جدید"
          rows={stats.jobsToInsert}
          render={(r) => (
            <>
              <TableCell>{r.job_title_id}</TableCell>
              <TableCell>{r.job_title}</TableCell>
              <TableCell>{r.department_name ?? ""}</TableCell>
            </>
          )}
        />
        <Section
          title="به‌روزرسانی شغل‌ها"
          rows={stats.jobsToUpdate}
          render={(r) => (
            <>
              <TableCell>{r.job_title_id}</TableCell>
              <TableCell>{r.job_title}</TableCell>
              <TableCell>{r.department_name ?? ""}</TableCell>
            </>
          )}
        />
        <Section
          title="ارتباطات جدید"
          rows={stats.linksToInsert}
          render={(r) => (
            <>
              <TableCell>{r.job_title_id}</TableCell>
              <TableCell>{r.course_code}</TableCell>
            </>
          )}
        />
        <Section
          title="ارتباط تکراری"
          rows={stats.linkDuplicates}
          render={(r) => (
            <>
              <TableCell>{r.job_title_id}</TableCell>
              <TableCell>{r.course_code}</TableCell>
            </>
          )}
        />
        <Section
          title="خطاها"
          rows={stats.errors}
          render={(r) => (
            <>
              <TableCell>{r.row}</TableCell>
              <TableCell className="text-red-600">{r.message}</TableCell>
            </>
          )}
        />
        <Section
          title="دوره‌های ناموجود"
          rows={stats.missingCourses}
          render={(r) => (
            <>
              <TableCell>{r.row}</TableCell>
              <TableCell className="text-red-600">{r.course_code}</TableCell>
            </>
          )}
        />
        {stats.missingCourses.length > 0 && (
          <p className="text-sm text-red-600">
            ابتدا فایل دوره‌ها را آپلود کنید.
          </p>
        )}
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel}>
          بازگشت
        </Button>
        <Button onClick={onCommit} disabled={stats.missingCourses.length > 0}>
          تایید
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default JobCoursePreviewDialog;
