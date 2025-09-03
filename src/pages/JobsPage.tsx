import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db, getJobs } from "@/db";
import { exportRows } from "@/lib/xlsx";

const JobsPage = () => {
  const { data: jobs } = useQuery({ queryKey: ["jobs"], queryFn: () => getJobs() });
  const { data: links } = useQuery({ queryKey: ["jobCourseReq"], queryFn: () => db.jobCourseReq.toArray() });
  const counts = new Map<string, number>();
  links?.forEach((l) => {
    counts.set(l.job_title_id, (counts.get(l.job_title_id) || 0) + 1);
  });
  const [searchParams] = useSearchParams();
  const recent = searchParams.get("recent");
  const navigate = useNavigate();

  const exportJobs = async (type: "xlsx" | "csv") => {
    const rows = await db.jobs.toArray();
    exportRows(rows, "jobs", type);
  };

  const exportJobCourses = async (type: "xlsx" | "csv") => {
    const jobsArr = await db.jobs.toArray();
    const jobMap = new Map(jobsArr.map((j) => [j.job_title_id, j]));
    const courses = await db.courses.toArray();
    const courseMap = new Map(courses.map((c) => [c.code, c]));
    const linksArr = await db.jobCourseReq.toArray();
    const rows = linksArr.map((l) => ({
      job_title_id: l.job_title_id,
      job_title: jobMap.get(l.job_title_id)?.job_title ?? "",
      course_code: l.course_code,
      course_title: courseMap.get(l.course_code)?.title ?? "",
    }));
    exportRows(rows, "job_course", type);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Link to="/job-course-upload">
            <Button>آپلود نگاشت شغل-دوره</Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportJobs("xlsx")}>خروجی شغل‌ها XLSX</Button>
          <Button variant="outline" onClick={() => exportJobs("csv")}>
            خروجی شغل‌ها CSV
          </Button>
          <Button onClick={() => exportJobCourses("xlsx")}>
            خروجی نگاشت XLSX
          </Button>
          <Button variant="outline" onClick={() => exportJobCourses("csv")}>
            خروجی نگاشت CSV
          </Button>
        </div>
      </div>
      {recent && <Badge variant="secondary">تازه به‌روزرسانی‌شده</Badge>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شناسه شغل</TableHead>
            <TableHead>عنوان شغل</TableHead>
            <TableHead>واحد</TableHead>
            <TableHead>تعداد دوره</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((j) => (
            <TableRow
              key={j.job_title_id}
              className="cursor-pointer"
              onClick={() => navigate(`/jobs/${j.job_title_id}`)}
            >
              <TableCell>{j.job_title_id}</TableCell>
              <TableCell>{j.job_title}</TableCell>
              <TableCell>{j.department_name ?? ""}</TableCell>
              <TableCell>{counts.get(j.job_title_id) ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsPage;
