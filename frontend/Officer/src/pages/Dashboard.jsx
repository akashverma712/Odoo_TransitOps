// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import {
  Truck,
  Users,
  MapPin,
  Wrench,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Fuel,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    fleetUtilization: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    fuelEfficiency: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [filters, setFilters] = useState({
    vehicleType: "",
    status: "",
    region: "",
  });
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    fetchDashboardData();
    fetchRecentTrips();
    fetchUpcomingMaintenance();
    fetchExpiringLicenses();
  }, [filters, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/kpis", { 
        params: { ...filters, range: timeRange } 
      });
      setKpis(response.data.data || kpis);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTrips = async () => {
    try {
      const response = await api.get("/trips", { 
        params: { limit: 5, sort: "-created_at" } 
      });
      setRecentTrips(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch recent trips:", err);
    }
  };

  const fetchUpcomingMaintenance = async () => {
    try {
      const response = await api.get("/maintenance", { 
        params: { status: "Scheduled", limit: 5 } 
      });
      setUpcomingMaintenance(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch maintenance:", err);
    }
  };

  const fetchExpiringLicenses = async () => {
    try {
      const response = await api.get("/drivers/expiring-licenses", { 
        params: { days: 30 } 
      });
      setExpiringLicenses(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch expiring licenses:", err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Draft": "bg-gray-100 text-gray-800",
      "Dispatched": "bg-blue-100 text-blue-800",
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTripStatusIcon = (status) => {
    const icons = {
      "Draft": <Clock className="h-4 w-4" />,
      "Dispatched": <Truck className="h-4 w-4" />,
      "Completed": <CheckCircle className="h-4 w-4" />,
      "Cancelled": <XCircle className="h-4 w-4" />,
    };
    return icons[status] || <Activity className="h-4 w-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "Low": "bg-green-100 text-green-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "High": "bg-orange-100 text-orange-800",
      "Urgent": "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.organization_name || "User"}!
          </h1>
          <p className="text-gray-500">Here's what's happening with your fleet</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Vehicles</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.activeVehicles}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Vehicles</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.availableVehicles}</p>
              <p className="text-xs text-red-600 mt-1">↓ 5% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Maintenance</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.vehiclesInMaintenance}</p>
              <p className="text-xs text-yellow-600 mt-1">↑ 8% from last month</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Fleet Utilization</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.fleetUtilization}%</p>
              <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Trips</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.activeTrips}</p>
              <p className="text-xs text-green-600 mt-1">↑ 15% from last month</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Trips</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.pendingTrips}</p>
              <p className="text-xs text-yellow-600 mt-1">↓ 2% from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Drivers On Duty</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.driversOnDuty}</p>
              <p className="text-xs text-green-600 mt-1">↑ 7% from last month</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpis.fuelEfficiency} km/L</p>
              <p className="text-xs text-green-600 mt-1">↑ 4% from last month</p>
            </div>
            <div className="bg-cyan-100 p-3 rounded-lg">
              <Fuel className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Expenses Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(kpis.totalRevenue)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(kpis.totalExpenses)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency((kpis.totalRevenue || 0) - (kpis.totalExpenses || 0))}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/trips/create")}
              className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Create New Trip</span>
            </button>
            <button
              onClick={() => navigate("/vehicles/add")}
              className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Truck className="h-4 w-4" />
              <span>Add New Vehicle</span>
            </button>
            <button
              onClick={() => navigate("/drivers/add")}
              className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Register New Driver</span>
            </button>
            <button
              onClick={() => navigate("/maintenance/add")}
              className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Wrench className="h-4 w-4" />
              <span>Schedule Maintenance</span>
            </button>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Recent Trips</h3>
            <button
              onClick={() => navigate("/trips")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTrips.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No recent trips</p>
            ) : (
              recentTrips.map((trip) => (
                <div key={trip.id} className="flex items-start space-x-3 text-sm">
                  <div className="mt-1">
                    {getTripStatusIcon(trip.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">
                      {trip.source} → {trip.destination}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(trip.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Maintenance & Expiring Licenses */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Alerts & Notifications</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Upcoming Maintenance</h4>
              {upcomingMaintenance.length === 0 ? (
                <p className="text-sm text-gray-400">No upcoming maintenance</p>
              ) : (
                upcomingMaintenance.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-1.5 text-sm">
                    <span className="text-gray-700">{item.vehicle?.registration_number}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Expiring Licenses</h4>
              {expiringLicenses.length === 0 ? (
                <p className="text-sm text-gray-400">No expiring licenses</p>
              ) : (
                expiringLicenses.slice(0, 3).map((driver) => (
                  <div key={driver.id} className="flex justify-between items-center py-1.5 text-sm">
                    <span className="text-gray-700">{driver.full_name}</span>
                    <span className="text-xs text-red-600 font-medium">
                      {Math.ceil((new Date(driver.license_expiry_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => navigate("/reports")}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Full Report →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 text-sm border-b border-gray-100 pb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-gray-700">Trip #TR-123 completed successfully</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-sm border-b border-gray-100 pb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-gray-700">New vehicle added: VAN-05 Toyota Hiace</p>
              <p className="text-xs text-gray-400">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-sm border-b border-gray-100 pb-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-gray-700">Maintenance scheduled for TRUCK-02</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-gray-700">Driver John Doe license expiring in 5 days</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;