import React from 'react';
import { 
  Truck, Users, MapPin, Wrench, 
  Activity, AlertCircle, TrendingUp 
} from 'lucide-react';

const KPICards = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Active Vehicles',
      value: data.activeVehicles || 0,
      icon: Truck,
      color: 'blue',
      subtitle: `${data.availableVehicles || 0} available`
    },
    {
      title: 'Vehicles in Maintenance',
      value: data.vehiclesInMaintenance || 0,
      icon: Wrench,
      color: 'yellow',
      subtitle: 'Currently in shop'
    },
    {
      title: 'Active Trips',
      value: data.activeTrips || 0,
      icon: MapPin,
      color: 'green',
      subtitle: `${data.pendingTrips || 0} pending`
    },
    {
      title: 'Drivers On Duty',
      value: data.driversOnDuty || 0,
      icon: Users,
      color: 'purple',
      subtitle: 'Currently active'
    },
    {
      title: 'Fleet Utilization',
      value: `${data.fleetUtilization || 0}%`,
      icon: TrendingUp,
      color: 'indigo',
      subtitle: 'Operational efficiency'
    },
    {
      title: 'Total Trips (Monthly)',
      value: data.totalTripsThisMonth || 0,
      icon: Activity,
      color: 'pink',
      subtitle: 'This month'
    },
    {
      title: 'Fuel Efficiency',
      value: `${data.fuelEfficiency || 0} km/L`,
      icon: Activity,
      color: 'cyan',
      subtitle: 'Average across fleet'
    },
    {
      title: 'Revenue vs Cost',
      value: `₹${(data.revenue - data.operationalCost).toLocaleString()}`,
      icon: TrendingUp,
      color: 'emerald',
      subtitle: `Revenue: ₹${(data.revenue || 0).toLocaleString()}`
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className={`bg-white/5 rounded-xl p-6 border ${colorClasses[card.color]} backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{card.title}</p>
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
  );
};

export default KPICards;