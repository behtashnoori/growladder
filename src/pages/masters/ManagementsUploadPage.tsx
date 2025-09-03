import MasterUploadPage from "./MasterUploadPage";
import { db } from "@/db";
import { downloadTemplateManagements } from "@/lib/templates";

const ManagementsUploadPage = () => (
  <MasterUploadPage
    table={db.managements}
    title="آپلود مدیریت‌ها"
    queryKey="managements"
    templateFn={downloadTemplateManagements}
    exportName="managements"
    navigateTo="/uploads/managements?recent=1"
  />
);

export default ManagementsUploadPage;
