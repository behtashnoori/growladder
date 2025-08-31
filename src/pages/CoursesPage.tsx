import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses, Course, db } from "@/db";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { downloadTemplateCourses } from "@/lib/xlsx";
import { utils, writeFile, WorkBook } from "xlsx";

const exportCourses = (items: Course[], type: "xlsx" | "csv") => {
  const ws = utils.json_to_sheet(items);
  if (type === "xlsx") {
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Courses");
    writeFile(wb, "courses.xlsx");
  } else {
    const csv = utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const recent = searchParams.get("recent") === "1";
  const recentSince = recent ? Date.now() - 5 * 60 * 1000 : undefined;

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
  });

  const displayed = recentSince
    ? courses.filter((c) => c.createdAt >= recentSince)
    : courses;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => navigate("/upload")}>آپلود</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">دانلود تمپلیت</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadTemplateCourses("xlsx")}>XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTemplateCourses("csv")}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">خروجی همه</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportCourses(courses, "xlsx")}>XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCourses(courses, "csv")}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="destructive"
            onClick={async () => {
              await db.delete();
              location.reload();
            }}
          >
            حذف داده‌ها
          </Button>
        </div>
        <Button
          variant={recent ? "default" : "outline"}
          onClick={() => {
            if (recent) {
              searchParams.delete("recent");
            } else {
              searchParams.set("recent", "1");
            }
            setSearchParams(searchParams);
          }}
        >
          داده‌های اخیر
        </Button>
      </div>
      {recent && <Badge>افزوده‌های جدید</Badge>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>کد</TableHead>
            <TableHead>عنوان</TableHead>
            <TableHead>دسته</TableHead>
            <TableHead>ایجاد</TableHead>
            <TableHead>به‌روزرسانی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayed.map((c) => (
            <TableRow key={c.code}>
              <TableCell>{c.code}</TableCell>
              <TableCell>{c.title}</TableCell>
              <TableCell>{c.category ?? ""}</TableCell>
              <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(c.updatedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesPage;

