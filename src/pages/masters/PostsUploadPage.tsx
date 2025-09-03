import MasterUploadPage from "./MasterUploadPage";
import { db } from "@/db";
import { downloadTemplatePosts } from "@/lib/templates";

const PostsUploadPage = () => (
  <MasterUploadPage
    table={db.posts}
    title="آپلود پست‌ها"
    queryKey="posts"
    templateFn={downloadTemplatePosts}
    exportName="posts"
    navigateTo="/uploads/posts?recent=1"
  />
);

export default PostsUploadPage;
