import MasterUploadPage from "./MasterUploadPage";
import { db } from "@/db";
import { downloadTemplateDepartments } from "@/lib/templates";

const DepartmentsUploadPage = () => (
  <MasterUploadPage
    table={db.departments}
    title="آپلود اداره‌ها"
    queryKey="departments"
    templateFn={downloadTemplateDepartments}
    exportName="departments"
    navigateTo="/upload/departments?recent=1"
  />
);

export default DepartmentsUploadPage;
