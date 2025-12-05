import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useDebounce } from "@/hooks/useDebounce";

// Presentational component - just UI
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-9 h-10 bg-background/50 border-border/50 focus:bg-background transition-colors ${className || ""}`}
      />
    </div>
  );
}

// Container component - handles URL sync with debounce
interface SearchInputURLSyncedProps {
  searchKey?: string;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export function SearchInputURLSynced({
  searchKey = "q",
  placeholder = "Search...",
  className,
  delay = 300,
}: SearchInputURLSyncedProps) {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  // Get the current search value from URL
  const urlSearchValue =
    (search[searchKey as keyof typeof search] as string | undefined) || "";

  // Local state for immediate input updates (responsive UI)
  const [localValue, setLocalValue] = useState(urlSearchValue);

  // Debounce the local value
  const debouncedValue = useDebounce(localValue, delay);

  // Sync local state with URL when URL changes externally
  useEffect(() => {
    setLocalValue(urlSearchValue);
  }, [urlSearchValue]);

  // Update URL only when debounced value changes
  useEffect(() => {
    if (debouncedValue !== urlSearchValue) {
      navigate({
        search: (prev) => ({
          ...prev,
          [searchKey]: debouncedValue,
        }),
      });
    }
  }, [debouncedValue, searchKey, urlSearchValue, navigate]);

  return (
    <SearchInput
      value={localValue}
      onChange={setLocalValue}
      placeholder={placeholder}
      className={className}
    />
  );
}
