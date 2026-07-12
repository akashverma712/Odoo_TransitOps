// src/components/VehicleRow.jsx
//
// A single row in the Vehicle Registry table. Reg. number, odometer, and
// fuel level use a monospace face so the numeric columns read like a
// manifest/ledger rather than prose.

import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const STATUS_RAIL = {
  Available: "before:bg-emerald-400",
  "On Trip": "before:bg-[#4C8DFF]",
  Maintenance: "before:bg-amber-400",
  Retired: "before:bg-rose-400",
};

function FuelLevel({ level }) {
  const color =
    level > 50 ? "bg-emerald-400" : level > 20 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.08]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className="font-[IBM_Plex_Mono] text-xs text-[#8B93A1]">{level}%</span>
    </div>
  );
}

export default function VehicleRow({ vehicle, onView, onEdit, onDelete }) {
  const rail = STATUS_RAIL[vehicle.status] ?? "before:bg-white/20";

  return (
    <tr
      className={`group relative border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.025] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 ${rail}`}
    >
      <td className="whitespace-nowrap py-3.5 pl-5 pr-4 font-[IBM_Plex_Mono] text-sm text-[#E8EAED]">
        {vehicle.regNumber}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[#E8EAED]">
        {vehicle.name}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">{vehicle.type}</td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {vehicle.capacityKg.toLocaleString()} kg
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {vehicle.driverAssigned === "Unassigned" ? (
          <span className="italic text-[#5A6272]">Unassigned</span>
        ) : (
          vehicle.driverAssigned
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {vehicle.currentLocation}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 font-[IBM_Plex_Mono] text-sm text-[#8B93A1]">
        {vehicle.odometerKm.toLocaleString()} km
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <FuelLevel level={vehicle.fuelLevel} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#8B93A1]">
        {new Date(vehicle.lastServiceDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={vehicle.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onView(vehicle)}
            aria-label={`View ${vehicle.name}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-white/[0.06] hover:text-[#E8EAED]"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(vehicle)}
            aria-label={`Edit ${vehicle.name}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-white/[0.06] hover:text-[#E8EAED]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(vehicle)}
            aria-label={`Delete ${vehicle.name}`}
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-rose-400/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
