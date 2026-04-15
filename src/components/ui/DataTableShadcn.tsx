"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableShadcnProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  filterPlaceholder?: string;
  pageSize?: number;
}

// ─── DataTableShadcn (TanStack Table + ShadCN primitivos) ─────────────────────

export function DataTableShadcn<T>({
  columns,
  data,
  filterPlaceholder = "Filtrar...",
  pageSize = 10,
}: DataTableShadcnProps<T>) {
  const [sorting, setSorting]                   = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter]         = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection]         = useState({});
  const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
  const [showColumnMenu, setShowColumnMenu]     = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, rowSelection, columnFilters },
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount    = table.getFilteredRowModel().rows.length;

  return (
    <div className="w-full">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={filterPlaceholder}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal placeholder:text-gray-400 w-52"
        />

        {/* Column visibility toggle */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowColumnMenu((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Columnas <ChevronDown size={13} />
          </button>
          {showColumnMenu && (
            <>
              {/* backdrop para cerrar */}
              <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-40 py-1">
                {table.getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={(e) => col.toggleVisibility(e.target.checked)}
                        className="accent-teal"
                      />
                      {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
                    </label>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tabla ───────────────────────────────────────────────────────────── */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={cn(header.column.getCanSort() && "cursor-pointer select-none")}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className={header.column.getIsSorted() ? "text-gray-700" : "text-gray-700"}>
                          {header.column.getIsSorted() === "asc"  ? <ChevronUp size={14} /> :
                           header.column.getIsSorted() === "desc" ? <ChevronDown size={14} /> :
                           <ChevronsUpDown size={14} />}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-16 text-center text-sm text-gray-400">
                No hay datos para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {selectedCount} de {totalCount} fila{totalCount !== 1 ? "s" : ""} seleccionada{selectedCount !== 1 ? "s" : ""}.
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex items-center gap-1 px-3 h-7 rounded-md border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} /> Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex items-center gap-1 px-3 h-7 rounded-md border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Siguiente <ChevronRight size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}
