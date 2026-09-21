import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { notifyToast } from "@/lib/toast";

export type ProductTableColumnKey =
  | "sku"
  | "name"
  | "category"
  | "price"
  | "stock"
  | "status"
  | "updated"
  | "actions";

export const RESIZABLE_COLUMNS: ProductTableColumnKey[] = [
  "sku",
  "name",
  "category",
  "price",
  "stock",
  "status",
  "updated",
];

export const DEFAULT_COLUMN_WIDTHS: Record<ProductTableColumnKey, number> = {
  sku: 220,
  name: 300,
  category: 150,
  price: 120,
  stock: 100,
  status: 130,
  updated: 160,
  actions: 100,
};

export const RESET_COLUMNS_EVENT = "pms:reset-column-widths";

export function triggerResetColumnWidths() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(RESET_COLUMNS_EVENT));
  }
}

export const MIN_COLUMN_WIDTHS: Record<ProductTableColumnKey, number> = {
  sku: 160,
  name: 180,
  category: 110,
  price: 90,
  stock: 80,
  status: 100,
  updated: 120,
  actions: 90,
};

export const MAX_COLUMN_WIDTHS: Record<ProductTableColumnKey, number> = {
  sku: 450,
  name: 650,
  category: 280,
  price: 220,
  stock: 200,
  status: 240,
  updated: 280,
  actions: 160,
};

const STORAGE_KEY = "pms_product_table_column_widths";

function getStoredWidths(): Record<ProductTableColumnKey, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<
      Record<ProductTableColumnKey, number>
    >;
    if (typeof parsed === "object" && parsed !== null) {
      const keys: ProductTableColumnKey[] = [
        "sku",
        "name",
        "category",
        "price",
        "stock",
        "status",
        "updated",
        "actions",
      ];
      const hasAllKeys = keys.every(
        (k) =>
          typeof parsed[k] === "number" &&
          (parsed[k] as number) >= MIN_COLUMN_WIDTHS[k] &&
          (parsed[k] as number) <= MAX_COLUMN_WIDTHS[k],
      );
      if (hasAllKeys) {
        return {
          ...DEFAULT_COLUMN_WIDTHS,
          ...parsed,
        } as Record<ProductTableColumnKey, number>;
      }
    }
  } catch (err) {
    console.error("Failed to read column widths from localStorage:", err);
  }
  return null;
}

function setStoredWidths(widths: Record<ProductTableColumnKey, number> | null) {
  if (typeof window === "undefined") return;
  try {
    if (widths === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
    }
  } catch (err) {
    console.error("Failed to save column widths to localStorage:", err);
  }
}

function subscribeToMediaQuery(callback: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getMediaQuerySnapshot() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function getServerSnapshot() {
  return true;
}

export function useTableColumnResize(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [columnWidths, setColumnWidths] = useState<
    Record<ProductTableColumnKey, number>
  >(() => getStoredWidths() ?? DEFAULT_COLUMN_WIDTHS);

  const [resizingCol, setResizingCol] = useState<ProductTableColumnKey | null>(
    null,
  );

  const isMd = useSyncExternalStore(
    subscribeToMediaQuery,
    getMediaQuerySnapshot,
    getServerSnapshot,
  );

  const dragRef = useRef<{
    col: ProductTableColumnKey;
    startX: number;
    startWidth: number;
    currentWidths: Record<ProductTableColumnKey, number>;
  } | null>(null);

  const widthsRef = useRef(columnWidths);
  useEffect(() => {
    widthsRef.current = columnWidths;
  }, [columnWidths]);

  const handleStartResize = useCallback(
    (col: ProductTableColumnKey, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const current = widthsRef.current;
      dragRef.current = {
        col,
        startX: event.clientX,
        startWidth: current[col],
        currentWidths: { ...current },
      };

      setResizingCol(col);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [],
  );

  const handleResetColumn = useCallback((col: ProductTableColumnKey) => {
    setColumnWidths((prev) => {
      const next = {
        ...prev,
        [col]: DEFAULT_COLUMN_WIDTHS[col],
      };
      setStoredWidths(next);
      return next;
    });
    notifyToast("info", `Reset ${col.toUpperCase()} column width`);
  }, []);

  const handleResetAll = useCallback(() => {
    setColumnWidths(DEFAULT_COLUMN_WIDTHS);
    setStoredWidths(null);
    notifyToast("info", "All column widths reset to default");
  }, []);

  useEffect(() => {
    const handleGlobalReset = () => {
      handleResetAll();
    };
    window.addEventListener(RESET_COLUMNS_EVENT, handleGlobalReset);
    return () => {
      window.removeEventListener(RESET_COLUMNS_EVENT, handleGlobalReset);
    };
  }, [handleResetAll]);

  useEffect(() => {
    if (!resizingCol) return;

    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const { col, startX, startWidth, currentWidths } = drag;
      const deltaPx = e.clientX - startX;
      const min = MIN_COLUMN_WIDTHS[col];
      const max = MAX_COLUMN_WIDTHS[col];

      const newWidth = Math.min(
        Math.max(Math.round(startWidth + deltaPx), min),
        max,
      );

      if (currentWidths[col] === newWidth) return;

      const next = {
        ...currentWidths,
        [col]: newWidth,
      };

      drag.currentWidths = next;
      setColumnWidths(next);
    };

    const handleMouseUp = () => {
      if (dragRef.current) {
        setStoredWidths(dragRef.current.currentWidths);
      }
      dragRef.current = null;
      setResizingCol(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [resizingCol]);

  // Calculate total width of all visible columns on desktop
  const totalTableWidth = isMd
    ? Object.values(columnWidths).reduce((sum, w) => sum + w, 0)
    : undefined;

  const isCustomized = Object.keys(DEFAULT_COLUMN_WIDTHS).some(
    (key) =>
      columnWidths[key as ProductTableColumnKey] !==
      DEFAULT_COLUMN_WIDTHS[key as ProductTableColumnKey],
  );

  return {
    columnWidths,
    totalTableWidth,
    resizingCol,
    isCustomized,
    isMd,
    containerRef,
    handleStartResize,
    handleResetColumn,
    handleResetAll,
  };
}
