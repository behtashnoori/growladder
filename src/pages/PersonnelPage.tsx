import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { personnelApi, Personnel } from "@/services/api/personnel";
import PersonnelAssignmentModal from "@/components/personnel/PersonnelAssignmentModal";
import { personnelAssignmentApi, PersonnelWithAssignment } from "@/services/api/personnelAssignment";
import { Users, Building } from "lucide-react";

const PersonnelPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelWithAssignment | null>(null);

  const query = useQuery({
    queryKey: ["personnel-with-assignment", searchQuery],
    queryFn: () => personnelAssignmentApi.getAllPersonnel(),
    retry: 1,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });

  if (query.isError) {
    return (
      <EmptyState
        title="داده‌ای یافت نشد"
        description="لطفاً بعداً دوباره تلاش کنید یا فیلترها را ریست کنید."
      >
        <Button onClick={() => query.refetch()}>تلاش مجدد</Button>
      </EmptyState>
    );
  }

  const personnel = query.data ?? [];
  const filteredPersonnel = personnel.filter(p => 
    !searchQuery || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.emp_code.includes(searchQuery)
  );

  const handleAssignPersonnel = (personnel: PersonnelWithAssignment) => {
    setSelectedPersonnel(personnel);
    setShowAssignmentModal(true);
  };

  const columns: Column<PersonnelWithAssignment>[] = [
    { key: "emp_code", title: "کد پرسنلی" },
    { key: "name", title: "نام" },
    { 
      key: "management_title", 
      title: "مدیریت",
      render: (row: PersonnelWithAssignment) => row.management_title || "-"
    },
    { 
      key: "department_title", 
      title: "اداره",
      render: (row: PersonnelWithAssignment) => row.department_title || "-"
    },
    { 
      key: "section_title", 
      title: "بخش",
      render: (row: PersonnelWithAssignment) => row.section_title || "-"
    },
    { 
      key: "post_title", 
      title: "پست",
      render: (row: PersonnelWithAssignment) => row.post_title || "-"
    },
    {
      key: "actions",
      title: "عملیات",
      render: (row: PersonnelWithAssignment) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAssignPersonnel(row)}
          className="flex items-center gap-2"
        >
          <Building className="h-4 w-4" />
          تخصیص
        </Button>
      )
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          لیست پرسنل
        </h2>
        <div className="text-sm text-gray-600">
          تعداد کل: {filteredPersonnel.length} نفر
        </div>
      </div>
      
      <FilterableDataTable
        rows={filteredPersonnel}
        columns={columns}
        searchKeys={["emp_code", "name", "management_title", "department_title", "section_title", "post_title"]}
        indexOffset={0}
        onSearchChange={(query) => {
          setSearchQuery(query);
        }}
        searchPlaceholder="جستجو در پرسنل..."
      />

      {/* Assignment Modal */}
      {showAssignmentModal && selectedPersonnel && (
        <PersonnelAssignmentModal
          personnel={selectedPersonnel}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedPersonnel(null);
          }}
          onSave={() => {
            query.refetch();
          }}
        />
      )}

    </div>
  );
};

export default PersonnelPage;
