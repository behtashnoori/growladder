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
import UploadPage from "./pages/UploadPage";
import NotFound from "./pages/NotFound";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import JobCourseUploadPage from "./pages/JobCourseUploadPage";

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
          <Route path="/personnel/upload" element={<Layout><PersonnelUploadPage /></Layout>} />
          <Route path="/personnel/:emp_code" element={<Layout><PersonDetailPage /></Layout>} />
          <Route path="/profiles" element={<Layout><TrainingProfiles /></Layout>} />
          <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
          <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetailPage /></Layout>} />
          <Route path="/job-course-upload" element={<Layout><JobCourseUploadPage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
