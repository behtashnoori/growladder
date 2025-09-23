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

const AssignOrgDialogNew = ({ person, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: posts = [] } = useQuery({ queryKey: ["posts"], queryFn: () => db.posts.toArray() });
  const { data: postRanks = { items: [] } } = useQuery({ queryKey: ["postRanks"], queryFn: () => postRankApi.getAll() });
  const { data: sections = [] } = useQuery({ queryKey: ["sections"], queryFn: () => db.sections.toArray() });
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => db.departments.toArray() });
  const { data: managements = [] } = useQuery({ queryKey: ["managements"], queryFn: () => db.managements.toArray() });
  const { data: orgUnits = [] } = useQuery({ queryKey: ["orgUnits"], queryFn: () => fetchOrgUnits() });

  const [post, setPost] = useState(person.post_code ?? "");
  const [postRank, setPostRank] = useState(person.post_rank_code ?? "");
  const [section, setSection] = useState(person.section_code ?? "");
  const [department, setDepartment] = useState(person.department_code ?? "");
  const [management, setManagement] = useState(person.management_code ?? "");
  const [affiliation, setAffiliation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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
        post_rank_title: postRanks.items?.find((pr) => pr.code === postRank)?.title,
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
        post_rank_title: postRanks.items?.find((pr) => pr.code === postRank)?.title,
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعیین جایگاه سازمانی - نسخه جدید</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* ستون اول - جزئیات تخصیص */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">جزئیات تخصیص</h3>
            <Input placeholder="تعلق سازمانی" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} dir="rtl" />
            <div className="flex gap-2" dir="rtl">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="تاریخ شروع" />
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} placeholder="تاریخ پایان" />
            </div>
          </div>

          {/* ستون دوم - ساختار سازمانی */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">ساختار سازمانی</h3>
            <Select value={post} onValueChange={setPost}>
              <SelectTrigger dir="rtl"><SelectValue placeholder="پست سازمانی" /></SelectTrigger>
              <SelectContent dir="rtl">
                {posts.map((p) => (
                  <SelectItem key={p.code} value={p.code}>{`${p.code} - ${p.title}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* فیلد رده پست - با debug */}
            <div className="border-2 border-red-500 p-2">
              <label className="text-sm font-medium text-red-600">رده پست (تست)</label>
              <Select value={postRank} onValueChange={setPostRank}>
                <SelectTrigger dir="rtl"><SelectValue placeholder="رده پست" /></SelectTrigger>
                <SelectContent dir="rtl">
                  {console.log('Post ranks data:', postRanks)}
                  {postRanks.items?.length > 0 ? (
                    postRanks.items.map((pr) => (
                      <SelectItem key={pr.code} value={pr.code}>{`${pr.code} - ${pr.title}`}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data">هیچ رده پستی یافت نشد</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger dir="rtl"><SelectValue placeholder="بخش" /></SelectTrigger>
              <SelectContent dir="rtl">
                {sections.map((s) => (
                  <SelectItem key={s.code} value={s.code}>{`${s.code} - ${s.title}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger dir="rtl"><SelectValue placeholder="اداره" /></SelectTrigger>
              <SelectContent dir="rtl">
                {departments.map((d) => (
                  <SelectItem key={d.code} value={d.code}>{`${d.code} - ${d.title}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={management} onValueChange={setManagement}>
              <SelectTrigger dir="rtl"><SelectValue placeholder="مدیریت" /></SelectTrigger>
              <SelectContent dir="rtl">
                {managements.map((m) => (
                  <SelectItem key={m.code} value={m.code}>{`${m.code} - ${m.title}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={!from}>ذخیره</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignOrgDialogNew;


