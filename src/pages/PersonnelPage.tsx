import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { listEmployees } from "@/services/api/employees";

interface Employee {
  id: string;
  fullName: string;
  rank?: string;
}

const PersonnelPage = () => {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["employees", q],
    queryFn: () => listEmployees({ q }),
  });
  const employees = data?.items ?? [];

  const columns: Column<Employee>[] = [
    { key: "id", title: "کد پرسنلی" },
    { key: "fullName", title: "نام" },
    { key: "rank", title: "رده" },
  ];

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="جستجو"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <FilterableDataTable
        rows={employees}
        columns={columns}
        searchKeys={["id", "fullName", "rank"]}
      />
    </div>
  );
};

export default PersonnelPage;
