import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Search, 
  Trophy, 
  Calendar,
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';

const TrainingProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock profile data
  const profiles = [
    {
      id: '12345',
      name: 'احمد محمدی',
      position: 'برنامه‌نویس ارشد',
      department: 'فناوری اطلاعات',
      level: 5,
      totalPoints: 850,
      completedCourses: 12,
      inProgressCourses: 2,
      requiredCourses: 3,
      achievements: ['متخصص پروژه', 'رهبر تیم', 'مربی'],
      currentRole: 'Senior Developer',
      targetRole: 'Team Lead',
      progress: 78,
      joinDate: '1400/03/15',
      lastActivity: '1402/08/20'
    },
    {
      id: '12346',
      name: 'فاطمه احمدی',
      position: 'کارشناس منابع انسانی',
      department: 'منابع انسانی',
      level: 3,
      totalPoints: 520,
      completedCourses: 8,
      inProgressCourses: 1,
      requiredCourses: 4,
      achievements: ['متخصص استخدام', 'مشاور کارکنان'],
      currentRole: 'HR Specialist',
      targetRole: 'HR Manager',
      progress: 65,
      joinDate: '1401/01/10',
      lastActivity: '1402/08/18'
    },
    {
      id: '12347',
      name: 'علی حسینی',
      position: 'اپراتور تولید',
      department: 'تولید',
      level: 2,
      totalPoints: 280,
      completedCourses: 4,
      inProgressCourses: 1,
      requiredCourses: 6,
      achievements: ['ایمنی کار'],
      currentRole: 'Operator',
      targetRole: 'Senior Operator',
      progress: 35,
      joinDate: '1401/07/01',
      lastActivity: '1402/08/15'
    }
  ];

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'from-achievement to-level';
    if (level >= 3) return 'from-primary to-secondary';
    return 'from-secondary to-accent';
  };

  const getLevelBadge = (level: number) => {
    if (level >= 5) return { label: 'خبره', color: 'bg-achievement text-achievement-foreground' };
    if (level >= 3) return { label: 'ماهر', color: 'bg-primary text-primary-foreground' };
    return { label: 'مبتدی', color: 'bg-secondary text-secondary-foreground' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-level to-achievement bg-clip-text text-transparent">
            پرونده‌های آموزشی
          </h1>
          <p className="text-muted-foreground mt-2">
            ردیابی پیشرفت و مسیر توسعه پرسنل
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="جستجوی پرسنل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => {
          const levelBadge = getLevelBadge(profile.level);
          
          return (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getLevelColor(profile.level)} rounded-full flex items-center justify-center text-white font-bold`}>
                      {profile.level}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{profile.position}</p>
                      <p className="text-xs text-muted-foreground">{profile.department}</p>
                    </div>
                  </div>
                  <Badge className={levelBadge.color}>
                    {levelBadge.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">خلاصه</TabsTrigger>
                    <TabsTrigger value="progress">پیشرفت</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{profile.totalPoints}</div>
                        <div className="text-xs text-muted-foreground">امتیاز کل</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-completed">{profile.completedCourses}</div>
                        <div className="text-xs text-muted-foreground">دوره تکمیل</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-in-progress" />
                        <span>{profile.inProgressCourses} دوره در حال انجام</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-pending" />
                        <span>{profile.requiredCourses} دوره باقی‌مانده</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-achievement" />
                        دستاوردها
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>پیشرفت کلی</span>
                          <span>{profile.progress}%</span>
                        </div>
                        <Progress value={profile.progress} className="h-2" />
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">مسیر شغلی</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{profile.currentRole}</span>
                          <TrendingUp className="w-3 h-3" />
                          <span>{profile.targetRole}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">تاریخ پیوستن: </span>
                          <span>{profile.joinDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">آخرین فعالیت: </span>
                          <span>{profile.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < profile.level 
                            ? 'fill-achievement text-achievement' 
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    مشاهده کامل
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            پرونده‌ای یافت نشد
          </h3>
          <p className="text-sm text-muted-foreground">
            جستجوی خود را تغییر دهید
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainingProfiles;