import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { postRankApi, PostRank } from "@/services/api/postRanks";

const PostRanksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery({
    queryKey: ["postRanks", searchQuery],
    queryFn: () => postRankApi.getAll({
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

  const postRanks = query.data?.items ?? [];
  const totalItems = query.data?.total ?? 0;

  const columns: Column<PostRank>[] = [
    { key: "code", title: "کد رده پست" },
    { key: "title", title: "عنوان رده پست" },
    { key: "note", title: "توضیحات" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لیست رده پست‌ها</h2>
        <div className="text-sm text-gray-600">
          تعداد کل: {totalItems} رده پست
        </div>
      </div>
      
      <FilterableDataTable
        rows={postRanks}
        columns={columns}
        searchKeys={["code", "title", "note"]}
        indexOffset={0}
        onSearchChange={(query) => {
          setSearchQuery(query);
        }}
        searchPlaceholder="جستجو در رده پست‌ها..."
      />
    </div>
  );
};

export default PostRanksPage;


