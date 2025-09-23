import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { positionHistoryApi, PositionHistory, PositionHistoryCreate } from "@/services/api/positionHistory";
import { Calendar, Plus, Edit, Trash2, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PositionHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  emp_code: string;
  personnelName: string;
}

const PositionHistoryDialog = ({ open, onClose, emp_code, personnelName }: PositionHistoryDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PositionHistoryCreate>({
    emp_code,
    from_date: new Date().toISOString().split('T')[0],
    is_current: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["position-history", emp_code],
    queryFn: () => positionHistoryApi.getByPersonnel(emp_code),
    enabled: open && !!emp_code,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PositionHistoryCreate) => {
      // اگر پست فعلی وجود دارد و پست جدید فعلی است، پست قبلی را ببندیم
      if (data.is_current && history.length > 0) {
        const currentPosition = history.find(h => h.is_current);
        if (currentPosition) {
          await positionHistoryApi.update(currentPosition.id, {
            to_date: new Date().toISOString(),
            is_current: false
          });
        }
      }
      
      // ایجاد سابقه جدید
      return positionHistoryApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position-history", emp_code] });
      setShowAddForm(false);
      setFormData({
        emp_code,
        from_date: new Date().toISOString().split('T')[0],
        is_current: true,
      });
      toast({
        title: "✅ موفق",
        description: "سابقه پست جدید اضافه شد و پست قبلی بسته شد",
      });
    },
    onError: () => {
      toast({
        title: "❌ خطا",
        description: "خطا در اضافه کردن سابقه پست",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PositionHistoryCreate> }) =>
      positionHistoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position-history", emp_code] });
      setEditingId(null);
      toast({
        title: "✅ موفق",
        description: "سابقه پست به‌روزرسانی شد",
      });
    },
    onError: () => {
      toast({
        title: "❌ خطا",
        description: "خطا در به‌روزرسانی سابقه پست",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: positionHistoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position-history", emp_code] });
      toast({
        title: "✅ موفق",
        description: "سابقه پست حذف شد",
      });
    },
    onError: () => {
      toast({
        title: "❌ خطا",
        description: "خطا در حذف سابقه پست",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: PositionHistory) => {
    setEditingId(item.id);
    setFormData({
      emp_code: item.emp_code,
      post_code: item.post_code,
      post_title: item.post_title,
      post_rank_code: item.post_rank_code,
      post_rank_title: item.post_rank_title,
      section_code: item.section_code,
      section_title: item.section_title,
      department_code: item.department_code,
      department_title: item.department_title,
      management_code: item.management_code,
      management_title: item.management_title,
      affiliation: item.affiliation,
      from_date: item.from_date.split('T')[0],
      to_date: item.to_date ? item.to_date.split('T')[0] : undefined,
      is_current: item.is_current,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این سابقه پست اطمینان دارید؟")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            سابقه پست‌های {personnelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setFormData({
                  emp_code,
                  from_date: new Date().toISOString().split('T')[0],
                  is_current: true,
                });
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن سابقه پست
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? "ویرایش سابقه پست" : "افزودن سابقه پست جدید"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="post_title">عنوان پست</Label>
                      <Input
                        id="post_title"
                        value={formData.post_title || ""}
                        onChange={(e) => setFormData({ ...formData, post_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="post_rank_title">عنوان رتبه پست</Label>
                      <Input
                        id="post_rank_title"
                        value={formData.post_rank_title || ""}
                        onChange={(e) => setFormData({ ...formData, post_rank_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="section_title">عنوان بخش</Label>
                      <Input
                        id="section_title"
                        value={formData.section_title || ""}
                        onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department_title">عنوان اداره</Label>
                      <Input
                        id="department_title"
                        value={formData.department_title || ""}
                        onChange={(e) => setFormData({ ...formData, department_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="management_title">عنوان مدیریت</Label>
                      <Input
                        id="management_title"
                        value={formData.management_title || ""}
                        onChange={(e) => setFormData({ ...formData, management_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="affiliation">وابستگی</Label>
                      <Input
                        id="affiliation"
                        value={formData.affiliation || ""}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from_date">تاریخ شروع</Label>
                      <Input
                        id="from_date"
                        type="date"
                        value={formData.from_date}
                        onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="to_date">تاریخ پایان</Label>
                      <Input
                        id="to_date"
                        type="date"
                        value={formData.to_date || ""}
                        onChange={(e) => setFormData({ ...formData, to_date: e.target.value || undefined })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_current"
                      checked={formData.is_current}
                      onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    />
                    <Label htmlFor="is_current">پست فعلی</Label>
                  </div>
                  
                  {formData.is_current && history.length > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        ⚠️ با انتخاب "پست فعلی"، پست قبلی خودکار بسته می‌شود
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingId ? "به‌روزرسانی" : "افزودن"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                      }}
                    >
                      لغو
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4">در حال بارگذاری...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                سابقه پستی یافت نشد
              </div>
            ) : (
              history.map((item) => (
                <Card key={item.id} className={item.is_current ? "border-green-200 bg-green-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.post_title || "بدون عنوان"}</h3>
                          {item.is_current && (
                            <Badge variant="default" className="bg-green-600">
                              فعلی
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {item.post_rank_title && (
                            <div>رتبه: {item.post_rank_title}</div>
                          )}
                          {item.section_title && (
                            <div>بخش: {item.section_title}</div>
                          )}
                          {item.department_title && (
                            <div>اداره: {item.department_title}</div>
                          )}
                          {item.management_title && (
                            <div>مدیریت: {item.management_title}</div>
                          )}
                          {item.affiliation && (
                            <div>وابستگی: {item.affiliation}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            از: {formatDate(item.from_date)}
                          </div>
                          {item.to_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              تا: {formatDate(item.to_date)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PositionHistoryDialog;
