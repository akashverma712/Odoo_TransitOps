// src/components/trips/TripList.jsx
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Eye, 
  MapPin, 
  Truck, 
  User, 
  Calendar,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import api from "../../config/axios";
import TripForm from "./TripForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";

// Dummy data for testing
const DUMMY_TRIPS = [
  {
    id: 1,
    source: "Mumbai",
    destination: "Delhi",
    status: "Draft",
    cargo_weight: 2500,
    planned_distance: 1400,
    vehicle_id: 1,
    driver_id: 1,
    created_at: "2026-01-15T10:30:00Z",
    vehicle: {
      registration_number: "MH-01-AB-1234",
    },
    driver: {
      full_name: "Rajesh Kumar",
    },
  },
  {
    id: 2,
    source: "Bangalore",
    destination: "Chennai",
    status: "Dispatched",
    cargo_weight: 1800,
    planned_distance: 350,
    vehicle_id: 2,
    driver_id: 2,
    created_at: "2026-01-14T09:15:00Z",
    vehicle: {
      registration_number: "KA-02-CD-5678",
    },
    driver: {
      full_name: "Priya Sharma",
    },
  },
  {
    id: 3,
    source: "Delhi",
    destination: "Jaipur",
    status: "Completed",
    cargo_weight: 1200,
    planned_distance: 280,
    fuel_consumed: 45.5,
    vehicle_id: 3,
    driver_id: 3,
    created_at: "2026-01-13T14:45:00Z",
    vehicle: {
      registration_number: "DL-03-EF-9012",
    },
    driver: {
      full_name: "Amit Singh",
    },
  },
  {
    id: 4,
    source: "Hyderabad",
    destination: "Pune",
    status: "Cancelled",
    cargo_weight: 3000,
    planned_distance: 560,
    vehicle_id: 4,
    driver_id: 4,
    created_at: "2026-01-12T08:00:00Z",
    vehicle: {
      registration_number: "TS-04-GH-3456",
    },
    driver: {
      full_name: "Sneha Patel",
    },
  },
  {
    id: 5,
    source: "Kolkata",
    destination: "Bhubaneswar",
    status: "Dispatched",
    cargo_weight: 2200,
    planned_distance: 440,
    vehicle_id: 5,
    driver_id: 5,
    created_at: "2026-01-16T11:20:00Z",
    vehicle: {
      registration_number: "WB-05-IJ-7890",
    },
    driver: {
      full_name: "Vikram Reddy",
    },
  },
  {
    id: 6,
    source: "Ahmedabad",
    destination: "Mumbai",
    status: "Completed",
    cargo_weight: 1500,
    planned_distance: 520,
    fuel_consumed: 65.8,
    vehicle_id: 6,
    driver_id: 6,
    created_at: "2026-01-11T16:30:00Z",
    vehicle: {
      registration_number: "GJ-06-KL-1234",
    },
    driver: {
      full_name: "Meena Gupta",
    },
  },
  {
    id: 7,
    source: "Chennai",
    destination: "Coimbatore",
    status: "Draft",
    cargo_weight: 800,
    planned_distance: 500,
    vehicle_id: 7,
    driver_id: 7,
    created_at: "2026-01-17T07:45:00Z",
    vehicle: {
      registration_number: "TN-07-MN-5678",
    },
    driver: {
      full_name: "Karthik Rajan",
    },
  },
  {
    id: 8,
    source: "Pune",
    destination: "Nagpur",
    status: "Completed",
    cargo_weight: 2800,
    planned_distance: 710,
    fuel_consumed: 82.3,
    vehicle_id: 8,
    driver_id: 8,
    created_at: "2026-01-10T13:15:00Z",
    vehicle: {
      registration_number: "MH-08-OP-9012",
    },
    driver: {
      full_name: "Sunita Deshmukh",
    },
  },
];

// Set this to false to use real API, true to use dummy data
const USE_DUMMY_DATA = true; // Change this to false when you want to use real API

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [useDummyData, setUseDummyData] = useState(USE_DUMMY_DATA);
  const [filters, setFilters] = useState({
    status: "",
    vehicle_id: "",
    driver_id: "",
  });

  useEffect(() => {
    fetchTrips(useDummyData);
  }, []);

  const fetchTrips = async (useDummy = false) => {
    try {
      setLoading(true);
      if (useDummy) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setTrips(DUMMY_TRIPS);
        setError("");
      } else {
        const response = await api.get("/trips");
        setTrips(response.data.data || []);
      }
    } catch (err) {
      // If API fails, fallback to dummy data
      if (!useDummy) {
        console.warn("API failed, falling back to dummy data");
        setTrips(DUMMY_TRIPS);
        setError("Using demo data (API connection failed)");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load trips");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (id) => {
    if (useDummyData) {
      // Simulate API call for dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrips(trips.map(trip => 
        trip.id === id ? { ...trip, status: "Dispatched" } : trip
      ));
      setSuccess("Trip dispatched successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.put(`/trips/${id}/dispatch`);
      setSuccess("Trip dispatched successfully");
      fetchTrips(useDummyData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dispatch trip");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleComplete = async (id, finalOdometer, fuelConsumed) => {
    if (useDummyData) {
      // Simulate API call for dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrips(trips.map(trip => 
        trip.id === id ? { 
          ...trip, 
          status: "Completed", 
          fuel_consumed: fuelConsumed,
          final_odometer: finalOdometer
        } : trip
      ));
      setSuccess("Trip completed successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.put(`/trips/${id}/complete`, { final_odometer: finalOdometer, fuel_consumed: fuelConsumed });
      setSuccess("Trip completed successfully");
      fetchTrips(useDummyData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete trip");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    if (useDummyData) {
      // Simulate API call for dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrips(trips.map(trip => 
        trip.id === id ? { ...trip, status: "Cancelled" } : trip
      ));
      setSuccess("Trip cancelled successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.put(`/trips/${id}/cancel`);
      setSuccess("Trip cancelled successfully");
      fetchTrips(useDummyData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel trip");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-800",
      Dispatched: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Updated to use Lucide icons
  const getStatusIcon = (status) => {
    const iconMap = {
      Draft: FileText,
      Dispatched: Send,
      Completed: CheckCircle,
      Cancelled: XCircle,
    };
    
    const IconComponent = iconMap[status] || AlertCircle;
    
    // Return the icon component with className for styling
    return <IconComponent className="h-8 w-8" />;
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.source
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? trip.status === filters.status : true;
    const matchesVehicle = filters.vehicle_id
      ? trip.vehicle_id === filters.vehicle_id
      : true;
    const matchesDriver = filters.driver_id
      ? trip.driver_id === filters.driver_id
      : true;

    return matchesSearch && matchesStatus && matchesVehicle && matchesDriver;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trips</h1>
          <p className="text-gray-500">Manage your transport trips</p>
          {useDummyData && (
            <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Demo Mode
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Trip</span>
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
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
                    {getStatusIcon(trip.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {trip.source} → {trip.destination}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Vehicle: {trip.vehicle?.registration_number || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Driver: {trip.driver?.full_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Cargo: {trip.cargo_weight} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trip.status === "Draft" && (
                    <>
                      <button
                        onClick={() => handleDispatch(trip.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => setEditingTrip(trip)}
                        className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  {trip.status === "Dispatched" && (
                    <>
                      <button
                        onClick={() => {
                          const finalOdometer = prompt("Enter final odometer reading:");
                          if (finalOdometer) {
                            const fuelConsumed = prompt("Enter fuel consumed (liters):");
                            if (fuelConsumed) {
                              handleComplete(trip.id, parseFloat(finalOdometer), parseFloat(fuelConsumed));
                            }
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancel(trip.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {(trip.status === "Completed" || trip.status === "Cancelled") && (
                    <button className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Distance:</span>
                  <span className="ml-2 font-medium">{trip.planned_distance} km</span>
                </div>
                {trip.status === "Completed" && (
                  <>
                    <div>
                      <span className="text-gray-500">Fuel Used:</span>
                      <span className="ml-2 font-medium">{trip.fuel_consumed || "N/A"} L</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Efficiency:</span>
                      <span className="ml-2 font-medium">
                        {trip.fuel_consumed
                          ? (trip.planned_distance / trip.fuel_consumed).toFixed(1)
                          : "N/A"}{" "}
                        km/L
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trips found</p>
        </div>
      )}

      {/* Trip Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TripForm
              trip={editingTrip}
              onSuccess={() => {
                fetchTrips(useDummyData);
                setShowForm(false);
                setEditingTrip(null);
                setSuccess(
                  editingTrip
                    ? "Trip updated successfully"
                    : "Trip created successfully"
                );
                setTimeout(() => setSuccess(""), 3000);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingTrip(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TripList;