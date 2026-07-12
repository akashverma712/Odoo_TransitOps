// src/components/drivers/DriverList.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, User } from "lucide-react";
import DriverForm from "./DriverForm";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";

// Dummy data
const DUMMY_DRIVERS = [
  {
    id: 1,
    full_name: "Rajesh Kumar",
    license_number: "DL0120210001234",
    license_category: "HMV",
    license_expiry_date: "2028-05-15",
    status: "Available",
    contact_number: "+91 9876543210",
    email: "rajesh.kumar@example.in",
    safety_score: 96,
    hire_date: "2022-03-10",
    address: "Laxmi Nagar, New Delhi, Delhi",
  },
  {
    id: 2,
    full_name: "Amit Sharma",
    license_number: "MH1420200015678",
    license_category: "LMV",
    license_expiry_date: "2027-08-20",
    status: "On Trip",
    contact_number: "+91 9123456780",
    email: "amit.sharma@example.in",
    safety_score: 91,
    hire_date: "2021-07-15",
    address: "Andheri East, Mumbai, Maharashtra",
  },
  {
    id: 3,
    full_name: "Suresh Yadav",
    license_number: "UP3220220004567",
    license_category: "HMV",
    license_expiry_date: "2027-06-10",
    status: "Off Duty",
    contact_number: "+91 9988776655",
    email: "suresh.yadav@example.in",
    safety_score: 89,
    hire_date: "2023-01-20",
    address: "Alambagh, Lucknow, Uttar Pradesh",
  },
  {
    id: 4,
    full_name: "Ravi Verma",
    license_number: "RJ1420210007890",
    license_category: "Transport",
    license_expiry_date: "2028-04-25",
    status: "Available",
    contact_number: "+91 9871234567",
    email: "ravi.verma@example.in",
    safety_score: 98,
    hire_date: "2022-09-05",
    address: "Vaishali Nagar, Jaipur, Rajasthan",
  },
  {
    id: 5,
    full_name: "Mohit Singh",
    license_number: "HR2620190012345",
    license_category: "HMV",
    license_expiry_date: "2028-02-28",
    status: "On Trip",
    contact_number: "+91 9812345678",
    email: "mohit.singh@example.in",
    safety_score: 87,
    hire_date: "2021-11-12",
    address: "Sector 14, Gurugram, Haryana",
  },
  {
    id: 6,
    full_name: "Sunil Patel",
    license_number: "GJ0120230009876",
    license_category: "LMV",
    license_expiry_date: "2027-12-15",
    status: "Suspended",
    contact_number: "+91 9090909090",
    email: "sunil.patel@example.in",
    safety_score: 66,
    hire_date: "2023-05-18",
    address: "Navrangpura, Ahmedabad, Gujarat",
  },
  {
    id: 7,
    full_name: "Vikram Chauhan",
    license_number: "BR0120220011122",
    license_category: "HMV",
    license_expiry_date: "2028-03-01",
    status: "Available",
    contact_number: "+91 9304567890",
    email: "vikram.chauhan@example.in",
    safety_score: 93,
    hire_date: "2022-06-22",
    address: "Kankarbagh, Patna, Bihar",
  },
  {
    id: 8,
    full_name: "Deepak Mishra",
    license_number: "WB1920210045678",
    license_category: "Transport",
    license_expiry_date: "2027-09-12",
    status: "Off Duty",
    contact_number: "+91 9830012345",
    email: "deepak.mishra@example.in",
    safety_score: 90,
    hire_date: "2023-08-30",
    address: "Salt Lake, Kolkata, West Bengal",
  },
];

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    license_category: "",
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDrivers(DUMMY_DRIVERS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    // Simulate delete
    setDrivers(drivers.filter(driver => driver.id !== id));
    setSuccess("Driver deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDriver(null);
  };

  const handleFormSuccess = (formData) => {
    if (editingDriver) {
      // Update existing driver
      setDrivers(drivers.map(d => 
        d.id === editingDriver.id 
          ? { ...d, ...formData, id: d.id }
          : d
      ));
      setSuccess("Driver updated successfully");
    } else {
      // Add new driver
      const newDriver = {
        ...formData,
        id: Math.max(...drivers.map(d => d.id), 0) + 1,
        safety_score: formData.safety_score || 90,
        hire_date: formData.hire_date || new Date().toISOString().split('T')[0],
      };
      setDrivers([...drivers, newDriver]);
      setSuccess("Driver created successfully");
    }
    setTimeout(() => setSuccess(""), 3000);
    handleFormClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      Available: "bg-green-100 text-green-800",
      "On Trip": "bg-blue-100 text-blue-800",
      "Off Duty": "bg-yellow-100 text-yellow-800",
      Suspended: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getLicenseExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { label: "Expired", color: "text-red-600" };
    if (daysUntilExpiry < 30) return { label: "Expiring Soon", color: "text-yellow-600" };
    return { label: "Valid", color: "text-green-600" };
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      driver.license_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? driver.status === filters.status : true;
    const matchesLicense = filters.license_category
      ? driver.license_category === filters.license_category
      : true;

    return matchesSearch && matchesStatus && matchesLicense;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>
          <p className="text-gray-500">Manage your drivers and their licenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Driver</span>
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
                placeholder="Search drivers..."
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
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={filters.license_category}
            onChange={(e) =>
              setFilters({ ...filters, license_category: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const expiryStatus = getLicenseExpiryStatus(driver.license_expiry_date);
          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {driver.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        License: {driver.license_number}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      driver.status
                    )}`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">License Category</span>
                    <span className="font-medium">{driver.license_category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">License Expiry</span>
                    <span className={`font-medium ${expiryStatus.color}`}>
                      {new Date(driver.license_expiry_date).toLocaleDateString()}
                      <span className="text-xs ml-1">({expiryStatus.label})</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium">{driver.contact_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Safety Score</span>
                    <span className="font-medium">{driver.safety_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hire Date</span>
                    <span className="font-medium">
                      {new Date(driver.hire_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(driver)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id)}
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
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No drivers found</p>
        </div>
      )}

      {/* Driver Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DriverForm
              driver={editingDriver}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverList;