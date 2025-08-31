import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  Star,
  Filter,
  Plus
} from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock course data based on the provided headers
  const courses = [
    {
      id: 1,
      jobTitle: 'مدیر پروژه',
      department: 'فناوری اطلاعات',
      departmentId: 'IT001',
      requiredCourse: 'مدیریت پروژه پیشرفته',
      courseId: 'PM101',
      duration: '40 ساعت',
      level: 'پیشرفته',
      participants: 15,
      rating: 4.8,
      status: 'active'
    },
    {
      id: 2,
      jobTitle: 'کارشناس منابع انسانی',
      department: 'منابع انسانی',
      departmentId: 'HR001',
      requiredCourse: 'قوانین کار و استخدام',
      courseId: 'HR201',
      duration: '24 ساعت',
      level: 'متوسط',
      participants: 8,
      rating: 4.6,
      status: 'active'
    },
    {
      id: 3,
      jobTitle: 'کارشناس مالی',
      department: 'مالی و حسابداری',
      departmentId: 'FIN001',
      requiredCourse: 'استandardهای حسابداری',
      courseId: 'FIN101',
      duration: '32 ساعت',
      level: 'تخصصی',
      participants: 12,
      rating: 4.7,
      status: 'pending'
    },
    {
      id: 4,
      jobTitle: 'مهندس نرم‌افزار',
      department: 'فناوری اطلاعات',
      departmentId: 'IT001',
      requiredCourse: 'معماری نرم‌افزار',
      courseId: 'SW301',
      duration: '48 ساعت',
      level: 'پیشرفته',
      participants: 20,
      rating: 4.9,
      status: 'active'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.requiredCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && course.status === selectedFilter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدی': return 'bg-secondary text-secondary-foreground';
      case 'متوسط': return 'bg-accent text-accent-foreground';
      case 'پیشرفته': return 'bg-primary text-primary-foreground';
      case 'تخصصی': return 'bg-level text-level-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-completed text-completed-foreground';
      case 'pending': return 'bg-in-progress text-in-progress-foreground';
      case 'inactive': return 'bg-pending text-pending-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            دوره‌های آموزشی
          </h1>
          <p className="text-muted-foreground mt-2">
            مدیریت و نظارت بر دوره‌های آموزشی سازمان
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Plus className="w-4 h-4 ml-2" />
          دوره جدید
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="جستجوی دوره، سمت یا واحد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            size="sm"
          >
            همه
          </Button>
          <Button
            variant={selectedFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('active')}
            size="sm"
          >
            فعال
          </Button>
          <Button
            variant={selectedFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('pending')}
            size="sm"
          >
            در انتظار
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">
                    {course.requiredCourse}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.jobTitle}
                  </p>
                </div>
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{course.department}</span>
                  <Badge variant="outline" className="text-xs">
                    {course.departmentId}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{course.participants} شرکت‌کننده</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-achievement text-achievement" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge className={getStatusColor(course.status)}>
                  {course.status === 'active' && 'فعال'}
                  {course.status === 'pending' && 'در انتظار'}
                  {course.status === 'inactive' && 'غیرفعال'}
                </Badge>
                <Button variant="outline" size="sm">
                  جزئیات
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            دوره‌ای یافت نشد
          </h3>
          <p className="text-sm text-muted-foreground">
            جستجوی خود را تغییر دهید یا فیلتر جدیدی انتخاب کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;