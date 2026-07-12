// src/components/VehicleTable.jsx
//
// Table shell for the Vehicle Registry, trimmed to the finalized column
// spec. Wrapped in an overflow-x-auto container so it degrades to
// horizontal scroll on tablet/mobile instead of breaking the layout.

import VehicleRow from "./VehicleRow";
import EmptyState from "./EmptyState";

const COLUMNS = [
  "Registration Number",
  "Name / Model",
  "Vehicle Type",
  "Capacity",
  "Odometer Reading",
  "Acquisition Cost",
  "Status",
  "Actions",
];

export default function VehicleTable({ vehicles, onView, onEdit, onDelete, onAddVehicle }) {
  if (vehicles.length === 0) {
    return <EmptyState onAddVehicle={onAddVehicle} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12151B]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#5A6272] first:pl-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <VehicleRow
                key={vehicle.id}
                vehicle={vehicle}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}