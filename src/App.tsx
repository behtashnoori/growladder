import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import PersonnelPage from "./pages/PersonnelPage";
import PersonnelUploadPage from "./pages/PersonnelUploadPage";
import PersonDetailPage from "./pages/PersonDetailPage";
import TrainingProfiles from "./pages/TrainingProfiles";
import UploadsPage from "./pages/UploadsPage";
import CourseUploadPage from "./pages/CourseUploadPage";
import NotFound from "./pages/NotFound";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import JobCourseUploadPage from "./pages/JobCourseUploadPage";
import DecreesUploadPage from "./pages/masters/DecreesUploadPage";
import PostsUploadPage from "./pages/masters/PostsUploadPage";
import SectionsUploadPage from "./pages/masters/SectionsUploadPage";
import DepartmentsUploadPage from "./pages/masters/DepartmentsUploadPage";
import ManagementsUploadPage from "./pages/masters/ManagementsUploadPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
          <Route path="/personnel" element={<Layout><PersonnelPage /></Layout>} />
          <Route path="/personnel/:emp_code" element={<Layout><PersonDetailPage /></Layout>} />
          <Route path="/profiles" element={<Layout><TrainingProfiles /></Layout>} />
          <Route path="/uploads" element={<Layout><UploadsPage /></Layout>} />
          <Route path="/uploads/courses" element={<Layout><CourseUploadPage /></Layout>} />
          <Route path="/uploads/personnel" element={<Layout><PersonnelUploadPage /></Layout>} />
          <Route path="/uploads/decrees" element={<Layout><DecreesUploadPage /></Layout>} />
          <Route path="/uploads/posts" element={<Layout><PostsUploadPage /></Layout>} />
          <Route path="/uploads/sections" element={<Layout><SectionsUploadPage /></Layout>} />
          <Route path="/uploads/departments" element={<Layout><DepartmentsUploadPage /></Layout>} />
          <Route path="/uploads/managements" element={<Layout><ManagementsUploadPage /></Layout>} />
          <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetailPage /></Layout>} />
          <Route path="/uploads/job-course" element={<Layout><JobCourseUploadPage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
