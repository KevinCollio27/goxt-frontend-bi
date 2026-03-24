"use client";

import { Fragment, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Column definition ────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;

  loading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;

  /** Número de filas por página. Si no se pasa, muestra todas. */
  pageSize?: number;

  /** Click en la fila (solo tabla plana — se ignora si renderExpanded está presente) */
  onRowClick?: (row: T) => void;

  /** Si se pasa, habilita filas expandibles. Recibe la fila y devuelve el contenido del panel */
  renderExpanded?: (row: T) => React.ReactNode;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className={cn("h-4 bg-gray-100 rounded-md animate-pulse", SKELETON_WIDTHS[i % SKELETON_WIDTHS.length])} />
        </td>
      ))}
    </tr>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "No hay datos para mostrar.",
  pageSize,
  onRowClick,
  renderExpanded,
}: DataTableProps<T>) {
  const [openRows, setOpenRows] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(0);

  const toggleRow = (key: string | number) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  const totalCols = renderExpanded ? columns.length + 1 : columns.length;

  // Paginación
  const paginated = pageSize ? data.slice(page * pageSize, (page + 1) * pageSize) : data;
  const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const showPagination = !!pageSize && data.length > pageSize;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* ── Header ── */}
          <thead>
            <tr className="border-b border-gray-200">
              {renderExpanded && <th className="w-8 px-3 py-3" />}
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

          {/* ── Body ── */}
          <tbody className="divide-y divide-gray-100">

            {/* Loading */}
            {loading && Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} columns={totalCols} />
            ))}

            {/* Empty */}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={totalCols} className="px-5 py-16 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading && paginated.map((row) => {
              const key = keyExtractor(row);
              const isOpen = openRows.has(key);

              return (
                <Fragment key={key}>
                  <tr
                    onClick={() => renderExpanded ? toggleRow(key) : onRowClick?.(row)}
                    className={cn(
                      "hover:bg-gray-50/70 transition-colors group",
                      (renderExpanded || onRowClick) && "cursor-pointer"
                    )}
                  >
                    {renderExpanded && (
                      <td className="w-8 pl-4 pr-1 py-3.5 align-middle">
                        <ChevronRight
                          size={14}
                          className={cn(
                            "text-gray-300 group-hover:text-gray-500 transition-all shrink-0",
                            isOpen && "rotate-90 text-gray-500"
                          )}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-5 py-3.5 text-gray-700 align-middle", col.className)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>

                  {renderExpanded && isOpen && (
                    <tr key={`${key}-expanded`} className="bg-gray-50/60">
                      <td />
                      <td colSpan={columns.length} className="px-5 py-4">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      {showPagination && (
        <div className="flex items-center justify-between px-5 pt-3 border-t border-gray-100 mt-1">
          <span className="text-xs text-gray-400">
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
