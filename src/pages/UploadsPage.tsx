import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { downloadTemplateCourses } from "@/lib/xlsx";
import {
  downloadTemplatePersonnel,
  downloadTemplateDecrees,
  downloadTemplatePosts,
  downloadTemplateSections,
  downloadTemplateDepartments,
  downloadTemplateManagements,
} from "@/lib/templates";
import { useNavigate } from "react-router-dom";

const items = [
  {
    label: "دوره‌ها",
    to: "/uploads/courses",
    template: (t: "xlsx" | "csv") => downloadTemplateCourses(t),
  },
  {
    label: "پرسنل",
    to: "/uploads/personnel",
    template: (t: "xlsx" | "csv") => downloadTemplatePersonnel(t),
  },
  {
    label: "احکام کارگزینی",
    to: "/uploads/decrees",
    template: (t: "xlsx" | "csv") => downloadTemplateDecrees(t),
  },
  {
    label: "پست‌ها",
    to: "/uploads/posts",
    template: (t: "xlsx" | "csv") => downloadTemplatePosts(t),
  },
  {
    label: "بخش‌ها",
    to: "/uploads/sections",
    template: (t: "xlsx" | "csv") => downloadTemplateSections(t),
  },
  {
    label: "اداره‌ها",
    to: "/uploads/departments",
    template: (t: "xlsx" | "csv") => downloadTemplateDepartments(t),
  },
  {
    label: "مدیریت‌ها",
    to: "/uploads/managements",
    template: (t: "xlsx" | "csv") => downloadTemplateManagements(t),
  },
  {
    label: "شغل-دوره",
    to: "/uploads/job-course",
    template: undefined,
  },
];

const UploadsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <Card key={it.to}>
          <CardHeader>
            <CardTitle className="text-right">{it.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 justify-end">
            {it.template && (
              <>
                <Button variant="outline" onClick={() => it.template!("xlsx")}>تمپلیت XLSX</Button>
                <Button variant="outline" onClick={() => it.template!("csv")}>تمپلیت CSV</Button>
              </>
            )}
            <Button onClick={() => navigate(it.to)}>آپلود</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UploadsPage;
