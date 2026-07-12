// src/data/vehicles.js
//
// Mock data source for the Vehicle Registry page.
// Schema locked to the team's finalized spec — every vehicle record has
// exactly these 7 fields, nothing else.
// ---------------------------------------------------------------------------
// BACKEND INTEGRATION NOTE:
// Replace this static export with a real API call once the backend is ready,
// e.g.
//   export async function fetchVehicles() {
//     const res = await fetch('/api/vehicles');
//     return res.json();
//   }
// Keep the field names below identical so components don't need to change.
// ---------------------------------------------------------------------------

export const VEHICLE_TYPES = ["Van", "Truck", "Mini-Truck", "Bus"];

export const VEHICLE_STATUSES = ["Available", "On Trip", "In Stop", "Retired"];

export const vehicles = [
  {
    id: "VEH-001",
    registrationNumber: "GJ01AB4521",
    vehicleName: "VAN-05",
    vehicleType: "Van",
    capacity: 500,
    odometerReading: 74000,
    acquisitionCost: 620000,
    status: "Available",
  },
  {
    id: "VEH-002",
    registrationNumber: "GJ01AB9981",
    vehicleName: "TRUCK-11",
    vehicleType: "Truck",
    capacity: 5000,
    odometerReading: 182000,
    acquisitionCost: 2450000,
    status: "On Trip",
  },
  {
    id: "VEH-003",
    registrationNumber: "GJ01AB1120",
    vehicleName: "MINI-03",
    vehicleType: "Mini-Truck",
    capacity: 1000,
    odometerReading: 66000,
    acquisitionCost: 410000,
    status: "In Stop",
  },
  {
    id: "VEH-004",
    registrationNumber: "GJ01AB0087",
    vehicleName: "VAN-09",
    vehicleType: "Van",
    capacity: 750,
    odometerReading: 241900,
    acquisitionCost: 590000,
    status: "Retired",
  },
  {
    id: "VEH-005",
    registrationNumber: "GJ01AC3345",
    vehicleName: "TRUCK-14",
    vehicleType: "Truck",
    capacity: 7500,
    odometerReading: 98500,
    acquisitionCost: 3120000,
    status: "Available",
  },
  {
    id: "VEH-006",
    registrationNumber: "GJ01AB7742",
    vehicleName: "MINI-07",
    vehicleType: "Mini-Truck",
    capacity: 1200,
    odometerReading: 41200,
    acquisitionCost: 455000,
    status: "On Trip",
  },
  {
    id: "VEH-007",
    registrationNumber: "GJ01AC5560",
    vehicleName: "BUS-02",
    vehicleType: "Bus",
    capacity: 3500,
    odometerReading: 156000,
    acquisitionCost: 1850000,
    status: "Available",
  },
  {
    id: "VEH-008",
    registrationNumber: "GJ01AB2287",
    vehicleName: "VAN-12",
    vehicleType: "Van",
    capacity: 500,
    odometerReading: 112400,
    acquisitionCost: 680000,
    status: "In Stop",
  },
  {
    id: "VEH-009",
    registrationNumber: "GJ01AC9034",
    vehicleName: "TRUCK-19",
    vehicleType: "Truck",
    capacity: 6000,
    odometerReading: 203100,
    acquisitionCost: 2760000,
    status: "Available",
  },
  {
    id: "VEH-010",
    registrationNumber: "GJ01AB6603",
    vehicleName: "MINI-11",
    vehicleType: "Mini-Truck",
    capacity: 900,
    odometerReading: 23400,
    acquisitionCost: 480000,
    status: "On Trip",
  },
  {
    id: "VEH-011",
    registrationNumber: "GJ01AC1198",
    vehicleName: "VAN-16",
    vehicleType: "Van",
    capacity: 650,
    odometerReading: 5400,
    acquisitionCost: 710000,
    status: "Available",
  },
  {
    id: "VEH-012",
    registrationNumber: "GJ01AB8820",
    vehicleName: "BUS-05",
    vehicleType: "Bus",
    capacity: 3200,
    odometerReading: 267800,
    acquisitionCost: 1690000,
    status: "Retired",
  },
];