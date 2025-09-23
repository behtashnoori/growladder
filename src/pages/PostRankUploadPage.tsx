import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postRankApi } from "@/services/api/postRanks";
import { downloadTemplatePostRanks } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileSpreadsheet, FileText } from "lucide-react";

const PostRankUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: any[]) => {
      console.log('🚀 Sending data to API:', data);
      console.log('🚀 Data length:', data.length);
      console.log('🚀 Sample item:', data[0]);
      return postRankApi.bulkCreate(data);
    },
    onSuccess: (result) => {
      console.log('✅ Upload success:', result);
      toast({
        title: "✅ موفق",
        description: `${result.count} رده پست با موفقیت آپلود شد`,
      });
      queryClient.invalidateQueries({ queryKey: ["postRanks"] });
      setFile(null);
    },
    onError: (error: any) => {
      console.error('❌ Upload error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      toast({
        title: "❌ خطا",
        description: error.response?.data?.message || error.message || "خطا در آپلود فایل",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      console.log('🔍 Starting file upload process...');
      console.log('📁 File name:', file.name);
      console.log('📁 File size:', file.size);
      console.log('📁 File type:', file.type);
      
      const data = await parseFile(file);
      console.log('📊 Parsed data:', data);
      console.log('📊 Number of rows:', data.length);
      
      // Validate data structure
      const validatedData = data.map(item => ({
        code: item.code || item['کد'] || '',
        title: item.title || item['عنوان'] || '',
        note: item.note || item['توضیحات'] || ''
      })).filter(item => item.code && item.title);
      
      console.log('✅ Validated data:', validatedData);
      console.log('✅ Number of valid rows:', validatedData.length);
      
      if (validatedData.length === 0) {
        console.error('❌ No valid data found');
        toast({
          title: "خطا",
          description: "هیچ داده معتبری در فایل یافت نشد",
          variant: "destructive",
        });
        return;
      }
      
      console.log('🚀 Sending data to API...');
      uploadMutation.mutate(validatedData);
    } catch (error) {
      console.error('❌ Parse error:', error);
      console.error('❌ Error stack:', error.stack);
      toast({
        title: "خطا",
        description: `خطا در خواندن فایل: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return parseXLSXFile(file);
    } else {
      return parseCSVFile(file);
    }
  };

  const parseCSVFile = async (file: File): Promise<any[]> => {
    const text = await file.text();
    
    // Parse CSV properly handling quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    };
    
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line).map(v => v.replace(/"/g, '').trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    }).filter(row => {
      // Filter out empty rows
      return Object.values(row).some(value => value && value.toString().trim());
    });
  };

  const parseXLSXFile = async (file: File): Promise<any[]> => {
    // Import XLSX library dynamically
    const XLSX = await import('xlsx');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            resolve([]);
            return;
          }
          
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const result = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          }).filter(row => {
            // Filter out empty rows
            return Object.values(row).some(value => value && value.toString().trim());
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">آپلود رده پست‌ها</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Template Download */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              دانلود قالب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ابتدا قالب مناسب را دانلود کنید و آن را با داده‌های خود پر کنید
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => downloadTemplatePostRanks("xlsx")}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                XLSX
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadTemplatePostRanks("csv")}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              آپلود فایل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">انتخاب فایل</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>
            
            {file && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">فایل انتخاب شده:</p>
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? "در حال آپلود..." : "آپلود فایل"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>راهنمای آپلود</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• فایل باید شامل ستون‌های <code>code</code> و <code>title</code> باشد</p>
            <p>• ستون <code>note</code> اختیاری است</p>
            <p>• فرمت‌های پشتیبانی شده: <strong>CSV, XLSX, XLS</strong></p>
            <p>• کد رده پست باید یکتا باشد</p>
            <p>• برای فایل‌های XLSX، از اولین sheet استفاده می‌شود</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostRankUploadPage;
