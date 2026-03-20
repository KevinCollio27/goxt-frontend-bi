"use client";

import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
}

const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];

function SkeletonRow({ columns, rowIndex }: { columns: number; rowIndex: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex} className="px-5 py-3.5">
          <div
            className={cn(
              "h-4 bg-gray-100 rounded-md animate-pulse",
              SKELETON_WIDTHS[(rowIndex + colIndex) % SKELETON_WIDTHS.length]
            )}
          />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos para mostrar.",
  keyExtractor,
  skeletonRows = 5,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} columns={columns.length} rowIndex={i} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-16 text-center text-sm text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-gray-50/70 transition-colors group",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-5 py-3.5 text-gray-700 align-middle", col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
