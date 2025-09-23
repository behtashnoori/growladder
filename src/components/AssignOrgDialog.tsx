import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { db, Personnel, PersonOrgHistory } from "@/db";
import { fetchOrgUnits } from "@/services/orgUnits";
import { useToast } from "@/components/ui/use-toast";
import { useDependentSelect } from "@/hooks/useDependentSelect";
import { postRankApi } from "@/services/api/postRanks";

interface Props {
  person: Personnel;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const AssignOrgDialog = ({ person, open, onOpenChange }: Props) => {
  console.log('AssignOrgDialog rendered for:', person.emp_code);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Queries
  const { data: posts = [] } = useQuery({ queryKey: ["posts"], queryFn: () => db.posts.toArray() });
  const { data: postRanksResponse } = useQuery({ 
    queryKey: ["postRanks"], 
    queryFn: () => postRankApi.getAll(),
    staleTime: 0,
    cacheTime: 0
  });
  const { data: sections = [] } = useQuery({ queryKey: ["sections"], queryFn: () => db.sections.toArray() });
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => db.departments.toArray() });
  const { data: managements = [] } = useQuery({ queryKey: ["managements"], queryFn: () => db.managements.toArray() });
  const { data: orgUnits = [] } = useQuery({ queryKey: ["orgUnits"], queryFn: () => fetchOrgUnits() });

  // Extract post ranks from response
  const postRanks = postRanksResponse?.items || [];
  console.log('Post ranks loaded:', postRanks.length, 'items');

  // Mapping state
  const [mapping, setMapping] = useState<{
    postSection: Record<string, string[]>;
    sectionDepartment: Record<string, string[]>;
    departmentManagement: Record<string, string[]>;
  }>({ postSection: {}, sectionDepartment: {}, departmentManagement: {} });

  useEffect(() => {
    fetch("/mapping.json")
      .then((r) => r.json())
      .then(setMapping)
      .catch(() =>
        setMapping({ postSection: {}, sectionDepartment: {}, departmentManagement: {} })
      );
  }, []);

  // Form states
  const [post, setPost] = useState(person.post_code ?? "");
  const [postRank, setPostRank] = useState(person.post_rank_code ?? "");
  const [section, setSection] = useState(person.section_code ?? "");
  const [department, setDepartment] = useState(person.department_code ?? "");
  const [management, setManagement] = useState(person.management_code ?? "");
  const [affiliation, setAffiliation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Dependent selects
  const sectionOptions = useDependentSelect(post, section, setSection, mapping.postSection);
  const departmentOptions = useDependentSelect(
    section,
    department,
    setDepartment,
    mapping.sectionDepartment
  );
  const managementOptions = useDependentSelect(
    department,
    management,
    setManagement,
    mapping.departmentManagement
  );

  const selectedDept = orgUnits.find((o) => o.id === department);
  const allowedPosts = selectedDept?.headRoleAllowed?.length
    ? posts.filter((p) => selectedDept.headRoleAllowed!.includes(p.code))
    : posts;

  useEffect(() => {
    if (post && !allowedPosts.some((p) => p.code === post)) {
      setPost("");
    }
  }, [post, allowedPosts]);

  const save = async () => {
    const now = Date.now();
    await db.transaction("rw", db.personnel, db.personOrgHistory, async () => {
      const historyOpen = await db.personOrgHistory
        .where({ emp_code: person.emp_code })
        .filter((h) => !h.to)
        .first();
      if (historyOpen && from) {
        await db.personOrgHistory.update(historyOpen.id!, { to: from });
      }
      const newRec: PersonOrgHistory = {
        emp_code: person.emp_code,
        post_code: post || undefined,
        post_title: posts.find((p) => p.code === post)?.title,
        post_rank_code: postRank || undefined,
        post_rank_title: postRanks.find((pr) => pr.code === postRank)?.title,
        section_code: section || undefined,
        section_title: sections.find((s) => s.code === section)?.title,
        department_code: department || undefined,
        department_title: departments.find((d) => d.code === department)?.title,
        management_code: management || undefined,
        management_title: managements.find((m) => m.code === management)?.title,
        affiliation: affiliation || undefined,
        from,
        to: to || undefined,
        createdAt: now,
        updatedAt: now,
      };
      await db.personOrgHistory.add(newRec);
      await db.personnel.put({
        ...person,
        post_code: post || undefined,
        post_title: posts.find((p) => p.code === post)?.title,
        post_rank_code: postRank || undefined,
        post_rank_title: postRanks.find((pr) => pr.code === postRank)?.title,
        section_code: section || undefined,
        section_title: sections.find((s) => s.code === section)?.title,
        department_code: department || undefined,
        department_title: departments.find((d) => d.code === department)?.title,
        management_code: management || undefined,
        management_title: managements.find((m) => m.code === management)?.title,
        updatedAt: now,
      });
    });
    queryClient.invalidateQueries({ queryKey: ["personnel"] });
    toast({ description: "ثبت شد" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تخصیص پرسنل - {person.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* ستون راست - جزئیات تخصیص */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📅
              </div>
              <h3 className="text-lg font-semibold text-gray-800">جزئیات تخصیص</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ شروع *</label>
                <Input 
                  type="date" 
                  value={from} 
                  onChange={(e) => setFrom(e.target.value)} 
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
                <Input 
                  type="date" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)} 
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وابستگی</label>
                <Input 
                  placeholder="مثال: رسمی، قراردادی، پیمانی" 
                  value={affiliation} 
                  onChange={(e) => setAffiliation(e.target.value)} 
                  className="w-full"
                  dir="rtl"
                />
              </div>

              {/* رده پست - زیر وابستگی */}
              <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
                <label className="block text-sm font-bold text-blue-800 mb-1">
                  رده پست *
                </label>
                <Select value={postRank} onValueChange={setPostRank}>
                  <SelectTrigger className="w-full border-blue-400" dir="rtl">
                    <SelectValue placeholder="انتخاب رده پست" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {postRanks.length > 0 ? (
                      postRanks.map((pr) => (
                        <SelectItem key={pr.code} value={pr.code}>
                          {`${pr.code} - ${pr.title}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        در حال بارگذاری...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {postRanks.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    هیچ رده پستی یافت نشد. لطفاً ابتدا رده پست‌ها را اضافه کنید.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ستون چپ - ساختار سازمانی */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                🏢
              </div>
              <h3 className="text-lg font-semibold text-gray-800">ساختار سازمانی</h3>
            </div>
            
            <div className="space-y-3">
              {/* پست سازمانی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">پست سازمانی</label>
                <Select value={post} onValueChange={setPost}>
                  <SelectTrigger className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب پست" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {allowedPosts.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {`${p.code} - ${p.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              {/* بخش */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بخش</label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب بخش" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {sections
                      .filter((s) => sectionOptions.includes(s.code))
                      .map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {`${s.code} - ${s.title}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اداره */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اداره</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full" dir="rtl">
                    <SelectValue placeholder="انتخاب اداره" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {departments
                      .filter((d) => departmentOptions.includes(d.code))
                      .map((d) => (
                        <SelectItem key={d.code} value={d.code}>
                          {`${d.code} - ${d.title}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* مدیریت */}
              {!selectedDept?.isIndependent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدیریت</label>
                  <Select value={management} onValueChange={setManagement}>
                    <SelectTrigger className="w-full" dir="rtl">
                      <SelectValue placeholder="انتخاب مدیریت" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {managements
                        .filter((m) => managementOptions.includes(m.code))
                        .map((m) => (
                          <SelectItem key={m.code} value={m.code}>
                            {`${m.code} - ${m.title}`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              لغو
            </Button>
            <Button 
              onClick={save} 
              disabled={!from}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ذخیره تخصیص
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignOrgDialog;