import MasterUploadPage from "./MasterUploadPage";
import { downloadTemplatePosts } from "@/lib/templates";

const PostsUploadPage = () => (
  <MasterUploadPage
    title="آپلود پست‌ها"
    queryKey="posts"
    templateFn={downloadTemplatePosts}
    exportName="posts"
    navigateTo="/uploads/posts?recent=1"
  />
);

export default PostsUploadPage;
