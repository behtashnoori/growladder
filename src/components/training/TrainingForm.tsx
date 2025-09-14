import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import type { Training } from "@/types/training";
import { z } from "zod";

const trainingSchema = z.object({
  courseId: z.string().min(1, "کد دوره الزامی است"),
  attendancePercent: z
    .number({ invalid_type_error: "درصد حضور نامعتبر است" })
    .min(0, "حداقل ۰")
    .max(100, "حداکثر ۱۰۰"),
});

interface Props {
  onSubmit?: (t: Training) => void | Promise<void>;
}

const TrainingForm = ({ onSubmit }: Props) => {
  const { toast } = useToast();
  const [courseId, setCourseId] = useState("");
  const [attendancePercent, setAttendancePercent] = useState(0);
  const absencePercent = 100 - attendancePercent;
  const [errors, setErrors] = useState<{ courseId?: string; attendancePercent?: string }>({});

  const handleSubmit = async () => {
    const res = trainingSchema.safeParse({ courseId, attendancePercent });
    if (!res.success) {
      const f = res.error.flatten().fieldErrors;
      setErrors({
        courseId: f.courseId?.[0],
        attendancePercent: f.attendancePercent?.[0],
      });
      toast({ variant: "destructive", title: "خطا در ذخیره" });
      return;
    }
    setErrors({});
    const training: Training = { courseId, attendancePercent, absencePercent };
    await onSubmit?.(training);
    toast({ title: "با موفقیت ذخیره شد" });
  };

  return (
    <div className="space-y-4" dir="rtl">
      <Input
        placeholder="کد دوره"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      />
      {errors.courseId && (
        <p className="text-sm text-destructive">{errors.courseId}</p>
      )}
      <Input
        type="number"
        placeholder="درصد حضور"
        value={attendancePercent}
        onChange={(e) =>
          setAttendancePercent(Math.max(0, Math.min(100, Number(e.target.value))))
        }
      />
      {errors.attendancePercent && (
        <p className="text-sm text-destructive">{errors.attendancePercent}</p>
      )}
      <Progress value={attendancePercent} />
      <div className="text-sm text-muted-foreground">
        حضور: {attendancePercent}% | غیبت: {absencePercent}%
      </div>
      <Button onClick={handleSubmit}>ذخیره</Button>
    </div>
  );
};

export default TrainingForm;
