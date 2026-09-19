import React from "react";
import { cn } from "@/lib/utils";
import type { ProductTableColumnKey } from "./use-table-column-resize";

export interface ColumnResizeHandleProps {
  columnKey: ProductTableColumnKey;
  label: string;
  isResizing?: boolean;
  onStartResize: (
    columnKey: ProductTableColumnKey,
    event: React.MouseEvent,
  ) => void;
  onResetColumn?: (columnKey: ProductTableColumnKey) => void;
}

export function ColumnResizeHandle({
  columnKey,
  label,
  isResizing = false,
  onStartResize,
  onResetColumn,
}: ColumnResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      title={`Drag to resize ${label} (Double-click to reset)`}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onStartResize(columnKey, e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onResetColumn?.(columnKey);
      }}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-0 top-0 bottom-0 z-30 hidden md:flex items-center justify-center",
        "w-3.5 -mr-1.75 cursor-col-resize select-none touch-none group/resize",
      )}
    >
      <div
        className={cn(
          "w-0.5 h-4/6 rounded-full transition-all duration-150",
          isResizing
            ? "bg-primary w-1 shadow-xs"
            : "bg-transparent group-hover/resize:bg-primary group-hover/th:bg-border/90",
        )}
      />
    </div>
  );
}
