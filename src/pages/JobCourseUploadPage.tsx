import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCoursePreviewDialog, { PreviewStats } from "@/components/JobCoursePreviewDialog";
import { readRows } from "@/lib/xlsx";
import {
  db,
  Job,
  JobCourseReq,
  bulkUpsertJobs,
  bulkUpsertJobCourseReq,
} from "@/db";
import { useToast } from "@/components/ui/use-toast";
import { canonicalizeTitle } from "@/schemas/course";

const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_");

const JobCourseUploadPage = () => {
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
    const rawRows = await readRows(file);
    const existingJobs = await db.jobs.toArray();
    const jobMap = new Map(existingJobs.map((j) => [j.job_title_id, j]));
    const existingLinks = await db.jobCourseReq.toArray();
    const linkSet = new Set(
      existingLinks.map((l) => `${l.job_title_id}|${l.course_code}`)
    );
    const courses = await db.courses.toArray();
    const courseMap = new Map(courses.map((c) => [c.code, c]));

    const jobsToInsert: Job[] = [];
    const jobsToUpdate: Job[] = [];
    const linksToInsert: JobCourseReq[] = [];
    const linkDuplicates: JobCourseReq[] = [];
    const errors: PreviewStats["errors"] = [];
    const missingCourses: PreviewStats["missingCourses"] = [];

    rawRows.forEach((row, idx) => {
      const rowNumber = idx + 2; // header is row 1
      const norm: Record<string, string> = {};
      let hasValue = false;
      Object.entries(row).forEach(([k, v]) => {
        const key = normalizeKey(k);
        const val = String(v ?? "").trim();
        if (val) hasValue = true;
        norm[key] = val;
      });
      if (!hasValue) return; // skip empty rows

      const job_title_id = norm.job_title_id;
      const job_title = canonicalizeTitle(norm.job_title ?? "");
      const department_name = canonicalizeTitle(norm.department_name ?? "");
      const department_id = norm.department_id || undefined;
      const course_code = norm.required_course_id;

      if (!job_title_id || !job_title || !course_code) {
        errors.push({ row: rowNumber, message: "ردیف نامعتبر" });
        return;
      }

      const course = courseMap.get(course_code);
      if (!course) {
        missingCourses.push({ row: rowNumber, course_code });
        return;
      }

      const now = Date.now();
      const existingJob = jobMap.get(job_title_id);
      const job: Job = {
        job_title_id,
        job_title,
        department_name: department_name || undefined,
        department_id,
        updatedAt: now,
        createdAt: existingJob?.createdAt ?? now,
      };
      if (!existingJob) {
        jobsToInsert.push(job);
        jobMap.set(job_title_id, job);
      } else if (
        existingJob.job_title !== job.job_title ||
        existingJob.department_name !== job.department_name ||
        existingJob.department_id !== job.department_id
      ) {
        jobsToUpdate.push(job);
      }

      const linkKey = `${job_title_id}|${course_code}`;
      const link: JobCourseReq = {
        job_title_id,
        course_code,
        required: 1,
        createdAt: now,
      };
      if (linkSet.has(linkKey)) {
        linkDuplicates.push(link);
      } else {
        linksToInsert.push(link);
        linkSet.add(linkKey);
      }
    });

    setPreview({
      jobsToInsert,
      jobsToUpdate,
      linksToInsert,
      linkDuplicates,
      errors,
      missingCourses,
    });
    setDialogOpen(true);
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!preview) return;
    await bulkUpsertJobs([...preview.jobsToInsert, ...preview.jobsToUpdate]);
    await bulkUpsertJobCourseReq(preview.linksToInsert);
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["jobCourseReq"] });
    toast({
      description: `شغل جدید ${preview.jobsToInsert.length}، به‌روزرسانی شغل ${preview.jobsToUpdate.length}، ارتباط جدید ${preview.linksToInsert.length}، تکراری ${preview.linkDuplicates.length}، خطا ${preview.errors.length}`,
    });
    navigate("/jobs?recent=1");
  };

  return (
    <div className="p-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>آپلود نگاشت شغل-دوره</CardTitle>
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
        <JobCoursePreviewDialog
          open={dialogOpen}
          stats={preview}
          onCancel={() => setDialogOpen(false)}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
};

export default JobCourseUploadPage;
