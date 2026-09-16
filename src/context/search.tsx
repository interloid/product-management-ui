import type { SearchContextValue } from "@/types/props";
import { createContext } from "react";

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);
