import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportRows, downloadTemplatePersonnel } from "@/lib/xlsx";
import { getPersonnel, Personnel, db } from "@/db";
import { useState, useMemo } from "react";

const PersonnelPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const recent = searchParams.get("recent") === "1";
  const recentSince = recent ? Date.now() - 5 * 60 * 1000 : undefined;
  const [search, setSearch] = useState("");

  const { data: personnel = [] } = useQuery({
    queryKey: ["personnel"],
    queryFn: () => getPersonnel(),
  });
  const { data: links = [] } = useQuery({
    queryKey: ["jobCourseReq"],
    queryFn: () => db.jobCourseReq.toArray(),
  });

  const linkCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of links) {
      map.set(l.job_title_id, (map.get(l.job_title_id) ?? 0) + 1);
    }
    return map;
  }, [links]);

  const displayed = (recentSince
    ? personnel.filter((p) => p.createdAt >= recentSince)
    : personnel
  ).filter(
    (p) =>
      p.name.includes(search) || p.emp_code.includes(search)
  );

  const exportAll = (items: Personnel[], type: "xlsx" | "csv") => {
    exportRows(items, "personnel", type);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => navigate("/personnel/upload")}>آپلود</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">دانلود تمپلیت</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadTemplatePersonnel("xlsx")}>
                XLSX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTemplatePersonnel("csv")}>
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">خروجی همه</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportAll(personnel, "xlsx")}>XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAll(personnel, "csv")}>CSV</DropdownMenuItem>
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
      <Input
        placeholder="جستجو"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>کد پرسنلی</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>عنوان شغلی</TableHead>
            <TableHead>دپارتمان</TableHead>
            <TableHead>دوره‌های موردنیاز</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayed.map((p) => (
            <TableRow
              key={p.emp_code}
              className="cursor-pointer"
              onClick={() => navigate(`/personnel/${p.emp_code}`)}
            >
              <TableCell>{p.emp_code}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.job_title ?? ""}</TableCell>
              <TableCell>{p.department_name ?? ""}</TableCell>
              <TableCell>{linkCount.get(p.job_title_id ?? "") ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PersonnelPage;

