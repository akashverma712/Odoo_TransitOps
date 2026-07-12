import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Truck, Users, MapPin, Wrench, Fuel, TrendingUp, 
  Calendar, CheckCircle, Clock, AlertCircle, ArrowUpRight,
  BarChart3, Activity, MoreVertical, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    activeVehicles: 24,
    availableVehicles: 8,
    vehiclesInMaintenance: 3,
    activeTrips: 12,
    pendingTrips: 5,
    driversOnDuty: 15,
    fleetUtilization: 72,
    totalRevenue: 28450,
    completionRate: 94,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 300, damping: 28 } 
    }
  };

  // Primary Stats Cards (Large)
  const primaryStats = [
    { 
      label: 'Active Vehicles', 
      value: stats.activeVehicles, 
      icon: Truck, 
      trend: '+2',
      trendUp: true,
      subtitle: `${stats.availableVehicles} available`,
      color: 'blue'
    },
    { 
      label: 'Active Trips', 
      value: stats.activeTrips, 
      icon: MapPin, 
      trend: '+5',
      trendUp: true,
      subtitle: `${stats.pendingTrips} pending`,
      color: 'green'
    },
    { 
      label: 'Fleet Utilization', 
      value: `${stats.fleetUtilization}%`, 
      icon: TrendingUp, 
      trend: '+4.2%',
      trendUp: true,
      subtitle: 'Operational efficiency',
      color: 'indigo'
    },
    { 
      label: 'Drivers On Duty', 
      value: stats.driversOnDuty, 
      icon: Users, 
      trend: '+1',
      trendUp: true,
      subtitle: 'Currently active',
      color: 'purple'
    },
  ];

  // Secondary Stats Cards (Small)
  const secondaryStats = [
    { 
      label: 'Vehicles in Maintenance', 
      value: stats.vehiclesInMaintenance, 
      icon: Wrench, 
      color: 'yellow',
      status: 'warning'
    },
    { 
      label: 'Completion Rate', 
      value: `${stats.completionRate}%`, 
      icon: CheckCircle, 
      color: 'emerald',
      status: 'success'
    },
    { 
      label: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: BarChart3, 
      color: 'blue',
      status: 'success'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50/80 text-blue-600 border-blue-100/50',
    green: 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50',
    indigo: 'bg-indigo-50/80 text-indigo-600 border-indigo-100/50',
    purple: 'bg-purple-50/80 text-purple-600 border-purple-100/50',
    yellow: 'bg-amber-50/80 text-amber-600 border-amber-100/50',
    emerald: 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100/50 text-blue-600',
    green: 'bg-emerald-100/50 text-emerald-600',
    indigo: 'bg-indigo-100/50 text-indigo-600',
    purple: 'bg-purple-100/50 text-purple-600',
    yellow: 'bg-amber-100/50 text-amber-600',
    emerald: 'bg-emerald-100/50 text-emerald-600',
  };

  const trips = [
    { id: 1, from: 'Mumbai', to: 'Pune', vehicle: 'Van-01', driver: 'Alex', status: 'Completed', time: '2 hours ago' },
    { id: 2, from: 'Delhi', to: 'Jaipur', vehicle: 'Truck-03', driver: 'Sarah', status: 'In Progress', time: '1 hour ago' },
    { id: 3, from: 'Bangalore', to: 'Chennai', vehicle: 'Van-05', driver: 'Mike', status: 'Pending', time: '30 mins ago' },
    { id: 4, from: 'Hyderabad', to: 'Vijayawada', vehicle: 'Truck-07', driver: 'Priya', status: 'Completed', time: '4 hours ago' },
  ];

  const statusColors = {
    'Completed': 'bg-emerald-100/80 text-emerald-700',
    'In Progress': 'bg-blue-100/80 text-blue-700',
    'Pending': 'bg-amber-100/80 text-amber-700',
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 selection:bg-blue-500/20">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
              {getGreeting()}, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-[#8A8FA6] mt-1 text-sm">
              Here's what's happening with your fleet today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-[#4A4F66] text-sm font-medium hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20 text-sm font-medium hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              + New Trip
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6"
      >
        
        {/* Primary Stats - Row 1 (4 columns each) */}
        {primaryStats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500 p-6`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#8A8FA6]">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1A1A2E] mt-1.5 tracking-tight">
                  {stat.value}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-[#A0A7B7]">this month</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${iconBgClasses[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#F0F2F5]">
              <p className="text-xs text-[#A0A7B7]">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}

        {/* Recent Trips Card - Large (7 columns) */}
        <motion.div 
          variants={cardVariants}
          className="col-span-12 lg:col-span-7 bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A2E]">Recent Trips</h3>
              <p className="text-sm text-[#A0A7B7]">Today's fleet movements</p>
            </div>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-2xl hover:bg-[#F0F2F5] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-[#4A4F66]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1A1A2E] font-semibold text-sm truncate">
                      {trip.from} → {trip.to}
                    </p>
                    <p className="text-[#A0A7B7] text-xs">
                      {trip.vehicle} • {trip.driver}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[trip.status]}`}>
                    {trip.status}
                  </span>
                  <span className="text-[#A0A7B7] text-xs hidden sm:inline">{trip.time}</span>
                  <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-[#A0A7B7]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Sidebar - Right Column (5 columns) */}
        <motion.div 
          variants={cardVariants}
          className="col-span-12 lg:col-span-5 space-y-6"
        >
          {/* Secondary Stats - 3 small cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {secondaryStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8A8FA6]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${iconBgClasses[stat.color]}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500 p-6">
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <button className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#F8F9FB] hover:bg-[#F0F2F5] rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100/50 rounded-xl">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">Create New Trip</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A0A7B7] group-hover:text-blue-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#F8F9FB] hover:bg-[#F0F2F5] rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/50 rounded-xl">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">Register Driver</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A0A7B7] group-hover:text-blue-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#F8F9FB] hover:bg-[#F0F2F5] rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100/50 rounded-xl">
                    <Wrench className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">Schedule Maintenance</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A0A7B7] group-hover:text-blue-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#F8F9FB] hover:bg-[#F0F2F5] rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100/50 rounded-xl">
                    <Fuel className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">Log Fuel Expense</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#A0A7B7] group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* System Status Card - Full Width Bottom */}
        <motion.div 
          variants={cardVariants}
          className="col-span-12 bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-shadow duration-500 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50/80 rounded-2xl">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1A1A2E]">System Status</h4>
                <p className="text-xs text-[#A0A7B7]">All systems operational</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-emerald-600">API Response: 42ms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-blue-600">Uptime: 99.98%</span>
              </div>
              <div className="flex-1 min-w-[120px] h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-emerald-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Dashboard;