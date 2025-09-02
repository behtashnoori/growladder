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
import { db, getPersonCourses } from "@/db";
import { exportRows } from "@/lib/xlsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const PersonDetailPage = () => {
  const { emp_code } = useParams();
  const personQuery = useQuery({
    queryKey: ["person", emp_code],
    queryFn: () => db.personnel.get(emp_code!),
    enabled: !!emp_code,
  });
  const linksQuery = useQuery({
    queryKey: ["jobCourseReq", personQuery.data?.job_title_id],
    queryFn: () =>
      db.jobCourseReq.where({ job_title_id: personQuery.data!.job_title_id! }).toArray(),
    enabled: !!personQuery.data?.job_title_id,
  });
  const coursesQuery = useQuery({ queryKey: ["courses"], queryFn: () => db.courses.toArray() });
  const personCoursesQuery = useQuery({
    queryKey: ["personCourse", emp_code],
    queryFn: () => getPersonCourses(emp_code!),
    enabled: !!emp_code,
  });
  const [filter, setFilter] = useState<"all" | "needed" | "passed">("all");
  const [search, setSearch] = useState("");

  if (personQuery.isLoading) return <div className="p-4">در حال بارگذاری...</div>;
  const person = personQuery.data;
  if (!person) return <div className="p-4">یافت نشد</div>;

  const courseMap = new Map(coursesQuery.data?.map((c) => [c.code, c.title]));
  const taken = new Map(
    personCoursesQuery.data?.map((pc) => [pc.course_code, pc.status])
  );
  const rows =
    linksQuery.data?.map((l) => ({
      code: l.course_code,
      title: courseMap.get(l.course_code) ?? "",
      status: taken.get(l.course_code) === "passed" ? "passed" : "needed",
    })) ?? [];

  const filtered = rows.filter((r) => {
    if (filter === "needed" && r.status !== "needed") return false;
    if (filter === "passed" && r.status !== "passed") return false;
    return r.title.includes(search) || r.code.includes(search);
  });

  const exportPersonCourses = (type: "xlsx" | "csv") => {
    const data = rows.map((r) => ({
      emp_code: person.emp_code,
      name: person.name,
      course_code: r.code,
      course_title: r.title,
      status: r.status,
    }));
    exportRows(data, `${person.emp_code}_courses`, type);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{person.name}</h2>
          <p className="text-sm text-muted-foreground">
            {person.emp_code} | {person.job_title ?? ""} | {person.department_name ?? ""}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>خروجی</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportPersonCourses("xlsx")}>XLSX</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportPersonCourses("csv")}>CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          همه
        </Button>
        <Button
          variant={filter === "needed" ? "default" : "outline"}
          onClick={() => setFilter("needed")}
        >
          موردنیاز
        </Button>
        <Button
          variant={filter === "passed" ? "default" : "outline"}
          onClick={() => setFilter("passed")}
        >
          گذرانده
        </Button>
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
            <TableHead>وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.code}>
              <TableCell>{r.code}</TableCell>
              <TableCell>{r.title}</TableCell>
              <TableCell>
                {r.status === "passed" ? "✅" : "موردنیاز"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button disabled>ثبت گذراندن دوره</Button>
    </div>
  );
};

export default PersonDetailPage;

