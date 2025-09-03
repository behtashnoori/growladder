import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db } from "@/db";
import { exportRows } from "@/lib/xlsx";

const JobDetailPage = () => {
  const { id } = useParams();
  const jobQuery = useQuery({ queryKey: ["job", id], queryFn: () => db.jobs.get(id!), enabled: !!id });
  const linksQuery = useQuery({
    queryKey: ["jobCourseReq", id],
    queryFn: () => db.jobCourseReq.where({ job_title_id: id! }).toArray(),
    enabled: !!id,
  });
  const coursesQuery = useQuery({ queryKey: ["courses"], queryFn: () => db.courses.toArray() });
  const [search, setSearch] = useState("");

  if (jobQuery.isLoading) return <div className="p-4">در حال بارگذاری...</div>;
  const job = jobQuery.data;
  if (!job) return <div className="p-4">یافت نشد</div>;

  const courseMap = new Map(coursesQuery.data?.map((c) => [c.code, c.title]));
  const rows =
    linksQuery.data?.map((l) => ({
      code: l.course_code,
      title: courseMap.get(l.course_code) ?? "",
    })) ?? [];
  const filtered = rows.filter(
    (r) => r.title.includes(search) || r.code.includes(search)
  );

  const exportJobCourses = async (type: "xlsx" | "csv") => {
    const data = rows.map((r) => ({
      job_title_id: job.job_title_id,
      job_title: job.job_title,
      course_code: r.code,
      course_title: r.title,
    }));
    exportRows(data, `${job.job_title_id}_courses`, type);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{job.job_title}</h2>
          <p className="text-sm text-muted-foreground">{job.department_name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportJobCourses("xlsx")}>خروجی XLSX</Button>
          <Button variant="outline" onClick={() => exportJobCourses("csv")}>
            خروجی CSV
          </Button>
        </div>
      </div>
      <Input
        placeholder="جستجوی دوره"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>کد دوره</TableHead>
            <TableHead>عنوان دوره</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.code}>
              <TableCell>{r.code}</TableCell>
              <TableCell>{r.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobDetailPage;
