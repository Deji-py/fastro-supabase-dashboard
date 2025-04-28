"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  TextInput,
  Group,
  Text,
  Stack,
  Modal,
  Button,
  Badge,
  Box,
  Paper,
  Skeleton,
  Divider,
  ActionIcon,
  Flex,
} from "@mantine/core";
import {
  IconSearch,
  IconX,
  IconDatabase,
  IconArrowRight,
} from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { supabaseClient } from "@/services/supabase/client";

// --- Types ---
type TableConfig<T> = {
  name: string;
  label?: string;
  columns: (keyof T)[];
};

interface Fastro_RichSearchProps<T> {
  tables: TableConfig<T>[];
  placeholder?: string;
  /** Custom render function for search results */
  renderItem?: (item: T, tableName: string) => ReactNode;
  /** Callback when an item is selected */
  onItemSelect?: (item: T) => void;
  /** Custom styles for the search input */
  inputStyles?: Record<string, any>;
  /** Custom width for the search input */
  inputWidth?: string | number;
}

// --- Component ---
function Fastro_RichSearch<T extends { id: string | number }>({
  tables = [],
  placeholder = "Search...",
  renderItem,
  onItemSelect,
  inputStyles = {},
  inputWidth = "500px",
}: Fastro_RichSearchProps<T>) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 400);
  const [selectedTable, setSelectedTable] = useState<string>(
    tables[0]?.name || ""
  );
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentTableConfig = tables.find((t) => t.name === selectedTable);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchModalOpen]);

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchModalOpen(true);
      }
      if (event.key === "Escape" && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchModalOpen]);

  useEffect(() => {
    if (!selectedTable || !debouncedQuery || !searchModalOpen) return;
    fetchResults();
  }, [debouncedQuery, selectedTable, searchModalOpen]);

  const fetchResults = async () => {
    if (!currentTableConfig) return;

    setLoading(true);
    setError("");
    try {
      const { name: table, columns } = currentTableConfig;

      // First, let's check if there's any data in the table at all
      const checkData = await supabaseClient
        .from(table)
        .select("count")
        .limit(1);

      if (checkData.error) {
        throw new Error(
          `Error accessing table ${table}: ${checkData.error.message}`
        );
      }

      // Build the query
      let query = supabaseClient.from(table).select("*");

      // Only apply filters if there's a search query
      if (debouncedQuery && debouncedQuery.trim() !== "") {
        // Use filter() instead of or() for more reliable filtering
        // This creates a filter like: column1.ilike.%query% OR column2.ilike.%query%
        const filterString = columns
          .map((col) => `${String(col)}.ilike.%${debouncedQuery}%`)
          .join(",");

        if (filterString) {
          query = query.or(filterString);
        }
      }

      console.log(
        "Query:",
        table,
        "Search:",
        debouncedQuery,
        "Columns:",
        columns
      );

      const { data, error, count } = await query.limit(10);

      if (error) throw error;

      console.log(
        `Found ${
          data?.length || 0
        } results for "${debouncedQuery}" in table "${table}"`
      );

      if (!data || data.length === 0) {
        console.log(
          "No results found. Check if your table has data and columns match."
        );
        // Optionally fetch a sample to debug
        const sample = await supabaseClient.from(table).select("*").limit(1);
        console.log("Sample data:", sample.data);
      }

      setResults((data as T[]) || []);
    } catch (err: any) {
      console.log("Search error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Default function to format result items if no custom renderer is provided
  const defaultFormatResultItem = (item: T) => {
    // Get a title field if available
    const titleField = Object.entries(item).find(([key]) =>
      ["name", "title", "label", "username", "email"].includes(
        key.toLowerCase()
      )
    );

    // Get a description field if available
    const descField = Object.entries(item).find(([key]) =>
      ["description", "content", "summary", "bio", "text"].includes(
        key.toLowerCase()
      )
    );

    return (
      <>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} lineClamp={1}>
            {titleField ? titleField[1] : `Item ${item.id}`}
          </Text>
          <Badge size="sm" variant="outline">
            {currentTableConfig?.label || selectedTable}
          </Badge>
        </Group>

        {descField && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {String(descField[1])}
          </Text>
        )}

        <Group gap="xs" mt="xs">
          {Object.entries(item)
            .filter(
              ([key]) =>
                key !== "id" &&
                key !== titleField?.[0] &&
                key !== descField?.[0] &&
                item[key as keyof T] !== null
            )
            .slice(0, 3)
            .map(([key, value]) => (
              <Badge key={key} size="xs" color="gray" variant="outline">
                {key}:{" "}
                {typeof value === "object"
                  ? "..."
                  : String(value).substring(0, 20)}
              </Badge>
            ))}
        </Group>
      </>
    );
  };

  const handleOpenSearch = () => {
    setSearchModalOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchModalOpen(false);
    // Optionally reset state when closing
    // setQuery("")
    // setResults([])
  };

  const handleItemSelect = (item: T) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
    console.log("Selected item:", item);
    handleCloseSearch();
  };

  return (
    <>
      {/* Trigger button/input */}
      <TextInput
        visibleFrom="md"
        radius="md"
        variant="filled"
        placeholder={placeholder || "Search users..."}
        leftSection={<IconSearch size={16} stroke={1.5} color="gray" />}
        rightSection={
          <Text
            size="xs"
            c="dimmed"
            fw={500}
            style={{ whiteSpace: "nowrap", marginRight: "25px" }}
          >
            Ctrl + k
          </Text>
        }
        onClick={handleOpenSearch}
        readOnly
        size="sm"
        styles={(theme) => ({
          root: {
            width: inputWidth,
            display: "inline-block",
          },
          input: {
            cursor: "pointer",
            maxWidth: inputWidth,
            transition: "all 0.2s",
            border: `1px solid ${theme.colors.gray[3]}`,
            "&:hover": {
              borderColor: theme.colors.gray[5],
            },
            ...inputStyles,
          },
          section: {
            color: theme.colors.gray[6],
          },
        })}
      />

      {/* Search Modal */}
      <Modal
        opened={searchModalOpen}
        onClose={handleCloseSearch}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
        withCloseButton={false}
        styles={{
          content: {
            maxWidth: "650px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10vh",
            marginBottom: "auto",
            height: "auto",
            maxHeight: "80vh",
            borderRadius: "10px",
          },
          body: {
            padding: 0,
          },
        }}
      >
        <Paper>
          <Group p="md" wrap="nowrap">
            <TextInput
              ref={searchInputRef}
              placeholder="Search..."
              leftSection={<IconSearch size={18} />}
              rightSection={
                <ActionIcon
                  onClick={handleCloseSearch}
                  variant="subtle"
                  color="gray"
                >
                  <IconX size={18} />
                </ActionIcon>
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              styles={{ root: { flexGrow: 1 } }}
              size="md"
              radius="md"
            />
          </Group>

          {tables.length > 1 && (
            <Group mb="md">
              {tables.map((table) => (
                <Button
                  key={table.name}
                  variant={selectedTable === table.name ? "filled" : "outline"}
                  size="xs"
                  onClick={() => setSelectedTable(table.name)}
                  leftSection={<IconDatabase size={14} />}
                >
                  {table.label || table.name}
                </Button>
              ))}
            </Group>
          )}

          <Divider />

          <Box
            p="md"
            mih={100}
            style={{ overflowY: "auto", maxHeight: "60vh" }}
          >
            {loading ? (
              <Stack>
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
              </Stack>
            ) : error ? (
              <Paper p="md" withBorder color="red">
                <Text c="red">{error}</Text>
              </Paper>
            ) : (
              <Stack gap={5}>
                {results.length > 0 ? (
                  results.map((item) => (
                    <Paper
                      key={item.id}
                      className="searchItem"
                      p="sm"
                      radius="md"
                      withBorder={false}
                      onClick={() => handleItemSelect(item)}
                      style={{
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Box style={{ flexGrow: 1 }}>
                          {renderItem
                            ? renderItem(item, selectedTable)
                            : defaultFormatResultItem(item)}
                        </Box>
                        <IconArrowRight size={16} style={{ opacity: 0.5 }} />
                      </Flex>
                    </Paper>
                  ))
                ) : debouncedQuery ? (
                  <Paper p="xl" ta="center" c="dimmed">
                    <Text>No matches found.</Text>
                  </Paper>
                ) : (
                  <Paper p="xl" ta="center" c="dimmed">
                    <Text>Start typing to search...</Text>
                  </Paper>
                )}
              </Stack>
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default Fastro_RichSearch;
