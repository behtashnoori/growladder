import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getRanks, importRanks, type Rank } from "@/services/ranks";

const ImportRanks = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ranks, setRanks] = useState<Rank[]>([]);

  useEffect(() => {
    getRanks().then(setRanks);
  }, []);

  const upload = async () => {
    try {
      const list = file ? await importRanks(file) : await getRanks();
      setRanks(list);
      toast({ title: "با موفقیت ذخیره شد" });
    } catch {
      toast({ variant: "destructive", title: "خطا در ذخیره" });
    }
  };

  return (
    <div className="p-4 space-y-4" dir="rtl">
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={upload}>بارگذاری</Button>
      <ul className="list-disc pr-5">
        {ranks.map((r) => (
          <li key={r.code}>{r.code} - {r.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ImportRanks;
