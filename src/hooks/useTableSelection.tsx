"use client";
import { useState, useEffect } from "react";

export function useTableSelection<T>(onSelectionChange?: (rows: T[]) => void) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Clear selection helper
  const clearSelection = () => {
    setRowSelection({});
    setSelectedRows([]);
  };

  // This effect helps maintain the selectedRows state based on rowSelection changes
  // We need it separate from the table rendering to avoid re-renders
  useEffect(() => {
    // Implementation for this would depend on how you access your table rows
    // This is just a stub - in your real implementation you would need to map
    // from rowSelection to the actual row data
    const selectedRowsData: T[] = []; // You'll need to implement this part

    // Call selection change callback if provided
    if (onSelectionChange) {
      onSelectionChange(selectedRowsData);
    }

    setSelectedRows(selectedRowsData);
  }, [rowSelection, onSelectionChange]);

  return {
    rowSelection,
    selectedRows,
    setRowSelection,
    clearSelection,
  };
}
