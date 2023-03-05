import { useMemo, useState } from "react";

export function useSearch<T>({
  items,
  searchTerm,
}: {
  items: T[] | undefined;
  searchTerm?: keyof T;
}) {
  const [search, setSearch] = useState("");

  let filteredItems: T[] | undefined = useMemo(() => {
    if (searchTerm) {
      return items?.filter((item) => {
        const t = item[searchTerm];
        return (
          typeof t === "string" &&
          t.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
      });
    } else {
      return items?.filter((item) => {
        return (
          typeof item === "string" &&
          item.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
      });
    }
  }, [search, items, searchTerm]);

  return { filteredItems, search, setSearch };
}
