// Generalized function that accepts a type argument constrained to `object`
export const getColumnsForQuery = <T extends object>(
  type: T,
  excludeColumns: string[]
): string => {
  // Get all keys (column names) from the type dynamically
  const allColumns: string[] = Object.keys(type);

  // Filter out the columns that should be excluded
  const selectedColumns = allColumns.filter(
    (column) => !excludeColumns.includes(column)
  );

  // Return the column names as a comma-separated string
  return selectedColumns.join(", ");
};
