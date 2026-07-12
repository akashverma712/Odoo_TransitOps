// src/components/drivers/DriverForm.jsx
import { useState } from "react";
import { X } from "lucide-react";
import api from "../../config/axios";
import ErrorAlert from "../common/ErrorAlert";

const DriverForm = ({ driver, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: driver?.full_name || "",
    license_number: driver?.license_number || "",
    license_category: driver?.license_category || "",
    license_expiry_date: driver?.license_expiry_date || "",
    contact_number: driver?.contact_number || "",
    safety_score: driver?.safety_score || 100,
    status: driver?.status || "Available",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const licenseCategories = ["A", "B", "C", "D", "E"];
  const statuses = ["Available", "On Trip", "Off Duty", "Suspended"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.full_name || !formData.license_number || !formData.license_category) {
      setError("Please fill in all required fields");
      return;
    }

    if (new Date(formData.license_expiry_date) < new Date()) {
      setError("License expiry date cannot be in the past");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;
      if (driver) {
        response = await api.put(`/drivers/${driver.id}`, formData);
      } else {
        response = await api.post("/drivers", formData);
      }

      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {driver ? "Edit Driver" : "Add New Driver"}
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
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number *
            </label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., DL123456"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Category *
            </label>
            <select
              name="license_category"
              value={formData.license_category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select category</option>
              {licenseCategories.map((category) => (
                <option key={category} value={category}>
                  Category {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date *
            </label>
            <input
              type="date"
              name="license_expiry_date"
              value={formData.license_expiry_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Score
            </label>
            <input
              type="number"
              name="safety_score"
              value={formData.safety_score}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : driver ? "Update Driver" : "Add Driver"}
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

export default DriverForm;