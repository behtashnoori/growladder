import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Target
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalPersonnel: 248,
    totalCourses: 45,
    completedTrainings: 1,
    pendingTrainings: 12
  };

  const recentActivities = [
    { id: 1, title: 'دوره مدیریت پروژه', status: 'completed', date: '1402/08/15' },
    { id: 2, title: 'آموزش ایمنی کار', status: 'in-progress', date: '1402/08/12' },
    { id: 3, title: 'مهارت‌های ارتباطی', status: 'pending', date: '1402/08/10' }
  ];

  const topPerformers = [
    { name: 'احمد محمدی', level: 5, completed: 12 },
    { name: 'فاطمه احمدی', level: 4, completed: 10 },
    { name: 'علی حسینی', level: 4, completed: 9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            داشبورد نردبان آموزش
          </h1>
          <p className="text-muted-foreground mt-2">
            خلاصه‌ای از وضعیت آموزش‌های سازمان
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل پرسنل</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPersonnel}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% نسبت به ماه گذشته
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">دوره‌های آموزشی</CardTitle>
            <BookOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 دوره جدید این ماه
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-achievement/10 to-achievement/5 border-achievement/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آموزش‌های تکمیل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-completed" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-completed">{stats.completedTrainings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              85% نرخ تکمیل
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در انتظار بررسی</CardTitle>
            <Clock className="h-4 w-4 text-in-progress" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-in-progress">{stats.pendingTrainings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              نیاز به بررسی
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              پیشرفت آموزشی سازمان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>دوره‌های اجباری</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>دوره‌های تخصصی</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>مهارت‌های نرم</span>
                <span>52%</span>
              </div>
              <Progress value={52} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-achievement" />
              برترین افراد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-achievement to-level rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {performer.completed} دوره تکمیل شده
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">سطح {performer.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            فعالیت‌های اخیر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {activity.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-completed" />
                  )}
                  {activity.status === 'in-progress' && (
                    <Clock className="w-5 h-5 text-in-progress" />
                  )}
                  {activity.status === 'pending' && (
                    <AlertCircle className="w-5 h-5 text-pending" />
                  )}
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <Badge 
                  variant={
                    activity.status === 'completed' ? 'default' : 
                    activity.status === 'in-progress' ? 'secondary' : 'outline'
                  }
                >
                  {activity.status === 'completed' && 'تکمیل شده'}
                  {activity.status === 'in-progress' && 'در حال انجام'}
                  {activity.status === 'pending' && 'در انتظار'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;