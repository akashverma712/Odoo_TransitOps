// src/components/FilterToolbar.jsx
//
// Toolbar above the vehicle table. Per the finalized spec, this now holds
// only: Search Vehicle, Vehicle Type filter, Status filter, Registration
// Number search, and the Add Vehicle action. Capacity filter, sort
// dropdown, and export have been removed.
//
// NOTE ON FILTER SHAPE: this toolbar reports its state as
//   { search, regNumber, type, status }
// If the parent page (VehicleRegistry.jsx) still expects the older shape
// (search/type/status/capacity/sort), its filtering logic will need a small
// update to read `search` (matches vehicleName) and `regNumber` (matches
// registrationNumber) instead of the old combined/capacity/sort fields.

import { Plus, ChevronDown } from "lucide-react";
import SearchInput from "./SearchInput";
import { VEHICLE_TYPES, VEHICLE_STATUSES } from "../data/vehicles";

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

export default function FilterToolbar({ filters, onFilterChange, onAddVehicle }) {
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
          placeholder="Search vehicle name..."
        />
        <SearchInput
          value={filters.regNumber}
          onChange={(v) => onFilterChange({ ...filters, regNumber: v })}
          placeholder="Search registration no..."
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
      </div>

      <div className="flex items-center gap-2">
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