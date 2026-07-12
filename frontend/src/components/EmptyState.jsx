// src/components/EmptyState.jsx
//
// Shown when the registry has no vehicles (or none match the current
// filters). Framed as an invitation to act, not just a blank space.

import { Truck, Plus } from "lucide-react";

export default function EmptyState({ onAddVehicle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#12151B] px-6 py-20 text-center">
      <div className="rounded-2xl bg-white/[0.05] p-4">
        <Truck className="h-6 w-6 text-[#5A6272]" />
      </div>
      <h3 className="mt-5 font-[Space_Grotesk] text-lg font-semibold text-[#E8EAED]">
        No vehicles in the registry yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#8B93A1]">
        Vehicles you add will show up here with live status, assigned driver,
        and maintenance history.
      </p>
      <button
        type="button"
        onClick={onAddVehicle}
        className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#1A1206] transition-colors hover:bg-amber-400"
      >
        <Plus className="h-4 w-4" />
        Add Your First Vehicle
      </button>
    </div>
  );
}
