import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Users,
  User,
  Upload,
  Briefcase,
  FileUp,
  Award,
  Menu,
  X,
  FileText,
  Folder,
  Building,
  Users2,
  TreePine,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUploadsOpen, setIsUploadsOpen] = useState(false);
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', icon: BarChart3, label: 'داشبورد', color: 'text-primary' },
    // moved to "اطلاعات پایه" submenu: courses
    // moved to "اطلاعات پایه" submenu: personnel list and org structure
    // Master list items are moved into a collapsible section below
    { path: '/profiles', icon: User, label: 'پرونده آموزشی', color: 'text-level' },
    // temporarily hide jobs
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg">نردبان آموزش</h2>
              <p className="text-sm text-muted-foreground">سیستم مدیریت آموزش</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-muted group",
                  isActive && "bg-primary/10 border-r-2 border-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : item.color)} />
                <span className={cn(
                  "font-medium text-right",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Collapsible Masters (Basic Data) submenu */}
          <div className="mt-2">
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-all",
                (
                  ['/courses','/personnel','/org-structure','/posts','/post-ranks','/sections','/departments','/managements']
                    .some(p => location.pathname.startsWith(p))
                ) && "bg-primary/10 border-r-2 border-primary"
              )}
              onClick={() => setIsMastersOpen((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <Folder className={cn("w-5 h-5", "text-secondary")} />
                <span className={cn(
                  "font-medium",
                  (
                    ['/courses','/personnel','/org-structure','/posts','/post-ranks','/sections','/departments','/managements']
                      .some(p => location.pathname.startsWith(p))
                  ) ? "text-primary" : "text-foreground"
                )}>اطلاعات پایه</span>
              </div>
              {isMastersOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
            </button>

            {isMastersOpen && (
              <div className="mt-1 space-y-1 pr-6">
                {[
                  { to: '/courses', label: 'دوره‌های آموزش', icon: BookOpen },
                  { to: '/personnel', label: 'لیست پرسنل', icon: Users },
                  { to: '/org-structure', label: 'ساختار سازمانی', icon: TreePine },
                  { to: '/posts', label: 'لیست پست‌ها', icon: FileText },
                  { to: '/post-ranks', label: 'لیست رده پست‌ها', icon: Award },
                  { to: '/sections', label: 'لیست بخش‌ها', icon: Folder },
                  { to: '/departments', label: 'لیست اداره‌ها', icon: Building },
                  { to: '/managements', label: 'لیست مدیریت‌ها', icon: Users2 },
                ].map((child) => {
                  const active = location.pathname === child.to;
                  const Icon = child.icon as any;
                  return (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-muted",
                        active && "bg-primary/10 text-primary border-r-2 border-primary"
                      )}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collapsible Uploads submenu */}
          <div className="mt-2">
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-all",
                location.pathname.startsWith('/uploads') && "bg-primary/10 border-r-2 border-primary"
              )}
              onClick={() => setIsUploadsOpen((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <Upload className={cn("w-5 h-5", location.pathname.startsWith('/uploads') ? "text-primary" : "text-secondary")} />
                <span className={cn(
                  "font-medium",
                  location.pathname.startsWith('/uploads') ? "text-primary" : "text-foreground"
                )}>آپلود داده‌ها</span>
              </div>
              {isUploadsOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
            </button>

            {isUploadsOpen && (
              <div className="mt-1 space-y-1 pr-6">
                {[
                  { to: '/uploads/personnel', label: 'آپلود پرسنل' },
                  { to: '/uploads/courses', label: 'آپلود دوره‌ها' },
                  { to: '/uploads/posts', label: 'آپلود پست‌ها' },
                  { to: '/uploads/post-ranks', label: 'آپلود رده پست‌ها' },
                  { to: '/uploads/sections', label: 'آپلود بخش‌ها' },
                  { to: '/uploads/departments', label: 'آپلود اداره‌ها' },
                  { to: '/uploads/managements', label: 'آپلود مدیریت‌ها' },
                  { to: '/uploads/job-course', label: 'آپلود شغل-دوره' },
                ].map((child) => {
                  const active = location.pathname === child.to;
                  return (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={cn(
                        "block px-4 py-2 rounded-md text-sm hover:bg-muted",
                        active && "bg-primary/10 text-primary border-r-2 border-primary"
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-achievement" />
              <span className="text-sm font-medium">نکته روز</span>
            </div>
            <p className="text-xs text-muted-foreground">
              آموزش مستمر کلید موفقیت در سازمان است
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-primary-foreground" />
          </div>
          <h2 className="font-bold">نردبان آموزش</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden bg-card border-b border-border">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : item.color)} />
                  <span className="font-medium text-right">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;