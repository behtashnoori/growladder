import { useQuery } from "@tanstack/react-query";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { listEmployees } from "@/services/api/employees";

interface Employee {
  id: string;
  fullName: string;
  rank?: string;
}

const PersonnelPage = () => {
  const query = useQuery({
    queryKey: ["employees"],
    queryFn: () => listEmployees({}),
    retry: 0,
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

  const employees = query.data?.items ?? [];

  const columns: Column<Employee>[] = [
    { key: "id", title: "کد پرسنلی" },
    { key: "fullName", title: "نام" },
    { key: "rank", title: "رده" },
  ];

  return (
    <div className="p-4 space-y-4">
      <FilterableDataTable
        rows={employees}
        columns={columns}
        searchKeys={["id", "fullName", "rank"]}
      />
    </div>
  );
};

export default PersonnelPage;
