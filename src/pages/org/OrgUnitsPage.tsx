import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrgUnits } from "@/services/orgUnits";
import { OrgUnit } from "@/types/org-unit";
import FilterableDataTable, { Column } from "@/components/data/FilterableDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const OrgUnitsPage = () => {
  const [onlyInd, setOnlyInd] = useState(false);
  const { data: units = [] } = useQuery({
    queryKey: ["orgUnits", onlyInd],
    queryFn: () => fetchOrgUnits(onlyInd ? true : undefined),
  });

  const columns: Column<OrgUnit>[] = [
    { title: "نام", key: "name" },
    { title: "نوع", key: "unitType" },
    {
      title: "والد",
      render: (row) => units.find((u) => u.id === row.parentId)?.name ?? "",
    },
    {
      title: "",
      render: (row) => (row.isIndependent ? <Badge>مستقل</Badge> : null),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2" dir="rtl">
        <Checkbox checked={onlyInd} onCheckedChange={(c) => setOnlyInd(Boolean(c))} />
        <span>فقط مستقل‌ها</span>
      </div>
      <FilterableDataTable rows={units} columns={columns} searchKeys={["name"]} />
    </div>
  );
};

export default OrgUnitsPage;
