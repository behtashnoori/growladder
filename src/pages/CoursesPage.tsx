import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/services/api/courses";
import { list as listCourses } from "@/services/api/courses";
import { Button } from "@/components/ui/button";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { downloadTemplateCourses, exportRows } from "@/lib/xlsx";

const exportCourses = (items: Course[], type: "xlsx" | "csv") => {
  exportRows(items, "courses", type);
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const recent = searchParams.get("recent") === "1";
  const recentSince = recent ? Date.now() - 5 * 60 * 1000 : undefined;

  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => listCourses(),
  });
  const courses = data?.items ?? [];

  const displayed = recentSince
    ? courses.filter((c) => c.createdAt >= recentSince)
    : courses;

  const columns: Column<Course>[] = [
    { key: "code", title: "کد" },
    { key: "title", title: "عنوان" },
    { key: "category", title: "دسته", render: (r) => r.category ?? "" },
    {
      title: "ایجاد",
      render: (r) => new Date(r.createdAt).toLocaleString(),
    },
    {
      title: "به‌روزرسانی",
      render: (r) => new Date(r.updatedAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => navigate("/uploads/courses")}>آپلود</Button>
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
      <FilterableDataTable
        rows={displayed}
        columns={columns}
        searchKeys={["code", "title", "category"]}
      />
    </div>
  );
};

export default CoursesPage;

