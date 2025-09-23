import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { managementApi, Management } from "@/services/api/managements";

const ManagementsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery({
    queryKey: ["managements", searchQuery],
    queryFn: () => managementApi.getAll({
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

  const managements = query.data?.items ?? [];
  const totalItems = query.data?.total ?? 0;

  const columns: Column<Management>[] = [
    { key: "code", title: "کد مدیریت" },
    { key: "title", title: "عنوان مدیریت" },
    { key: "note", title: "توضیحات" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لیست مدیریت‌ها</h2>
        <div className="text-sm text-gray-600">
          تعداد کل: {totalItems} مدیریت
        </div>
      </div>
      
      <FilterableDataTable
        rows={managements}
        columns={columns}
        searchKeys={["code", "title", "note"]}
        indexOffset={0}
        onSearchChange={(query) => {
          setSearchQuery(query);
        }}
        searchPlaceholder="جستجو در مدیریت‌ها..."
      />
    </div>
  );
};

export default ManagementsPage;



