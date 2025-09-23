import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { courseApi, Course } from "@/services/api/courses";
import { create as createTraining } from "@/services/api/trainings";

interface Props {
  emp_code: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved?: () => void;
}

const AddCourseDialog = ({ emp_code, open, onOpenChange, onSaved }: Props) => {
  const { toast } = useToast();
  const { data } = useQuery({ queryKey: ["courses"], queryFn: () => courseApi.getAll() });
  const courses = (data?.items as Course[]) ?? [];
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTraining,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trainings"] }),
  });
  const [course, setCourse] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [hours, setHours] = useState("");
  const [attendance, setAttendance] = useState("0");

  const save = async () => {
    const att = Number(attendance);
    if (isNaN(att) || att < 0 || att > 100) {
      toast({ variant: "destructive", title: "خطا در ذخیره" });
      return;
    }
    try {
      await mutation.mutateAsync({
        id: crypto.randomUUID(),
        employeeId: emp_code,
        courseId: course,
        attendancePercent: att,
        date: from || undefined,
      });
      toast({ title: "با موفقیت ذخیره شد" });
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast({ variant: "destructive", title: "خطا در ذخیره" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>افزودن دوره گذرانده</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger dir="rtl"><SelectValue placeholder="دوره" /></SelectTrigger>
            <SelectContent dir="rtl">
              {courses.map((c) => (
                <SelectItem key={c.courseId} value={c.courseId}>{`${c.courseId} - ${c.title}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2" dir="rtl">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Input
            type="number"
            placeholder="ساعت"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            dir="rtl"
          />
          <Input
            type="number"
            placeholder="درصد حضور"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            dir="rtl"
          />
          <Progress value={Number(attendance)} />
          <div className="text-sm text-muted-foreground" dir="rtl">
            حضور: {attendance}% | غیبت: {100 - Number(attendance)}%
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={!course}>ذخیره</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
