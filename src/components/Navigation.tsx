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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', icon: BarChart3, label: 'داشبورد', color: 'text-primary' },
    { path: '/courses', icon: BookOpen, label: 'دوره‌های آموزش', color: 'text-secondary' },
    { path: '/personnel', icon: Users, label: 'لیست پرسنل', color: 'text-accent' },
    { path: '/personnel/upload', icon: Upload, label: 'آپلود پرسنل', color: 'text-achievement' },
    { path: '/profiles', icon: User, label: 'پرونده آموزشی', color: 'text-level' },
    { path: '/upload', icon: Upload, label: 'آپلود دوره', color: 'text-secondary' },
    { path: '/jobs', icon: Briefcase, label: 'شغل‌ها', color: 'text-secondary' },
    { path: '/job-course-upload', icon: FileUp, label: 'آپلود شغل-دوره', color: 'text-accent' },
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