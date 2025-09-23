import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { departmentApi, Department } from "@/services/api/departments";

const DepartmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery({
    queryKey: ["departments", searchQuery],
    queryFn: () => departmentApi.getAll({
      q: searchQuery || undefined,
    }),
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

  const departments = query.data?.items ?? [];
  const totalItems = query.data?.total ?? 0;

  const columns: Column<Department>[] = [
    { key: "code", title: "کد اداره" },
    { key: "title", title: "عنوان اداره" },
    { key: "note", title: "توضیحات" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لیست اداره‌ها</h2>
        <div className="text-sm text-gray-600">
          تعداد کل: {totalItems} اداره
        </div>
      </div>
      
      <FilterableDataTable
        rows={departments}
        columns={columns}
        searchKeys={["code", "title", "note"]}
        indexOffset={0}
        onSearchChange={(query) => {
          setSearchQuery(query);
        }}
        searchPlaceholder="جستجو در اداره‌ها..."
      />
    </div>
  );
};

export default DepartmentsPage;



