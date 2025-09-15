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

interface Props {
  person: Personnel;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const AssignOrgDialog = ({ person, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: posts = [] } = useQuery({ queryKey: ["posts"], queryFn: () => db.posts.toArray() });
  const { data: sections = [] } = useQuery({ queryKey: ["sections"], queryFn: () => db.sections.toArray() });
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => db.departments.toArray() });
  const { data: managements = [] } = useQuery({ queryKey: ["managements"], queryFn: () => db.managements.toArray() });
  const { data: orgUnits = [] } = useQuery({ queryKey: ["orgUnits"], queryFn: () => fetchOrgUnits() });
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

  const [post, setPost] = useState(person.post_code ?? "");
  const [section, setSection] = useState(person.section_code ?? "");
  const [department, setDepartment] = useState(person.department_code ?? "");
  const [management, setManagement] = useState(person.management_code ?? "");
  const [affiliation, setAffiliation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تعیین جایگاه سازمانی</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Select value={post} onValueChange={setPost}>
            <SelectTrigger dir="rtl"><SelectValue placeholder="پست" /></SelectTrigger>
            <SelectContent dir="rtl">
              {allowedPosts.map((p) => (
                <SelectItem key={p.code} value={p.code}>{`${p.code} - ${p.title}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger dir="rtl"><SelectValue placeholder="بخش" /></SelectTrigger>
            <SelectContent dir="rtl">
              {sections
                .filter((s) => sectionOptions.includes(s.code))
                .map((s) => (
                  <SelectItem key={s.code} value={s.code}>{`${s.code} - ${s.title}`}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger dir="rtl"><SelectValue placeholder="اداره" /></SelectTrigger>
            <SelectContent dir="rtl">
              {departments
                .filter((d) => departmentOptions.includes(d.code))
                .map((d) => (
                  <SelectItem key={d.code} value={d.code}>{`${d.code} - ${d.title}`}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!selectedDept?.isIndependent && (
            <Select value={management} onValueChange={setManagement}>
              <SelectTrigger dir="rtl"><SelectValue placeholder="مدیریت" /></SelectTrigger>
              <SelectContent dir="rtl">
                {managements
                  .filter((m) => managementOptions.includes(m.code))
                  .map((m) => (
                    <SelectItem key={m.code} value={m.code}>{`${m.code} - ${m.title}`}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          <Input placeholder="تعلق سازمانی" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} dir="rtl" />
          <div className="flex gap-2" dir="rtl">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={!from}>ذخیره</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignOrgDialog;
