import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDependentSelect } from "@/hooks/useDependentSelect";
import { getRanks, type Rank } from "@/services/ranks";
import { employeeSchema, type EmployeeFormValues } from "@/validators/employee";

const EditEmployee = () => {
  const { toast } = useToast();

  const [form, setForm] = useState<EmployeeFormValues>({
    id: "",
    name: "",
    position: "",
    department: "",
    section: "",
    rank: "",
    positionStartDate: "",
    hireDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({});
  const [mapping, setMapping] = useState<Record<string, string[]>>({});
  const [ranks, setRanks] = useState<Rank[]>([]);

  useEffect(() => {
    fetch("/mapping.json")
      .then((r) => r.json())
      .then(setMapping)
      .catch(() => setMapping({}));
    getRanks().then(setRanks);
  }, []);

  const deptOptions = useDependentSelect(
    form.position,
    form.department,
    (v) => setForm({ ...form, department: v }),
    mapping
  );

  useEffect(() => {
    if (form.rank === "مدیر") {
      setForm((f) => ({ ...f, department: "", section: "" }));
    } else if (form.rank === "رئیس") {
      setForm((f) => ({ ...f, section: "" }));
    }
  }, [form.rank]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    const result = employeeSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      toast({ variant: "destructive", title: "خطا در ذخیره" });
      return;
    }
    setErrors({});
    toast({ title: "با موفقیت ذخیره شد" });
  };

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <Input
        name="id"
        placeholder="کد پرسنلی"
        value={form.id}
        onChange={onChange}
      />
      {errors.id && <p className="text-sm text-destructive">{errors.id}</p>}
      <Input
        name="name"
        placeholder="نام"
        value={form.name}
        onChange={onChange}
      />
      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
        <SelectTrigger dir="rtl"><SelectValue placeholder="پست" /></SelectTrigger>
        <SelectContent dir="rtl">
          {Object.keys(mapping).map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.position && (
        <p className="text-sm text-destructive">{errors.position}</p>
      )}
      {form.rank !== "مدیر" && (
        <>
          <Select
            value={form.department}
            onValueChange={(v) => setForm({ ...form, department: v })}
          >
            <SelectTrigger dir="rtl"><SelectValue placeholder="اداره" /></SelectTrigger>
            <SelectContent dir="rtl">
              {deptOptions.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-destructive">{errors.department}</p>
          )}
        </>
      )}
      {form.rank !== "مدیر" && form.rank !== "رئیس" && (
        <>
          <Input
            name="section"
            placeholder="بخش"
            value={form.section}
            onChange={onChange}
          />
          {errors.section && (
            <p className="text-sm text-destructive">{errors.section}</p>
          )}
        </>
      )}
      <Select value={form.rank} onValueChange={(v) => setForm({ ...form, rank: v })}>
        <SelectTrigger dir="rtl"><SelectValue placeholder="رده پست" /></SelectTrigger>
        <SelectContent dir="rtl">
          {ranks.map((r) => (
            <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.rank && <p className="text-sm text-destructive">{errors.rank}</p>}
      <Input
        type="date"
        name="positionStartDate"
        value={form.positionStartDate}
        onChange={onChange}
      />
      {errors.positionStartDate && (
        <p className="text-sm text-destructive">{errors.positionStartDate}</p>
      )}
      <Input
        type="date"
        name="hireDate"
        value={form.hireDate}
        onChange={onChange}
      />
      {errors.hireDate && (
        <p className="text-sm text-destructive">{errors.hireDate}</p>
      )}
      <Button onClick={onSave}>ذخیره</Button>
    </div>
  );
};

export default EditEmployee;
