// src/components/FilterToolbar.jsx
//
// Toolbar bar above the vehicle table: search, filters, sort, export,
// and the primary "Add Vehicle" action.

import { Download, Plus, ChevronDown } from "lucide-react";
import SearchInput from "./SearchInput";
import { VEHICLE_TYPES, VEHICLE_STATUSES } from "../data/vehicles";

const CAPACITY_BANDS = [
  { label: "All Capacities", value: "all" },
  { label: "Up to 1,000 kg", value: "0-1000" },
  { label: "1,000 – 5,000 kg", value: "1000-5000" },
  { label: "Above 5,000 kg", value: "5000-999999" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Registration No. (A–Z)", value: "reg-asc" },
  { label: "Odometer (High – Low)", value: "odometer-desc" },
  { label: "Capacity (High – Low)", value: "capacity-desc" },
];

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-white/[0.08] bg-[#0E1116] py-2 pl-3 pr-8 text-sm text-[#E8EAED] outline-none transition-colors focus:border-[#4C8DFF]/50 focus:ring-1 focus:ring-[#4C8DFF]/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#12151B]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A6272]" />
    </div>
  );
}

export default function FilterToolbar({ filters, onFilterChange, onExport, onAddVehicle }) {
  const typeOptions = [
    { label: "All Types", value: "all" },
    ...VEHICLE_TYPES.map((t) => ({ label: t, value: t })),
  ];
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    ...VEHICLE_STATUSES.map((s) => ({ label: s, value: s })),
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#12151B] p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={filters.search}
          onChange={(v) => onFilterChange({ ...filters, search: v })}
          placeholder="Search reg. no. or vehicle name..."
        />
        <Select
          value={filters.type}
          onChange={(v) => onFilterChange({ ...filters, type: v })}
          options={typeOptions}
        />
        <Select
          value={filters.status}
          onChange={(v) => onFilterChange({ ...filters, status: v })}
          options={statusOptions}
        />
        <Select
          value={filters.capacity}
          onChange={(v) => onFilterChange({ ...filters, capacity: v })}
          options={CAPACITY_BANDS}
        />
        <Select
          value={filters.sort}
          onChange={(v) => onFilterChange({ ...filters, sort: v })}
          options={SORT_OPTIONS}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-transparent px-3.5 py-2 text-sm font-medium text-[#C4C9D2] transition-colors hover:bg-white/[0.05]"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          onClick={onAddVehicle}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-semibold text-[#1A1206] shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition-colors hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>
    </div>
  );
}
