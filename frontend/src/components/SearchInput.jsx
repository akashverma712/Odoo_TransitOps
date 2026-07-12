// src/components/SearchInput.jsx
//
// Reusable search field used in the toolbar. Kept generic so it can be
// reused on other registry-style pages (Drivers, Trips, etc.).

import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6272]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/[0.08] bg-[#0E1116] py-2 pl-9 pr-3 text-sm text-[#E8EAED] placeholder:text-[#5A6272] outline-none transition-colors focus:border-[#4C8DFF]/50 focus:ring-1 focus:ring-[#4C8DFF]/30"
      />
    </div>
  );
}
