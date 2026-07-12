// src/components/reports/Reports.jsx
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
} from "recharts";
import { Download, FileText, TrendingUp, DollarSign, Fuel } from "lucide-react";
import api from "../../config/axios";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import ReportExport from "./ReportExport";

// Dummy data for testing
const DUMMY_REPORT_DATA = {
  fuelEfficiency: [
    { vehicle: "Tata Ace", efficiency: 12.5 },
    { vehicle: "Ashok Leyland", efficiency: 8.3 },
    { vehicle: "Eicher Pro", efficiency: 10.1 },
    { vehicle: "BharatBenz", efficiency: 7.8 },
    { vehicle: "Mahindra", efficiency: 9.6 },
  ],
  operationalCost: [
    { name: "Fuel", value: 45000 },
    { name: "Maintenance", value: 28000 },
    { name: "Insurance", value: 15000 },
    { name: "Taxes", value: 12000 },
    { name: "Salaries", value: 35000 },
  ],
  fleetUtilization: [
    { date: "Jan", utilization: 72 },
    { date: "Feb", utilization: 78 },
    { date: "Mar", utilization: 85 },
    { date: "Apr", utilization: 82 },
    { date: "May", utilization: 88 },
    { date: "Jun", utilization: 92 },
    { date: "Jul", utilization: 86 },
    { date: "Aug", utilization: 90 },
    { date: "Sep", utilization: 95 },
    { date: "Oct", utilization: 89 },
    { date: "Nov", utilization: 93 },
    { date: "Dec", utilization: 87 },
  ],
  vehicleROI: [
    { vehicle: "Tata Ace", roi: 32, revenue: 185000, cost: 140000 },
    { vehicle: "Ashok Leyland", roi: 28, revenue: 225000, cost: 175000 },
    { vehicle: "Eicher Pro", roi: 45, revenue: 275000, cost: 190000 },
    { vehicle: "BharatBenz", roi: 22, revenue: 195000, cost: 160000 },
    { vehicle: "Mahindra", roi: 38, revenue: 245000, cost: 178000 },
  ],
  kpis: {
    fleetUtilization: 87,
    fuelEfficiency: 9.6,
    operationalCost: 135000,
    revenue: 1125000,
    totalTrips: 284,
    totalDistance: 45678,
    avgTripDistance: 160.8,
  },
};

// Generate time-based dummy data
const generateTimeBasedData = (range) => {
  const data = { ...DUMMY_REPORT_DATA };
  
  // Adjust KPIs based on time range
  const multipliers = {
    week: 0.25,
    month: 1,
    quarter: 3,
    year: 12,
  };
  
  const mult = multipliers[range] || 1;
  
  data.kpis = {
    fleetUtilization: Math.round(DUMMY_REPORT_DATA.kpis.fleetUtilization * (0.9 + Math.random() * 0.2)),
    fuelEfficiency: Number((DUMMY_REPORT_DATA.kpis.fuelEfficiency * (0.95 + Math.random() * 0.1)).toFixed(1)),
    operationalCost: Math.round(DUMMY_REPORT_DATA.kpis.operationalCost * mult * (0.9 + Math.random() * 0.2)),
    revenue: Math.round(DUMMY_REPORT_DATA.kpis.revenue * mult * (0.9 + Math.random() * 0.2)),
    totalTrips: Math.round(DUMMY_REPORT_DATA.kpis.totalTrips * mult * (0.9 + Math.random() * 0.2)),
    totalDistance: Math.round(DUMMY_REPORT_DATA.kpis.totalDistance * mult * (0.9 + Math.random() * 0.2)),
    avgTripDistance: Number((DUMMY_REPORT_DATA.kpis.avgTripDistance * (0.95 + Math.random() * 0.1)).toFixed(1)),
  };
  
  // Adjust operational costs based on time range
  data.operationalCost = DUMMY_REPORT_DATA.operationalCost.map(item => ({
    ...item,
    value: Math.round(item.value * mult * (0.9 + Math.random() * 0.2))
  }));
  
  // Generate monthly utilization data based on range
  if (range === 'week') {
    data.fleetUtilization = [
      { date: "Mon", utilization: 78 },
      { date: "Tue", utilization: 82 },
      { date: "Wed", utilization: 85 },
      { date: "Thu", utilization: 80 },
      { date: "Fri", utilization: 88 },
      { date: "Sat", utilization: 72 },
      { date: "Sun", utilization: 65 },
    ];
  } else if (range === 'month') {
    data.fleetUtilization = Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      utilization: Math.round(65 + Math.random() * 30)
    }));
  } else if (range === 'quarter') {
    data.fleetUtilization = [
      { date: "Week 1", utilization: 78 },
      { date: "Week 2", utilization: 82 },
      { date: "Week 3", utilization: 85 },
      { date: "Week 4", utilization: 80 },
      { date: "Week 5", utilization: 88 },
      { date: "Week 6", utilization: 86 },
      { date: "Week 7", utilization: 90 },
      { date: "Week 8", utilization: 87 },
      { date: "Week 9", utilization: 92 },
      { date: "Week 10", utilization: 89 },
      { date: "Week 11", utilization: 91 },
      { date: "Week 12", utilization: 93 },
    ];
  } else {
    data.fleetUtilization = DUMMY_REPORT_DATA.fleetUtilization;
  }
  
  return data;
};

// Set this to false to use real API, true to use dummy data
const USE_DUMMY_DATA = true; // Change this to false when you want to use real API

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(DUMMY_REPORT_DATA);
  const [timeRange, setTimeRange] = useState("month");
  const [useDummyData, setUseDummyData] = useState(USE_DUMMY_DATA);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  useEffect(() => {
    fetchReports(timeRange);
  }, [timeRange]);

  const fetchReports = async (range) => {
    try {
      setLoading(true);
      
      if (useDummyData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = generateTimeBasedData(range);
        setReportData(data);
        setError("");
      } else {
        const response = await api.get(`/reports?range=${range}`);
        setReportData(response.data.data || DUMMY_REPORT_DATA);
      }
    } catch (err) {
      // If API fails, fallback to dummy data
      if (!useDummyData) {
        console.warn("API failed, falling back to dummy data");
        const data = generateTimeBasedData(range);
        setReportData(data);
        setError("Using demo data (API connection failed)");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to load reports");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500">Insights into your fleet operations</p>
          {useDummyData && (
            <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Demo Mode
            </span>
          )}
        </div>
        <div className="flex space-x-3">
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
          <ReportExport data={reportData} />
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fleet Utilization</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.kpis?.fleetUtilization || 0}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {reportData.kpis?.totalTrips || 0} total trips
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Fuel Efficiency</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.kpis?.fuelEfficiency || 0} km/L
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {reportData.kpis?.totalDistance || 0} total km
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
              <p className="text-sm text-gray-500">Operational Cost</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(reportData.kpis?.operationalCost || 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Avg {formatCurrency(reportData.kpis?.operationalCost / (reportData.kpis?.totalTrips || 1))} per trip
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(reportData.kpis?.revenue || 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ROI: {Math.round((reportData.kpis?.revenue / reportData.kpis?.operationalCost - 1) * 100)-521}%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Fuel Efficiency by Vehicle
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.fuelEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis unit=" km/L" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="efficiency" fill="#3B82F6" name="Fuel Efficiency (km/L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Operational Cost Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Operational Cost Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.operationalCost}
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
                {reportData.operationalCost?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                content={<CustomTooltip />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Utilization Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Fleet Utilization Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.fleetUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Utilization %"
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle ROI */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Vehicle ROI Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.vehicleROI}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis yAxisId="left" unit="%" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "ROI") return `${value}%`;
                  return formatCurrency(value);
                }}
                content={<CustomTooltip />}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="roi" fill="#10B981" name="ROI %" />
              <Bar yAxisId="right" dataKey="revenue" fill="#3B82F6" name="Revenue" />
              <Bar yAxisId="right" dataKey="cost" fill="#EF4444" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;