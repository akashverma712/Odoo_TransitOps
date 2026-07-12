// src/pages/VehicleRegistry.jsx
//
// Vehicle Registry page — standalone, self-contained, and ready to drop
// into an existing routed React app (e.g. <Route path="/fleet/vehicles"
// element={<VehicleRegistry />} />).
//
// FONT NOTE: This page is designed around "Space Grotesk" (display),
// "Inter" (body), and "IBM Plex Mono" (data/numeric columns). If these
// aren't already loaded globally, add to index.html <head>:
//   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
// The page still renders correctly with system fonts as a fallback.
//
// BACKEND INTEGRATION NOTE: This page currently manages vehicles in local
// React state seeded from src/data/vehicles.js. Once the backend exists,
// replace the useState initializer with a fetch in a useEffect, and wire
// handleAddVehicle / handleDeleteVehicle to real API calls.

import { useMemo, useState } from "react";
import { vehicles as mockVehicles } from "../data/vehicles";
import StatsCards from "../components/StatsCards";
import FilterToolbar from "../components/FilterToolbar";
import VehicleTable from "../components/VehicleTable";
import AddVehicleModal from "../components/AddVehicleModal";

const DEFAULT_FILTERS = {
  search: "",
  type: "all",
  status: "all",
  capacity: "all",
  sort: "newest",
};

function withinCapacityBand(capacityKg, band) {
  if (band === "all") return true;
  const [min, max] = band.split("-").map(Number);
  return capacityKg >= min && capacityKg <= max;
}

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((v) => {
      const matchesSearch =
        filters.search.trim() === "" ||
        v.regNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === "all" || v.type === filters.type;
      const matchesStatus = filters.status === "all" || v.status === filters.status;
      const matchesCapacity = withinCapacityBand(v.capacityKg, filters.capacity);
      return matchesSearch && matchesType && matchesStatus && matchesCapacity;
    });

    switch (filters.sort) {
      case "reg-asc":
        result = [...result].sort((a, b) => a.regNumber.localeCompare(b.regNumber));
        break;
      case "odometer-desc":
        result = [...result].sort((a, b) => b.odometerKm - a.odometerKm);
        break;
      case "capacity-desc":
        result = [...result].sort((a, b) => b.capacityKg - a.capacityKg);
        break;
      default:
        // "newest" — mock data is already in insertion order; a real API
        // would sort by createdAt desc server-side.
        break;
    }
    return result;
  }, [vehicles, filters]);

  const handleAddVehicle = (form) => {
    // BACKEND INTEGRATION NOTE: replace with POST /api/vehicles response.
    const newVehicle = {
      id: `VEH-${String(vehicles.length + 1).padStart(3, "0")}`,
      regNumber: form.regNumber,
      name: form.name,
      type: form.type,
      capacityKg: form.capacityKg,
      driverAssigned: "Unassigned",
      currentLocation: "—",
      odometerKm: form.odometerKm,
      fuelLevel: 100,
      lastServiceDate: new Date().toISOString().slice(0, 10),
      status: form.status,
      fuelType: form.fuelType,
      purchaseDate: form.purchaseDate,
      insuranceExpiry: form.insuranceExpiry,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    setModalOpen(false);
  };

  const handleDeleteVehicle = (vehicle) => {
    // BACKEND INTEGRATION NOTE: replace with DELETE /api/vehicles/:id.
    if (window.confirm(`Remove ${vehicle.name} (${vehicle.regNumber}) from the registry?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    }
  };

  const handleViewVehicle = (vehicle) => {
    // BACKEND INTEGRATION NOTE: route to a vehicle detail page once it exists,
    // e.g. navigate(`/fleet/vehicles/${vehicle.id}`).
    console.log("View vehicle", vehicle);
  };

  const handleEditVehicle = (vehicle) => {
    // BACKEND INTEGRATION NOTE: open an edit form / PATCH /api/vehicles/:id.
    console.log("Edit vehicle", vehicle);
  };

  const handleExport = () => {
    // Simple client-side CSV export of the currently filtered rows.
    const headers = [
      "Registration Number",
      "Vehicle Name",
      "Type",
      "Capacity (kg)",
      "Driver Assigned",
      "Current Location",
      "Odometer (km)",
      "Fuel Level (%)",
      "Last Service Date",
      "Status",
    ];
    const rows = filteredVehicles.map((v) => [
      v.regNumber,
      v.name,
      v.type,
      v.capacityKg,
      v.driverAssigned,
      v.currentLocation,
      v.odometerKm,
      v.fuelLevel,
      v.lastServiceDate,
      v.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vehicle-registry.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] px-4 py-8 font-[Inter] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header>
          <h1 className="font-[Space_Grotesk] text-2xl font-semibold text-[#E8EAED] sm:text-3xl">
            Vehicle Registry
          </h1>
          <p className="mt-1.5 text-sm text-[#8B93A1]">
            The master record of every vehicle in your fleet — status, assignment,
            and maintenance history in one place.
          </p>
        </header>

        <StatsCards vehicles={vehicles} />

        <FilterToolbar
          filters={filters}
          onFilterChange={setFilters}
          onExport={handleExport}
          onAddVehicle={() => setModalOpen(true)}
        />

        <VehicleTable
          vehicles={filteredVehicles}
          onView={handleViewVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
          onAddVehicle={() => setModalOpen(true)}
        />
      </div>

      <AddVehicleModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddVehicle}
      />
    </div>
  );
}
