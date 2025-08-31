import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PersonRecord {
  personnelCode: string;
  status: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jobGrade: string;
  section: string;
  office: string;
  assignmentManagement: string;
  organization: string;
  assignmentOrganization: string;
}

const Personnel = () => {
  const [personnel, setPersonnel] = useState<PersonRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('personnelData');
    if (stored) setPersonnel(JSON.parse(stored));
  }, []);

  const filtered = personnel.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            لیست پرسنل
          </h1>
          <p className="text-muted-foreground mt-2">اطلاعات پرسنلی آپلود شده</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="جستجوی نام، بخش یا اداره..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((person, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{person.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">کد پرسنلی: {person.personnelCode}</p>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>بخش: {person.section}</p>
              <p>اداره: {person.office}</p>
              <p>تعلق سازمانی: {person.organization}</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            پرسنلی یافت نشد یا هنوز آپلود نشده است
          </p>
        )}
      </div>
    </div>
  );
};

export default Personnel;
