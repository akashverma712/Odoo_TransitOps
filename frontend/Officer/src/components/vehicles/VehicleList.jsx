// src/components/vehicles/VehicleList.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import VehicleForm from "./VehicleForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";

// Dummy data
const DUMMY_VEHICLES = [
  {
    id: 1,
    registration_number: "DL01AB4589",
    model: "Tata Prima 5530.S",
    type: "Truck",
    status: "Available",
    max_load: 35000,
    odometer: 184320,
    year: 2023,
    color: "White",
  },
  {
    id: 2,
    registration_number: "MH12CD7621",
    model: "Mahindra Supro Maxitruck",
    type: "Mini Truck",
    status: "On Trip",
    max_load: 1050,
    odometer: 68250,
    year: 2022,
    color: "Silver",
  },
  {
    id: 3,
    registration_number: "KA03EF2198",
    model: "Toyota Innova Crysta",
    type: "Car",
    status: "Available",
    max_load: 600,
    odometer: 42560,
    year: 2024,
    color: "Black",
  },
  {
    id: 4,
    registration_number: "RJ14GH5543",
    model: "Ashok Leyland Viking",
    type: "Bus",
    status: "In Shop",
    max_load: 12000,
    odometer: 267890,
    year: 2021,
    color: "Blue",
  },
  {
    id: 5,
    registration_number: "HR26JK8901",
    model: "BharatBenz 2823C",
    type: "Truck",
    status: "On Trip",
    max_load: 28000,
    odometer: 123980,
    year: 2023,
    color: "Orange",
  },
  {
    id: 6,
    registration_number: "GJ01LM3412",
    model: "Eicher Pro 2049",
    type: "Light Truck",
    status: "Retired",
    max_load: 4900,
    odometer: 356420,
    year: 2018,
    color: "White",
  },
  {
    id: 7,
    registration_number: "BR01NP7865",
    model: "Mahindra Bolero Pickup",
    type: "Pickup",
    status: "Available",
    max_load: 1700,
    odometer: 58740,
    year: 2024,
    color: "Silver",
  },
  {
    id: 8,
    registration_number: "UP32QR6547",
    model: "Tata Ace Gold",
    type: "Mini Truck",
    status: "Available",
    max_load: 750,
    odometer: 29480,
    year: 2024,
    color: "White",
  },
];
const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setVehicles(DUMMY_VEHICLES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    // Simulate delete
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    setSuccess("Vehicle deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleFormSuccess = (formData) => {
    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, ...formData, id: v.id }
          : v
      ));
      setSuccess("Vehicle updated successfully");
    } else {
      // Add new vehicle
      const newVehicle = {
        ...formData,
        id: Math.max(...vehicles.map(v => v.id), 0) + 1,
        odometer: formData.odometer || 0,
      };
      setVehicles([...vehicles, newVehicle]);
      setSuccess("Vehicle created successfully");
    }
    setTimeout(() => setSuccess(""), 3000);
    handleFormClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      Available: "bg-green-100 text-green-800",
      "On Trip": "bg-blue-100 text-blue-800",
      "In Shop": "bg-yellow-100 text-yellow-800",
      Retired: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.registration_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type ? vehicle.type === filters.type : true;
    const matchesStatus = filters.status ? vehicle.status === filters.status : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicles</h1>
          <p className="text-gray-500">Manage your fleet vehicles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {vehicle.registration_number}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium">{vehicle.max_load} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Odometer</span>
                  <span className="font-medium">{vehicle.odometer} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Year</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No vehicles found</p>
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <VehicleForm
              vehicle={editingVehicle}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;