import React from "react";
import {
  type TableColumn,
  type ExpandableRowConfig,
} from "../../../constants/types";
import PaginationControls from "./PaginationControls.tsx";
import TableSkeleton from "./TableSkeleton";

interface TableClassNames {
  table?: string;
  tableHeader?: string;
  tableHeaderCell?: string;
  tableBody?: string;
  tableRow?: string;
  tableCell?: string;
  pagination?: string;
  expendableRow?: string;
  expendableRowCell?: string;
}

type DataTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  searchQuery?: string;
  loading?: boolean; // Local loading state for table
  pagination?: {
    currentPage: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
  };
  totalCount?: number;
  onRowClick?: (row: T) => void;
  className?: TableClassNames;
  expandableRows?: ExpandableRowConfig<T>;
};

function DataTable<T>({
  columns,
  data,
  loading = false, // Local loading state
  pagination,
  onAction,
  totalCount,
  onRowClick,
  className = {
    table: "",
    tableHeader: "",
    tableHeaderCell: "",
    tableBody: "",
    tableRow: "",
    tableCell: "",
    pagination: "",
    expendableRow: "",
    expendableRowCell: "",
  },
  expandableRows,
}: DataTableProps<T> & { onAction?: (...args: any[]) => void }) {
  const currentPage = pagination?.currentPage || 1;
  const pageSize = pagination?.pageSize || 10;

  // Auto-detect server-side vs client-side pagination based on totalCount
  // If totalCount is provided and different from data.length, assume server-side pagination
  const isServerSidePaginated =
    totalCount !== undefined && totalCount !== data.length;
  const displayData = isServerSidePaginated
    ? data // Use data as-is for server-side pagination (backend already returns correct page)
    : data.slice((currentPage - 1) * pageSize, currentPage * pageSize); // Client-side pagination

  // Show skeleton loader when loading (bypasses global loader)
  if (loading) {
    return (
      <div className="w-full">
        <div className="relative border border-gray-200 shadow-sm rounded-lg p-4">
          <TableSkeleton
            rows={pageSize}
            columns={columns.length}
            showHeader={false}
            className="p-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative border border-gray-200 shadow-sm rounded-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className={className.table ?? "min-w-full whitespace-nowrap"}>
            <thead
              className={
                className.tableHeader ?? "bg-gray-100 sticky top-0 z-10"
              }
            >
              <tr>
                {columns?.map((col, idx) => (
                  <th
                    key={idx}
                    className={`${
                      className.tableHeaderCell ??
                      `text-left px-4 py-2 text-sm font-medium ${
                        col.align ?? "left"
                      }`
                    } ${col.headerClassName || ""}`}
                  >
                    {col.headerRender ? col.headerRender() : col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={className.tableBody ?? ""}>
              {displayData?.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8">
                    No data found.
                  </td>
                </tr>
              ) : (
                displayData?.map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    <tr
                      className={`${
                        className.tableRow ?? "border-t hover:bg-gray-50"
                      } ${onRowClick ? "cursor-pointer" : ""}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {columns?.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={`${
                            className.tableCell ?? "px-4 py-2 text-sm"
                          } ${col.headerClassName || ""}`}
                        >
                          {col.render
                            ? col.render(
                                (row as any)[col.key],
                                row,
                                rowIdx,
                                onAction
                              )
                            : (row as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                    {/* Render expanded row if expandableRows is configured and row is expanded */}
                    {expandableRows && expandableRows.isExpanded(row) && (
                      <tr className={className.expendableRow}>
                        <td
                          colSpan={columns.length}
                          className={className.expendableRowCell}
                        >
                          {expandableRows.expandedRowRenderer(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <div
          className={`${
            className.pagination ?? ""
          } flex flex-col sm:flex-row justify-between items-center mt-4 gap-4`}
        >
          <PaginationControls
            pageSize={pageSize}
            totalPages={Math.max(
              1,
              Math.ceil(
                (typeof totalCount === "number" ? totalCount : data.length) /
                  pageSize
              )
            )}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.setPageSize}
            setCurrentPage={pagination.onPageChange}
            currentPage={currentPage}
            totalCount={totalCount}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
