import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Upload as UploadIcon,
  FileText,
  Users,
  BookOpen,
  Download,
  CheckCircle,
  Info,
} from 'lucide-react';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(
        file =>
          file.name.endsWith('.csv') ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel'
      );

      if (files.length > 0) {
        setUploadedFiles(prev => [...prev, ...files]);
        toast({
          title: 'فایل‌ها آپلود شدند',
          description: `${files.length} فایل با موفقیت اضافه شد`,
        });
      } else {
        toast({
          title: 'فرمت نامعتبر',
          description: 'لطفا فقط فایل‌های معتبر آپلود کنید',
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        file =>
          file.name.endsWith('.csv') ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel'
      );

      if (files.length > 0) {
        setUploadedFiles(prev => [...prev, ...files]);
        toast({
          title: 'فایل‌ها آپلود شدند',
          description: `${files.length} فایل با موفقیت اضافه شد`,
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const parseCSV = (text: string) => {
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(',');
    return lines.filter(l => l.trim()).map(line => {
      const values = line.split(',');
      const record: Record<string, string> = {};
      headers.forEach((h, i) => {
        record[h.trim()] = values[i]?.trim() ?? '';
      });
      return record;
    });
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: 'خطا',
        description: 'لطفا حداقل یک فایل آپلود کنید',
        variant: 'destructive',
      });
      return;
    }

    const existingCourses = JSON.parse(localStorage.getItem('coursesData') || '[]');
    const existingPersonnel = JSON.parse(localStorage.getItem('personnelData') || '[]');

    for (const file of uploadedFiles) {
      const text = await file.text();
      const records = parseCSV(text);
      if (records.length === 0) continue;
      const headers = Object.keys(records[0]);

      if (headers.includes('Job_Title_id')) {
        const mapped = records.map(r => ({
          jobTitleId: r['Job_Title_id'],
          jobTitle: r['Job_Title'],
          departmentName: r['Department_Name'],
          departmentId: r['Department_id'],
          requiredCourse: r['Required_Course'],
          requiredCourseId: r['Required_Course_id'],
        }));
        existingCourses.push(...mapped);
      } else if (headers.includes('کد پرسنلی')) {
        const mapped = records.map(r => ({
          personnelCode: r['کد پرسنلی'],
          status: r['وضعیت'],
          firstName: r['نام'],
          lastName: r['نام خانوادگی'],
          fullName: r['نام و نام خانوادگی'],
          jobGrade: r['رده پست'],
          section: r['بخش'],
          office: r['اداره'],
          assignmentManagement: r['مدیریت حکم کارگزینی'],
          organization: r['تعلق سازمانی'],
          assignmentOrganization: r['تعلق سازمانی حکم کارگزینی'],
        }));
        existingPersonnel.push(...mapped);
      }
    }

    localStorage.setItem('coursesData', JSON.stringify(existingCourses));
    localStorage.setItem('personnelData', JSON.stringify(existingPersonnel));

    toast({
      title: 'موفق',
      description: 'تمامی فایل‌ها با موفقیت پردازش شدند',
    });
    setUploadedFiles([]);
  };

  const downloadTemplate = (type: 'personnel' | 'courses') => {
    const fileName = type === 'personnel' ? 'personnel_template.csv' : 'courses_template.csv';
    const link = document.createElement('a');
    link.href = `/templates/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'دانلود تمپلیت',
      description: `تمپلیت ${type === 'personnel' ? 'پرسنل' : 'دوره‌ها'} دانلود شد`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-achievement to-secondary bg-clip-text text-transparent">
          آپلود فایل‌های آموزشی
        </h1>
        <p className="text-muted-foreground mt-2">
          آپلود اطلاعات پرسنل و دوره‌های آموزشی از طریق فایل‌های اکسل
        </p>
      </div>

      {/* Template Download Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="w-5 h-5" />
              تمپلیت پرسنل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              شامل ستون‌های: کد پرسنلی، وضعیت، عنوان دوره، رده سازمانی، مدت دوره و...
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">22 ستون</Badge>
              <Badge variant="outline">فرمت csv</Badge>
            </div>
            <Button onClick={() => downloadTemplate('personnel')} className="w-full bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 ml-2" />
              دانلود تمپلیت پرسنل
            </Button>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <BookOpen className="w-5 h-5" />
              تمپلیت دوره‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              شامل ستون‌های: شناسه سمت، عنوان سمت، نام واحد، شناسه واحد، دوره مورد نیاز
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">6 ستون</Badge>
              <Badge variant="outline">فرمت csv</Badge>
            </div>
            <Button onClick={() => downloadTemplate('courses')} className="w-full bg-secondary hover:bg-secondary/90">
              <Download className="w-4 h-4 ml-2" />
              دانلود تمپلیت دوره‌ها
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="w-5 h-5" />
            آپلود فایل‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">فایل‌های اکسل را اینجا بکشید یا کلیک کنید</h3>
            <p className="text-muted-foreground mb-4">فرمت‌های پشتیبانی شده: .csv, .xlsx, .xls</p>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <Button asChild>
              <label htmlFor="file-input" className="cursor-pointer">
                انتخاب فایل
              </label>
            </Button>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">فایل‌های آپلود شده:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <CheckCircle className="w-3 h-3 ml-1" />
                        آماده
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => removeFile(index)}>
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={processFiles} className="flex-1">
                  پردازش فایل‌ها
                </Button>
                <Button variant="outline" onClick={() => setUploadedFiles([])}>
                  حذف همه
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="border-info/20 bg-info/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-info mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium">نکات مهم:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• لطفا از تمپلیت‌های ارائه شده استفاده کنید</li>
                <li>• تمامی ستون‌های اجباری را پر کنید</li>
                <li>• تاریخ‌ها را به فرمت شمسی وارد کنید</li>
                <li>• حداکثر اندازه فایل: 10 مگابایت</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
