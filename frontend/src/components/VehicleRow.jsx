// src/components/VehicleRow.jsx
//
// A single row in the Vehicle Registry table, trimmed to the finalized
// column spec: Registration Number, Name/Model, Vehicle Type, Capacity,
// Odometer Reading, Acquisition Cost, Status, Actions.

import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

// NOTE: StatusBadge.jsx (not regenerated here) keys its colors on the old
// status set (Available / On Trip / Maintenance / Retired). Since the spec
// renamed "Maintenance" to "In Stop", StatusBadge will fall back to its
// default styling for that status until it's updated separately.
const STATUS_RAIL = {
  Available: "before:bg-emerald-400",
  "On Trip": "before:bg-[#4C8DFF]",
  "In Stop": "before:bg-amber-400",
  Retired: "before:bg-rose-400",
};

function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function VehicleRow({ vehicle, onView, onEdit, onDelete }) {
  const rail = STATUS_RAIL[vehicle.status] ?? "before:bg-white/20";

  return (
    <tr
      className={`group relative border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.025] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 ${rail}`}
    >
      <td className="whitespace-nowrap py-3.5 pl-5 pr-4 font-[IBM_Plex_Mono] text-sm text-[#E8EAED]">
        {vehicle.registrationNumber}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[#E8EAED]">
        {vehicle.vehicleName}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {vehicle.vehicleType}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {vehicle.capacity.toLocaleString()} kg
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 font-[IBM_Plex_Mono] text-sm text-[#8B93A1]">
        {vehicle.odometerReading.toLocaleString()} km
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 font-[IBM_Plex_Mono] text-sm text-[#8B93A1]">
        {formatCurrency(vehicle.acquisitionCost)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={vehicle.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onView(vehicle)}
            aria-label={`View ${vehicle.vehicleName}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-white/[0.06] hover:text-[#E8EAED]"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(vehicle)}
            aria-label={`Edit ${vehicle.vehicleName}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-white/[0.06] hover:text-[#E8EAED]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(vehicle)}
            aria-label={`Delete ${vehicle.vehicleName}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-rose-400/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}