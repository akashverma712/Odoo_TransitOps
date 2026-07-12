// src/components/AddVehicleModal.jsx
//
// Frontend-only "Add Vehicle" form, trimmed to the finalized field spec:
// Registration Number, Vehicle Name/Model, Vehicle Type, Capacity,
// Odometer Reading, Acquisition Cost, Status. Validation is frontend-only —
// no backend calls are made.
//
// BACKEND INTEGRATION NOTE:
// Swap the onSave handler in the parent page for a real POST request, e.g.
//   await fetch('/api/vehicles', { method: 'POST', body: JSON.stringify(form) })
// and add a server-side uniqueness check on registrationNumber.

import { useState } from "react";
import { X } from "lucide-react";
import { VEHICLE_TYPES, VEHICLE_STATUSES } from "../data/vehicles";

const EMPTY_FORM = {
  registrationNumber: "",
  vehicleName: "",
  vehicleType: VEHICLE_TYPES[0],
  capacity: "",
  odometerReading: "",
  acquisitionCost: "",
  status: VEHICLE_STATUSES[0],
};

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[#8B93A1]">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </label>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-[#0E1116] px-3 py-2 text-sm text-[#E8EAED] outline-none transition-colors focus:ring-1 ${
    hasError
      ? "border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/30"
      : "border-white/[0.08] focus:border-[#4C8DFF]/50 focus:ring-[#4C8DFF]/30"
  }`;

function validate(form, existingRegNumbers) {
  const errors = {};

  if (!form.registrationNumber.trim()) {
    errors.registrationNumber = "Registration number is required.";
  } else if (
    existingRegNumbers
      .map((r) => r.toLowerCase())
      .includes(form.registrationNumber.trim().toLowerCase())
  ) {
    errors.registrationNumber = "This registration number already exists.";
  }

  if (!form.vehicleName.trim()) {
    errors.vehicleName = "Vehicle name / model is required.";
  }

  if (!form.capacity || Number(form.capacity) <= 0) {
    errors.capacity = "Enter a capacity greater than 0.";
  }

  if (form.odometerReading === "" || Number(form.odometerReading) < 0) {
    errors.odometerReading = "Enter a valid odometer reading.";
  }

  if (!form.acquisitionCost || Number(form.acquisitionCost) <= 0) {
    errors.acquisitionCost = "Enter an acquisition cost greater than 0.";
  }

  return errors;
}

export default function AddVehicleModal({ open, onClose, onSave, existingRegNumbers = [] }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const validationErrors = validate(form, existingRegNumbers);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({
      ...form,
      capacity: Number(form.capacity),
      odometerReading: Number(form.odometerReading),
      acquisitionCost: Number(form.acquisitionCost),
    });
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#14171A] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-[Space_Grotesk] text-lg font-semibold text-[#E8EAED]">
            Add Vehicle
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#8B93A1] transition-colors hover:bg-white/[0.06] hover:text-[#E8EAED]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <Field label="Registration Number (Unique)" error={errors.registrationNumber}>
            <input
              className={inputClass(errors.registrationNumber)}
              value={form.registrationNumber}
              onChange={update("registrationNumber")}
              placeholder="GJ01AB1234"
            />
          </Field>
          <Field label="Vehicle Name / Model" error={errors.vehicleName}>
            <input
              className={inputClass(errors.vehicleName)}
              value={form.vehicleName}
              onChange={update("vehicleName")}
              placeholder="VAN-05"
            />
          </Field>
          <Field label="Vehicle Type">
            <select
              className={inputClass(false)}
              value={form.vehicleType}
              onChange={update("vehicleType")}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#12151B]">
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Capacity (kg)" error={errors.capacity}>
            <input
              type="number"
              className={inputClass(errors.capacity)}
              value={form.capacity}
              onChange={update("capacity")}
              placeholder="500"
            />
          </Field>
          <Field label="Odometer Reading (km)" error={errors.odometerReading}>
            <input
              type="number"
              className={inputClass(errors.odometerReading)}
              value={form.odometerReading}
              onChange={update("odometerReading")}
              placeholder="0"
            />
          </Field>
          <Field label="Acquisition Cost (₹)" error={errors.acquisitionCost}>
            <input
              type="number"
              className={inputClass(errors.acquisitionCost)}
              value={form.acquisitionCost}
              onChange={update("acquisitionCost")}
              placeholder="620000"
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass(false)}
              value={form.status}
              onChange={update("status")}
            >
              {VEHICLE_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#12151B]">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-[#C4C9D2] transition-colors hover:bg-white/[0.05]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#1A1206] transition-colors hover:bg-amber-400"
          >
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}