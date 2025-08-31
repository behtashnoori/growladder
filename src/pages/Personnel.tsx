import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  User, 
  Calendar,
  Award,
  BookOpen,
  Filter,
  Eye
} from 'lucide-react';

const Personnel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock personnel data based on the provided headers
  const personnel = [
    {
      id: '12345',
      name: 'احمد محمدی',
      status: 'فعال',
      requester: 'مدیر منابع انسانی',
      courseTitle: 'مدیریت پروژه پیشرفته',
      courseNature: 'اجباری',
      newGrade: 'کارشناس ارشد',
      currentGrade: 'کارشناس',
      duration: '40 ساعت',
      attendance: 95,
      courseStatus: 'تکمیل شده',
      startDate: '1402/06/01',
      endDate: '1402/07/15',
      education: 'کارشناسی',
      field: 'مهندسی کامپیوتر',
      department: 'فناوری اطلاعات',
      position: 'برنامه‌نویس',
      organization: 'شرکت فناوری پیشرو',
      institute: 'دانشگاه تهران',
      cost: '2,500,000',
      type: 'تقویمی',
      certificate: 'دارد',
      progress: 100
    },
    {
      id: '12346',
      name: 'فاطمه احمدی',
      status: 'فعال',
      requester: 'مدیر واحد',
      courseTitle: 'مهارت‌های ارتباطی',
      courseNature: 'انتخابی',
      newGrade: 'کارشناس',
      currentGrade: 'کارمند',
      duration: '24 ساعت',
      attendance: 88,
      courseStatus: 'در حال انجام',
      startDate: '1402/08/01',
      endDate: '1402/09/01',
      education: 'کارشناسی',
      field: 'مدیریت بازرگانی',
      department: 'فروش',
      position: 'کارشناس فروش',
      organization: 'شرکت فناوری پیشرو',
      institute: 'موسسه آموزش مدیریت',
      cost: '1,800,000',
      type: 'اضطراری',
      certificate: 'در انتظار',
      progress: 65
    },
    {
      id: '12347',
      name: 'علی حسینی',
      status: 'فعال',
      requester: 'مدیر فنی',
      courseTitle: 'ایمنی و بهداشت کار',
      courseNature: 'اجباری',
      newGrade: 'سرکارگر',
      currentGrade: 'کارگر',
      duration: '16 ساعت',
      attendance: 92,
      courseStatus: 'شروع نشده',
      startDate: '1402/09/15',
      endDate: '1402/10/01',
      education: 'دیپلم',
      field: 'مکانیک',
      department: 'تولید',
      position: 'اپراتور',
      organization: 'شرکت فناوری پیشرو',
      institute: 'مرکز آموزش فنی',
      cost: '800,000',
      type: 'تقویمی',
      certificate: 'ندارد',
      progress: 0
    }
  ];

  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && person.courseStatus === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تکمیل شده': return 'bg-completed text-completed-foreground';
      case 'در حال انجام': return 'bg-in-progress text-in-progress-foreground';
      case 'شروع نشده': return 'bg-pending text-pending-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getNatureColor = (nature: string) => {
    return nature === 'اجباری' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            لیست پرسنل
          </h1>
          <p className="text-muted-foreground mt-2">
            مدیریت اطلاعات آموزشی پرسنل سازمان
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <User className="w-4 h-4 ml-2" />
          افزودن پرسنل
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="جستجوی نام، دوره یا واحد..."
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
            variant={selectedFilter === 'تکمیل شده' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('تکمیل شده')}
            size="sm"
          >
            تکمیل شده
          </Button>
          <Button
            variant={selectedFilter === 'در حال انجام' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('در حال انجام')}
            size="sm"
          >
            در حال انجام
          </Button>
        </div>
      </div>

      {/* Personnel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPersonnel.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-1">{person.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">کد پرسنلی: {person.id}</p>
                  <p className="text-sm text-muted-foreground">{person.position} - {person.department}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(person.courseStatus)}>
                    {person.courseStatus}
                  </Badge>
                  <Badge className={getNatureColor(person.courseNature)}>
                    {person.courseNature}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">{person.courseTitle}</h4>
                  <p className="text-sm text-muted-foreground">{person.institute}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{person.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{person.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>پیشرفت دوره</span>
                    <span>{person.progress}%</span>
                  </div>
                  <Progress value={person.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">حضور: </span>
                    <span className={person.attendance > 85 ? 'text-completed' : 'text-in-progress'}>
                      {person.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">هزینه: </span>
                    <span>{person.cost} تومان</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  {person.certificate === 'دارد' && (
                    <Award className="w-4 h-4 text-achievement" />
                  )}
                  <span className="text-sm">
                    گواهی: {person.certificate}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-1" />
                  مشاهده
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPersonnel.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            پرسنلی یافت نشد
          </h3>
          <p className="text-sm text-muted-foreground">
            جستجوی خود را تغییر دهید یا فیلتر جدیدی انتخاب کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default Personnel;