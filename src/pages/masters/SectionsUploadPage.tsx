import MasterUploadPage from "./MasterUploadPage";
import { db } from "@/db";
import { downloadTemplateSections } from "@/lib/templates";

const SectionsUploadPage = () => (
  <MasterUploadPage
    table={db.sections}
    title="آپلود بخش‌ها"
    queryKey="sections"
    templateFn={downloadTemplateSections}
    exportName="sections"
    navigateTo="/uploads/sections?recent=1"
  />
);

export default SectionsUploadPage;
