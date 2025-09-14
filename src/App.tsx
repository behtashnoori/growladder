import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
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
import EditEmployee from "./pages/employees/EditEmployee";
import AddTraining from "./pages/trainings/AddTraining";
import PostsUploadPage from "./pages/masters/PostsUploadPage";
import SectionsUploadPage from "./pages/masters/SectionsUploadPage";
import DepartmentsUploadPage from "./pages/masters/DepartmentsUploadPage";
import ManagementsUploadPage from "./pages/masters/ManagementsUploadPage";
import ImportRanks from "./pages/admin/ImportRanks";
import BulkImport from "./pages/admin/BulkImport";
import OrgUnitsPage from "./pages/org/OrgUnitsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
          <Route path="/personnel" element={<AppLayout><PersonnelPage /></AppLayout>} />
          <Route path="/personnel/:emp_code" element={<AppLayout><PersonDetailPage /></AppLayout>} />
          <Route path="/profiles" element={<AppLayout><TrainingProfiles /></AppLayout>} />
          <Route path="/uploads" element={<AppLayout><UploadsPage /></AppLayout>} />
          <Route path="/uploads/courses" element={<AppLayout><CourseUploadPage /></AppLayout>} />
          <Route path="/uploads/personnel" element={<AppLayout><PersonnelUploadPage /></AppLayout>} />
          <Route path="/uploads/posts" element={<AppLayout><PostsUploadPage /></AppLayout>} />
          <Route path="/uploads/sections" element={<AppLayout><SectionsUploadPage /></AppLayout>} />
          <Route path="/uploads/departments" element={<AppLayout><DepartmentsUploadPage /></AppLayout>} />
          <Route path="/uploads/managements" element={<AppLayout><ManagementsUploadPage /></AppLayout>} />
          <Route path="/jobs" element={<AppLayout><JobsPage /></AppLayout>} />
          <Route path="/jobs/:id" element={<AppLayout><JobDetailPage /></AppLayout>} />
          <Route path="/uploads/job-course" element={<AppLayout><JobCourseUploadPage /></AppLayout>} />
          <Route path="/employees/edit" element={<AppLayout><EditEmployee /></AppLayout>} />
          <Route path="/trainings/add" element={<AppLayout><AddTraining /></AppLayout>} />
          <Route path="/admin/import-ranks" element={<AppLayout><ImportRanks /></AppLayout>} />
          <Route path="/admin/import" element={<AppLayout><BulkImport /></AppLayout>} />
          <Route path="/org-units" element={<AppLayout><OrgUnitsPage /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
