import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CourseRecord {
  jobTitleId: string;
  jobTitle: string;
  departmentName: string;
  departmentId: string;
  requiredCourse: string;
  requiredCourseId: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('coursesData');
    if (stored) setCourses(JSON.parse(stored));
  }, []);

  const filtered = courses.filter(c =>
    c.requiredCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            دوره‌های آموزشی
          </h1>
          <p className="text-muted-foreground mt-2">لیست دوره‌های آپلود شده</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="جستجوی دوره، سمت یا واحد..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{course.requiredCourse}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.jobTitle}</p>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>واحد: {course.departmentName}</p>
              <p>کد دوره: {course.requiredCourseId}</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            دوره‌ای یافت نشد یا هنوز آپلود نشده است
          </p>
        )}
      </div>
    </div>
  );
};

export default Courses;
