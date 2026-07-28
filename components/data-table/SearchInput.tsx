"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  delay?: number;
  onSearch: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Rechercher...",
  defaultValue = "",
  delay = 500,
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  const clear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
      />

      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}