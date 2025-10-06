import React from "react";
import { useTheme } from "../../../hooks/useTheme";

interface PaginationControlsProps {
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalCount?: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pageSize,
  totalPages,
  onPageSizeChange,
  pageSizeOptions = [5, 25, 50, 100],
  setCurrentPage,
  currentPage,
  totalCount,
}) => {
  const start = totalCount ? (currentPage - 1) * pageSize + 1 : 0;
  const end = totalCount ? Math.min(currentPage * pageSize, totalCount) : 0;
  const { getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  return (
    <div className="flex items-center justify-between w-full mt-4 gap-4 flex-wrap">
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <span className="text-sm">
        {totalCount ? `Showing ${start}-${end} of ${totalCount}` : ""}
      </span>
      {/* Page Size Selector */}
      <div
        className={`flex items-center gap-2 ${themeStyles.container.backgroundColor}`}
      >
        <label
          htmlFor="pageSize"
          className={`text-sm font-medium ${themeStyles.text.color}`}
        >
          Rows per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(parseInt(e.target.value));
          }}
          className={`p-2 rounded border text-sm ${themeStyles.text.color}`}
          style={{
            backgroundColor: themeStyles.container.backgroundColor,
          }}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setCurrentPage(Math.max(1, currentPage - 1));
          }}
          disabled={currentPage === 1}
          className="w-24 py-1 border-2 border-neutral-borderGrey rounded disabled:text-neutral-textGrey"
        >
          Previous
        </button>

        <button
          onClick={() => {
            setCurrentPage(Math.min(totalPages, currentPage + 1));
          }}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-24 py-1 border-2 border-neutral-borderGrey rounded disabled:text-neutral-textGrey"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
