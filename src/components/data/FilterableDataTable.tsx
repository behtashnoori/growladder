import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { persianNormalize } from "@/lib/persianNormalize";

export interface Column<T> {
  title: string;
  key?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
}

interface FilterableDataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  rowProps?: (row: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  indexOffset?: number;
}

export function FilterableDataTable<T>({
  rows,
  columns,
  searchKeys,
  rowProps,
  indexOffset = 0,
}: FilterableDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    const q = persianNormalize(debounced);
    if (!q) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        if (typeof value !== "string") return false;
        return persianNormalize(value).includes(q);
      })
    );
  }, [debounced, rows, searchKeys]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="جستجو"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            {columns.map((c) => (
              <TableHead key={String(c.key ?? c.title)}>{c.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                داده‌ای یافت نشد
              </TableCell>
            </TableRow>
          )}
          {filtered.map((row, i) => (
            <TableRow key={i} {...(rowProps ? rowProps(row, i) : {})}>
              <TableCell>{i + 1 + indexOffset}</TableCell>
              {columns.map((c) => (
                <TableCell key={String(c.key ?? c.title)}>
                  {c.render
                    ? c.render(row, i)
                    : c.key
                    ? ((row[c.key] as React.ReactNode) ?? "")
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default FilterableDataTable;

