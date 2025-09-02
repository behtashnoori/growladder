import MasterUploadPage from "./MasterUploadPage";
import { db } from "@/db";
import { downloadTemplateDecrees } from "@/lib/templates";

const DecreesUploadPage = () => (
  <MasterUploadPage
    table={db.decrees}
    title="آپلود احکام کارگزینی"
    queryKey="decrees"
    templateFn={downloadTemplateDecrees}
    exportName="decrees"
    navigateTo="/upload/decrees?recent=1"
  />
);

export default DecreesUploadPage;
