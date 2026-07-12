// src/components/maintenance/MaintenanceList.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Wrench, Calendar, CheckCircle } from "lucide-react";
import api from "../../config/axios";
import MaintenanceForm from "./MaintenanceForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";

// Dummy data for testing
const DUMMY_MAINTENANCE = [
  
  {
    id: 2,
    vehicle_id: 2,
    status: "Completed",
    priority: "Medium",
    description: "Brake pad replacement and wheel alignment",
    scheduled_date: "2026-07-09T14:30:00Z",
    completed_date: "2026-07-10T16:45:00Z",
    cost: 4500,
    vehicle: {
      registration_number: "KA-02-CD-5678",
      model: "Ashok Leyland Dost",
    },
  },
  {
    id: 3,
    vehicle_id: 3,
    status: "In Progress",
    priority: "Urgent",
    description: "Transmission repair - gear slipping issue",
    scheduled_date: "2026-07-12T09:00:00Z",
    completed_date: null,
    cost: null,
    vehicle: {
      registration_number: "DL-03-EF-9012",
      model: "Eicher Pro 2049",
    },
  },
  
];

// Set this to false to use real API, true to use dummy data
const USE_DUMMY_DATA = true; // Change this to false when you want to use real API

const MaintenanceList = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [useDummyData, setUseDummyData] = useState(USE_DUMMY_DATA);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    fetchMaintenance(useDummyData);
  }, []);

  const fetchMaintenance = async (useDummy = false) => {
    try {
      setLoading(true);
      if (useDummy) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setMaintenanceRecords(DUMMY_MAINTENANCE);
        setError("");
      } else {
        const response = await api.get("/maintenance");
        setMaintenanceRecords(response.data.data || []);
      }
    } catch (err) {
      // If API fails, fallback to dummy data
      if (!useDummy) {
        console.warn("API failed, falling back to dummy data");
        setMaintenanceRecords(DUMMY_MAINTENANCE);
        setError("Using demo data (API connection failed)");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load maintenance records");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMaintenance = async (id) => {
    if (!window.confirm("Close this maintenance record? Vehicle will become available.")) return;

    if (useDummyData) {
      // Simulate API call for dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      setMaintenanceRecords(maintenanceRecords.map(record => 
        record.id === id ? { 
          ...record, 
          status: "Completed",
          completed_date: new Date().toISOString(),
          cost: Math.floor(Math.random() * 5000) + 1000 // Random cost for demo
        } : record
      ));
      setSuccess("Maintenance record closed successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.put(`/maintenance/${id}/close`);
      setSuccess("Maintenance record closed successfully");
      fetchMaintenance(useDummyData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to close maintenance");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    if (useDummyData) {
      // Simulate API call for dummy data
      await new Promise(resolve => setTimeout(resolve, 500));
      setMaintenanceRecords(maintenanceRecords.filter(record => record.id !== id));
      setSuccess("Record deleted successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.delete(`/maintenance/${id}`);
      setSuccess("Record deleted successfully");
      fetchMaintenance(useDummyData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete record");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-red-100 text-red-800",
      Urgent: "bg-purple-100 text-purple-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch = record.vehicle?.registration_number
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? record.status === filters.status : true;
    const matchesPriority = filters.priority ? record.priority === filters.priority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance</h1>
          <p className="text-gray-500">Manage vehicle maintenance records</p>
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
          <span>Add Maintenance</span>
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
                placeholder="Search maintenance records..."
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
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {record.vehicle?.registration_number || "Unknown Vehicle"}
                  </h3>
                  <p className="text-sm text-gray-500">{record.vehicle?.model || ""}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      record.priority
                    )}`}
                  >
                    {record.priority}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <Wrench className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{record.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled Date</span>
                  <span className="font-medium">
                    {new Date(record.scheduled_date).toLocaleDateString()}
                  </span>
                </div>
                {record.completed_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed Date</span>
                    <span className="font-medium">
                      {new Date(record.completed_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {record.cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cost</span>
                    <span className="font-medium">₹{record.cost}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {record.status === "In Progress" && (
                  <>
                    <button
                      onClick={() => handleCloseMaintenance(record.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingRecord(record);
                        setShowForm(true);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(record.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No maintenance records found</p>
        </div>
      )}

      {/* Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <MaintenanceForm
              record={editingRecord}
              onSuccess={() => {
                fetchMaintenance(useDummyData);
                setShowForm(false);
                setEditingRecord(null);
                setSuccess(
                  editingRecord
                    ? "Maintenance record updated successfully"
                    : "Maintenance record created successfully"
                );
                setTimeout(() => setSuccess(""), 3000);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingRecord(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;