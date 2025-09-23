import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Building, Folder, Users, Briefcase, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { personnelAssignmentApi, PersonnelWithAssignment, OrgUnit, Post, AssignPersonnelRequest } from '@/services/api/personnelAssignment';
import { postRankApi } from '@/services/api/postRanks';
import { positionHistoryApi } from '@/services/api/positionHistory';

interface PersonnelAssignmentModalProps {
  personnel: PersonnelWithAssignment;
  onClose: () => void;
  onSave: () => void;
}

const PersonnelAssignmentModal = ({
  personnel,
  onClose,
  onSave
}: PersonnelAssignmentModalProps) => {
  const [organizationalStructure, setOrganizationalStructure] = useState<{
    managements: OrgUnit[];
    departments: OrgUnit[];
    sections: OrgUnit[];
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postRanks, setPostRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // تشخیص نوع تخصیص
  const isInitialAssignment = personnel.orgHistory.length === 0;
  
  // Form state
  const [selectedManagement, setSelectedManagement] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [selectedPostRank, setSelectedPostRank] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [affiliation, setAffiliation] = useState<string>('');
  
  // Available options based on selections
  const [availableDepartments, setAvailableDepartments] = useState<OrgUnit[]>([]);
  const [availableSections, setAvailableSections] = useState<OrgUnit[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [structure, postsData, postRanksData] = await Promise.all([
          personnelAssignmentApi.getOrganizationalStructure(),
          personnelAssignmentApi.getAllPosts(),
          postRankApi.getAll()
        ]);
        
        setOrganizationalStructure(structure);
        setPosts(postsData);
        setPostRanks(postRanksData.items || []);
        
        // Set current assignment if exists
        const currentAssignment = personnel.orgHistory[0];
        if (currentAssignment) {
          setSelectedManagement(currentAssignment.management_code || '');
          setSelectedDepartment(currentAssignment.department_code || '');
          setSelectedSection(currentAssignment.section_code || '');
          setSelectedPost(currentAssignment.post_code || '');
          setSelectedPostRank(currentAssignment.post_rank_code || '');
          setFromDate(currentAssignment.from_date.split('T')[0]);
          setToDate(currentAssignment.to_date ? currentAssignment.to_date.split('T')[0] : '');
          setAffiliation(currentAssignment.affiliation || '');
        } else {
          // تخصیص اولیه: تاریخ شروع = تاریخ امروز، تاریخ پایان = خالی
          setFromDate(new Date().toISOString().split('T')[0]);
          setToDate('');
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "❌ خطا در بارگذاری داده‌ها",
          description: "خطایی در بارگذاری ساختار سازمانی رخ داد",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [personnel, toast]);

  // Load departments when management changes
  useEffect(() => {
    const loadDepartments = async () => {
      if (selectedManagement) {
        try {
          const departments = await personnelAssignmentApi.getDepartmentsForManagement(selectedManagement);
          setAvailableDepartments(departments);
          setSelectedDepartment(''); // Reset department selection
          setSelectedSection(''); // Reset section selection
        } catch (error) {
          console.error('Error loading departments:', error);
        }
      } else {
        setAvailableDepartments([]);
        setSelectedDepartment('');
        setSelectedSection('');
      }
    };

    loadDepartments();
  }, [selectedManagement]);

  // Load sections when department changes
  useEffect(() => {
    const loadSections = async () => {
      if (selectedDepartment) {
        try {
          const sections = await personnelAssignmentApi.getSectionsForDepartment(selectedDepartment);
          setAvailableSections(sections);
          setSelectedSection(''); // Reset section selection
        } catch (error) {
          console.error('Error loading sections:', error);
        }
      } else {
        setAvailableSections([]);
        setSelectedSection('');
      }
    };

    loadSections();
  }, [selectedDepartment]);

  const handleSave = async () => {
    if (!fromDate) {
      toast({
        title: "❌ خطا",
        description: "تاریخ شروع الزامی است",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Get the selected organizational unit details
      const selectedManagementData = organizationalStructure?.managements.find(m => m.id === selectedManagement);
      const selectedDepartmentData = availableDepartments.find(d => d.id === selectedDepartment);
      const selectedSectionData = availableSections.find(s => s.id === selectedSection);
      const selectedPostData = posts.find(p => p.code === selectedPost);
      const selectedPostRankData = postRanks.find(pr => pr.code === selectedPostRank);

      if (isInitialAssignment) {
        // تخصیص اولیه: فقط یک سابقه جدید ایجاد می‌کنیم
        const positionHistoryData = {
          emp_code: personnel.emp_code,
          post_code: selectedPost,
          post_title: selectedPostData?.title,
          post_rank_code: selectedPostRank,
          post_rank_title: selectedPostRankData?.title,
          section_code: selectedSection,
          section_title: selectedSectionData?.name,
          department_code: selectedDepartment,
          department_title: selectedDepartmentData?.name,
          management_code: selectedManagement,
          management_title: selectedManagementData?.name,
          affiliation: affiliation || undefined,
          from_date: fromDate,
          to_date: toDate || undefined,
          is_current: !toDate, // If no end date, it's current position
        };

        await positionHistoryApi.create(positionHistoryData);
        
        toast({
          title: "✅ تخصیص اولیه انجام شد",
          description: `پرسنل ${personnel.name} برای اولین بار تخصیص داده شد`,
        });
      } else {
        // تغییر پست: پست قبلی را ببندیم و پست جدید را باز کنیم
        const currentPosition = personnel.orgHistory[0];
        
        // بستن پست فعلی
        if (currentPosition) {
          await positionHistoryApi.update(currentPosition.id, {
            to_date: new Date().toISOString(),
            is_current: false
          });
        }
        
        // باز کردن پست جدید
        const newPositionData = {
          emp_code: personnel.emp_code,
          post_code: selectedPost,
          post_title: selectedPostData?.title,
          post_rank_code: selectedPostRank,
          post_rank_title: selectedPostRankData?.title,
          section_code: selectedSection,
          section_title: selectedSectionData?.name,
          department_code: selectedDepartment,
          department_title: selectedDepartmentData?.name,
          management_code: selectedManagement,
          management_title: selectedManagementData?.name,
          affiliation: affiliation || undefined,
          from_date: new Date().toISOString(), // تاریخ شروع = امروز
          to_date: undefined,
          is_current: true
        };

        await positionHistoryApi.create(newPositionData);
        
        toast({
          title: "✅ تغییر پست انجام شد",
          description: `پرسنل ${personnel.name} به پست جدید منتقل شد`,
        });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error assigning personnel:', error);
      toast({
        title: "❌ خطا در تخصیص",
        description: "خطایی در تخصیص پرسنل رخ داد",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isInitialAssignment ? "تخصیص اولیه پرسنل" : "تغییر پست پرسنل"}
              </h2>
              <p className="text-sm text-gray-600">
                {personnel.name} - کد پرسنلی: {personnel.emp_code}
              </p>
              {isInitialAssignment ? (
                <p className="text-xs text-blue-600 mt-1">
                  این اولین تخصیص پرسنل است
                </p>
              ) : (
                <p className="text-xs text-orange-600 mt-1">
                  پست فعلی بسته شده و پست جدید باز می‌شود
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organizational Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  ساختار سازمانی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Management */}
                <div>
                  <Label htmlFor="management">مدیریت</Label>
                  <select
                    id="management"
                    value={selectedManagement}
                    onChange={(e) => setSelectedManagement(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">انتخاب مدیریت</option>
                    {organizationalStructure?.managements.map((management) => (
                      <option key={management.id} value={management.id}>
                        {management.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <Label htmlFor="department">اداره</Label>
                  <select
                    id="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    disabled={!selectedManagement}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب اداره</option>
                    {availableDepartments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <Label htmlFor="section">بخش</Label>
                  <select
                    id="section"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={!selectedDepartment}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب بخش</option>
                    {availableSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Post */}
                <div>
                  <Label htmlFor="post">پست سازمانی</Label>
                  <select
                    id="post"
                    value={selectedPost}
                    onChange={(e) => setSelectedPost(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">انتخاب پست</option>
                    {(posts || []).map((post) => (
                      <option key={post.code} value={post.code}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Post Rank - با تأکید ویژه */}
                <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
                  <Label htmlFor="postRank" className="text-blue-800 font-bold">رده پست *</Label>
                  <select
                    id="postRank"
                    value={selectedPostRank}
                    onChange={(e) => setSelectedPostRank(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-blue-400 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <option value="">انتخاب رده پست</option>
                    {postRanks.map((postRank) => (
                      <option key={postRank.code} value={postRank.code}>
                        {postRank.code} - {postRank.title}
                      </option>
                    ))}
                  </select>
                  {postRanks.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      هیچ رده پستی یافت نشد. لطفاً ابتدا رده پست‌ها را اضافه کنید.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  جزئیات تخصیص
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* From Date */}
                <div>
                  <Label htmlFor="fromDate">
                    {isInitialAssignment ? "تاریخ شروع پست *" : "تاریخ شروع پست جدید *"}
                  </Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                    disabled={!isInitialAssignment} // در تغییر پست، تاریخ ثابت است
                  />
                  {!isInitialAssignment && (
                    <p className="text-xs text-gray-500 mt-1">
                      تاریخ شروع خودکار به امروز تنظیم می‌شود
                    </p>
                  )}
                </div>

                {/* To Date */}
                <div>
                  <Label htmlFor="toDate">
                    {isInitialAssignment ? "تاریخ پایان پست" : "تاریخ پایان پست قبلی"}
                  </Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={!isInitialAssignment} // در تغییر پست، تاریخ پایان ثابت است
                  />
                  {!isInitialAssignment && (
                    <p className="text-xs text-gray-500 mt-1">
                      تاریخ پایان پست قبلی خودکار به امروز تنظیم می‌شود
                    </p>
                  )}
                </div>

                {/* Affiliation */}
                <div>
                  <Label htmlFor="affiliation">وابستگی</Label>
                  <Input
                    id="affiliation"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="مثال: رسمی، قراردادی، پیمانی"
                  />
                </div>

                {/* Current Assignment Info */}
                {personnel.orgHistory.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">تخصیص فعلی:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {personnel.orgHistory[0].management_title && (
                        <div>مدیریت: {personnel.orgHistory[0].management_title}</div>
                      )}
                      {personnel.orgHistory[0].department_title && (
                        <div>اداره: {personnel.orgHistory[0].department_title}</div>
                      )}
                      {personnel.orgHistory[0].section_title && (
                        <div>بخش: {personnel.orgHistory[0].section_title}</div>
                      )}
                      {personnel.orgHistory[0].post_title && (
                        <div>پست: {personnel.orgHistory[0].post_title}</div>
                      )}
                      {personnel.orgHistory[0].post_rank_title && (
                        <div>رده پست: {personnel.orgHistory[0].post_rank_title}</div>
                      )}
                      <div>از: {new Date(personnel.orgHistory[0].from_date).toLocaleDateString('fa-IR')}</div>
                      {personnel.orgHistory[0].to_date && (
                        <div>تا: {new Date(personnel.orgHistory[0].to_date).toLocaleDateString('fa-IR')}</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            تخصیص پرسنل به ساختار سازمانی
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isInitialAssignment ? "تخصیص اولیه" : "تغییر پست"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelAssignmentModal;
