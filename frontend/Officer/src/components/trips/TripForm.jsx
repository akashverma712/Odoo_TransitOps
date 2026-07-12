// src/components/trips/TripForm.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../config/axios";
import ErrorAlert from "../common/ErrorAlert";
import LoadingSpinner from "../common/LoadingSpinner";

const TripForm = ({ trip, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    source: trip?.source || "",
    destination: trip?.destination || "",
    vehicle_id: trip?.vehicle_id || "",
    driver_id: trip?.driver_id || "",
    cargo_weight: trip?.cargo_weight || "",
    planned_distance: trip?.planned_distance || "",
    status: trip?.status || "Draft",
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicleCapacity, setSelectedVehicleCapacity] = useState(0);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setFetchingOptions(true);
      const [vehiclesRes, driversRes] = await Promise.all([
        api.get("/vehicles/available"),
        api.get("/drivers/available"),
      ]);
      setVehicles(vehiclesRes.data.data || []);
      setDrivers(driversRes.data.data || []);
    } catch (err) {
      setError("Failed to load options");
    } finally {
      setFetchingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");

    // Update vehicle capacity when vehicle is selected
    if (name === "vehicle_id") {
      const selectedVehicle = vehicles.find((v) => v.id === value);
      setSelectedVehicleCapacity(selectedVehicle?.max_load || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.source || !formData.destination || !formData.vehicle_id || !formData.driver_id) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.cargo_weight) > selectedVehicleCapacity) {
      setError(`Cargo weight exceeds vehicle capacity (${selectedVehicleCapacity} kg)`);
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;
      if (trip) {
        response = await api.put(`/trips/${trip.id}`, formData);
      } else {
        response = await api.post("/trips", formData);
      }

      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save trip");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingOptions) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {trip ? "Edit Trip" : "Create New Trip"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source *
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Warehouse A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., City Center"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle *
            </label>
            <select
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration_number} - {vehicle.model} ({vehicle.max_load} kg)
                </option>
              ))}
            </select>
            {vehicles.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                No available vehicles. Please add a vehicle first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver *
            </label>
            <select
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.full_name} - {driver.license_number}
                </option>
              ))}
            </select>
            {drivers.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                No available drivers. Please add a driver first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo Weight (kg)
            </label>
            <input
              type="number"
              name="cargo_weight"
              value={formData.cargo_weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 450"
              min="0"
            />
            {selectedVehicleCapacity > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Max capacity: {selectedVehicleCapacity} kg
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planned Distance (km)
            </label>
            <input
              type="number"
              name="planned_distance"
              value={formData.planned_distance}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 150"
              min="0"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || vehicles.length === 0 || drivers.length === 0}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;