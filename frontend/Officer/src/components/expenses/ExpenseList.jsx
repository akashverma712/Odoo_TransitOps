// src/components/expenses/FuelExpenses.jsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Truck,
  Filter,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import api from "../../config/axios";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";

// Dummy data for testing
const DUMMY_FUEL_EXPENSES = [
  {
    id: 1,
    vehicle_id: 1,
    vehicle: { registration_number: "MH-01-AB-1234", model: "Tata Ace" },
    date: "2026-01-15",
    liters: 45.5,
    cost_per_liter: 94.5,
    total_cost: 4300,
    odometer_reading: 15420,
    fuel_type: "Diesel",
    station_name: "Indian Oil - Andheri",
    trip_id: 101,
    created_at: "2026-01-15T10:30:00Z",
  },
  {
    id: 2,
    vehicle_id: 2,
    vehicle: { registration_number: "KA-02-CD-5678", model: "Ashok Leyland Dost" },
    date: "2026-01-14",
    liters: 60.0,
    cost_per_liter: 92.8,
    total_cost: 5568,
    odometer_reading: 28340,
    fuel_type: "Diesel",
    station_name: "HP - Indiranagar",
    trip_id: 102,
    created_at: "2026-01-14T14:15:00Z",
  },
  {
    id: 3,
    vehicle_id: 3,
    vehicle: { registration_number: "DL-03-EF-9012", model: "Eicher Pro 2049" },
    date: "2026-01-13",
    liters: 75.2,
    cost_per_liter: 93.2,
    total_cost: 7009,
    odometer_reading: 18950,
    fuel_type: "Diesel",
    station_name: "Bharat Petroleum - Noida",
    trip_id: 103,
    created_at: "2026-01-13T09:00:00Z",
  },
  {
    id: 4,
    vehicle_id: 4,
    vehicle: { registration_number: "TS-04-GH-3456", model: "BharatBenz 914" },
    date: "2026-01-12",
    liters: 38.7,
    cost_per_liter: 95.0,
    total_cost: 3677,
    odometer_reading: 31670,
    fuel_type: "Diesel",
    station_name: "Indian Oil - Secunderabad",
    trip_id: 104,
    created_at: "2026-01-12T11:45:00Z",
  },
  {
    id: 5,
    vehicle_id: 5,
    vehicle: { registration_number: "WB-05-IJ-7890", model: "Tata LPT 1109" },
    date: "2026-01-11",
    liters: 52.3,
    cost_per_liter: 91.5,
    total_cost: 4785,
    odometer_reading: 22180,
    fuel_type: "Diesel",
    station_name: "HP - Salt Lake",
    trip_id: 105,
    created_at: "2026-01-11T16:20:00Z",
  },
  {
    id: 6,
    vehicle_id: 6,
    vehicle: { registration_number: "GJ-06-KL-1234", model: "Ashok Leyland 3120" },
    date: "2026-01-10",
    liters: 68.9,
    cost_per_liter: 93.8,
    total_cost: 6463,
    odometer_reading: 19870,
    fuel_type: "Diesel",
    station_name: "Bharat Petroleum - Ahmedabad",
    trip_id: 106,
    created_at: "2026-01-10T08:30:00Z",
  },
  {
    id: 7,
    vehicle_id: 7,
    vehicle: { registration_number: "TN-07-MN-5678", model: "Eicher Pro 3010" },
    date: "2026-01-09",
    liters: 42.1,
    cost_per_liter: 94.2,
    total_cost: 3966,
    odometer_reading: 26750,
    fuel_type: "Diesel",
    station_name: "Indian Oil - Chennai",
    trip_id: 107,
    created_at: "2026-01-09T13:10:00Z",
  },
  {
    id: 8,
    vehicle_id: 8,
    vehicle: { registration_number: "MH-08-OP-9012", model: "BharatBenz 2623" },
    date: "2026-01-08",
    liters: 83.5,
    cost_per_liter: 92.0,
    total_cost: 7682,
    odometer_reading: 14250,
    fuel_type: "Diesel",
    station_name: "HP - Pune",
    trip_id: 108,
    created_at: "2026-01-08T15:45:00Z",
  },
  {
    id: 9,
    vehicle_id: 1,
    vehicle: { registration_number: "MH-01-AB-1234", model: "Tata Ace" },
    date: "2026-01-07",
    liters: 35.8,
    cost_per_liter: 94.5,
    total_cost: 3383,
    odometer_reading: 15890,
    fuel_type: "Diesel",
    station_name: "Bharat Petroleum - Goregaon",
    trip_id: 109,
    created_at: "2026-01-07T10:00:00Z",
  },
  {
    id: 10,
    vehicle_id: 3,
    vehicle: { registration_number: "DL-03-EF-9012", model: "Eicher Pro 2049" },
    date: "2026-01-06",
    liters: 55.6,
    cost_per_liter: 93.5,
    total_cost: 5200,
    odometer_reading: 19200,
    fuel_type: "Diesel",
    station_name: "Indian Oil - Gurgaon",
    trip_id: 110,
    created_at: "2026-01-06T12:30:00Z",
  },
];

// Generate monthly fuel expense data for charts
const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => ({
    month,
    fuelCost: Math.round(15000 + Math.random() * 25000),
    fuelLiters: Math.round(150 + Math.random() * 300),
    avgPrice: Number((88 + Math.random() * 12).toFixed(1)),
    vehiclesFilled: Math.floor(3 + Math.random() * 8),
  }));
};

// Generate fuel efficiency data by vehicle
const generateEfficiencyData = () => {
  return [
    { vehicle: "Tata Ace", efficiency: 12.5, fuelCost: 4300, trips: 8 },
    { vehicle: "Ashok Leyland", efficiency: 8.3, fuelCost: 5568, trips: 6 },
    { vehicle: "Eicher Pro", efficiency: 10.1, fuelCost: 7009, trips: 10 },
    { vehicle: "BharatBenz", efficiency: 7.8, fuelCost: 3677, trips: 5 },
    { vehicle: "Mahindra", efficiency: 9.6, fuelCost: 4785, trips: 7 },
  ];
};

// Generate fuel type distribution
const generateFuelTypeData = () => {
  return [
    { name: "Diesel", value: 85, cost: 52000 },
    { name: "Petrol", value: 10, cost: 6000 },
    { name: "CNG", value: 5, cost: 3000 },
  ];
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// Set this to false to use real API, true to use dummy data
const USE_DUMMY_DATA = true;

const FuelExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [useDummyData, setUseDummyData] = useState(USE_DUMMY_DATA);
  const [timeRange, setTimeRange] = useState("month");
  const [filters, setFilters] = useState({
    fuel_type: "",
    vehicle_id: "",
  });

  // Chart data
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());
  const [efficiencyData, setEfficiencyData] = useState(generateEfficiencyData());
  const [fuelTypeData, setFuelTypeData] = useState(generateFuelTypeData());

  useEffect(() => {
    fetchExpenses();
  }, [timeRange]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      if (useDummyData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExpenses(DUMMY_FUEL_EXPENSES);
        setError("");
      } else {
        const response = await api.get(`/fuel-expenses?range=${timeRange}`);
        setExpenses(response.data.data || []);
      }
    } catch (err) {
      if (!useDummyData) {
        console.warn("API failed, falling back to dummy data");
        setExpenses(DUMMY_FUEL_EXPENSES);
        setError("Using demo data (API connection failed)");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load fuel expenses");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;

    if (useDummyData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExpenses(expenses.filter(expense => expense.id !== id));
      setSuccess("Expense record deleted successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      await api.delete(`/fuel-expenses/${id}`);
      setSuccess("Expense record deleted successfully");
      fetchExpenses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete record");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate summary statistics
  const totalFuelCost = expenses.reduce((sum, e) => sum + e.total_cost, 0);
  const totalLiters = expenses.reduce((sum, e) => sum + e.liters, 0);
  const avgPrice = totalLiters > 0 ? totalFuelCost / totalLiters : 0;
  const uniqueVehicles = new Set(expenses.map(e => e.vehicle_id)).size;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.vehicle?.registration_number
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      expense.station_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFuelType = filters.fuel_type ? expense.fuel_type === filters.fuel_type : true;
    const matchesVehicle = filters.vehicle_id
      ? expense.vehicle_id === parseInt(filters.vehicle_id)
      : true;

    return matchesSearch && matchesFuelType && matchesVehicle;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fuel Expenses</h1>
          <p className="text-gray-500">Track and manage fuel costs for your fleet</p>
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
          <span>Add Fuel Entry</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess("")} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Fuel Cost</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalFuelCost)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {expenses.length} transactions
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Fuel (Liters)</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalLiters.toFixed(1)} L
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {uniqueVehicles} vehicles
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Fuel className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Price/L</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{avgPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {avgPrice > 90 ? "↑ Above average" : "↓ Below average"}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Cost per Trip</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalFuelCost / Math.max(expenses.length, 1))}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {expenses.filter(e => e.trip_id).length} trips with fuel
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Fuel Cost Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Fuel Cost Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="fuelCost"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Fuel Cost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Efficiency by Vehicle */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Fuel Efficiency by Vehicle
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis unit=" km/L" />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" fill="#10B981" name="km/L" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Type Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Fuel Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fuelTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fuelTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Fuel Volume & Price */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Fuel Volume & Price
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" unit=" L" />
              <YAxis yAxisId="right" orientation="right" unit=" ₹" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fuelLiters"
                stroke="#3B82F6"
                name="Liters"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgPrice"
                stroke="#F59E0B"
                name="Avg Price/L"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by vehicle or station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.fuel_type}
            onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Fuel Types</option>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="CNG">CNG</option>
          </select>
          <select
            value={filters.vehicle_id}
            onChange={(e) => setFilters({ ...filters, vehicle_id: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vehicles</option>
            {Array.from(new Set(expenses.map(e => e.vehicle_id))).map(id => {
              const vehicle = expenses.find(e => e.vehicle_id === id)?.vehicle;
              return vehicle ? (
                <option key={id} value={id}>
                  {vehicle.registration_number}
                </option>
              ) : null;
            })}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.vehicle?.registration_number || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {expense.vehicle?.model || ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {expense.station_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.liters} L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ₹{expense.cost_per_liter.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(expense.total_cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      expense.fuel_type === "Diesel" ? "bg-blue-100 text-blue-800" :
                      expense.fuel_type === "Petrol" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {expense.fuel_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingExpense(expense);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Fuel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No fuel expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredExpenses.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Showing {filteredExpenses.length} of {expenses.length} entries
              </span>
              <div className="flex space-x-4">
                <span className="font-medium text-gray-700">
                  Total: {formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.total_cost, 0))}
                </span>
                <span className="font-medium text-gray-700">
                  Liters: {filteredExpenses.reduce((sum, e) => sum + e.liters, 0).toFixed(1)} L
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fuel Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Placeholder for FuelExpenseForm component */}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingExpense ? "Edit Fuel Expense" : "Add Fuel Expense"}
              </h2>
              <p className="text-gray-500 mb-4">
                {editingExpense ? "Update fuel expense details" : "Record a new fuel expense entry"}
              </p>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close Form (Implement FuelExpenseForm component)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelExpenses;