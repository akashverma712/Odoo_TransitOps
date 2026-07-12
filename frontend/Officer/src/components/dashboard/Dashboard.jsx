import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ Correct import
import { Truck, Users, MapPin, Wrench, Fuel, TrendingUp } from 'lucide-react';

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
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const cardData = [
    { 
      label: 'Active Vehicles', 
      value: stats.activeVehicles, 
      icon: Truck, 
      color: 'blue',
      subtitle: `${stats.availableVehicles} available`
    },
    { 
      label: 'Vehicles in Maintenance', 
      value: stats.vehiclesInMaintenance, 
      icon: Wrench, 
      color: 'yellow',
      subtitle: 'Currently in shop'
    },
    { 
      label: 'Active Trips', 
      value: stats.activeTrips, 
      icon: MapPin, 
      color: 'green',
      subtitle: `${stats.pendingTrips} pending`
    },
    { 
      label: 'Drivers On Duty', 
      value: stats.driversOnDuty, 
      icon: Users, 
      color: 'purple',
      subtitle: 'Currently active'
    },
    { 
      label: 'Fleet Utilization', 
      value: `${stats.fleetUtilization}%`, 
      icon: TrendingUp, 
      color: 'indigo',
      subtitle: 'Operational efficiency'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Here's what's happening with your fleet today
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`bg-white/5 rounded-xl p-6 border ${colorClasses[card.color]} backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{card.label}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
                <p className="text-xs opacity-70 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-2 rounded-lg ${colorClasses[card.color]}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {[
              { id: 1, from: 'Mumbai', to: 'Pune', vehicle: 'Van-01', driver: 'Alex', status: 'Completed' },
              { id: 2, from: 'Delhi', to: 'Jaipur', vehicle: 'Truck-03', driver: 'Sarah', status: 'In Progress' },
              { id: 3, from: 'Bangalore', to: 'Chennai', vehicle: 'Van-05', driver: 'Mike', status: 'Pending' },
            ].map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div>
                  <p className="text-white text-sm font-medium">
                    Trip #{trip.id} - {trip.from} to {trip.to}
                  </p>
                  <p className="text-slate-400 text-xs">
                    Vehicle: {trip.vehicle} • Driver: {trip.driver}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  trip.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                  trip.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition">
              <Truck className="w-4 h-4" />
              Create New Trip
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition">
              <Users className="w-4 h-4" />
              Register Driver
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition">
              <Wrench className="w-4 h-4" />
              Schedule Maintenance
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition">
              <Fuel className="w-4 h-4" />
              Log Fuel Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;