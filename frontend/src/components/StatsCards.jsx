// src/components/StatsCards.jsx
//
// Summary metrics for the fleet. Each card carries a thin "route line"
// accent along its base — a nod to a transit line map, colored per metric.

import { Truck, CircleCheck, Navigation, Wrench } from "lucide-react";

function RouteLine({ colorClass }) {
  return (
    <svg viewBox="0 0 120 8" className="mt-4 w-full" preserveAspectRatio="none">
      <line
        x1="0"
        y1="4"
        x2="120"
        y2="4"
        strokeWidth="2"
        strokeDasharray="1 7"
        strokeLinecap="round"
        className={colorClass}
        stroke="currentColor"
      />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, colorClass, iconBg }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#12151B] p-5 transition-colors duration-200 hover:border-white/[0.12]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#5A6272]">
            {label}
          </p>
          <p className="mt-2 font-[Space_Grotesk] text-3xl font-semibold tabular-nums text-[#E8EAED]">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </div>
      <RouteLine colorClass={colorClass} />
    </div>
  );
}

export default function StatsCards({ vehicles }) {
  const total = vehicles.length;
  const available = vehicles.filter((v) => v.status === "Available").length;
  const onTrip = vehicles.filter((v) => v.status === "On Trip").length;
  const maintenance = vehicles.filter((v) => v.status === "Maintenance").length;

  const stats = [
    {
      label: "Total Vehicles",
      value: total,
      icon: Truck,
      colorClass: "text-[#8B93A1]",
      iconBg: "bg-white/[0.06]",
    },
    {
      label: "Available",
      value: available,
      icon: CircleCheck,
      colorClass: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
    },
    {
      label: "On Trip",
      value: onTrip,
      icon: Navigation,
      colorClass: "text-[#4C8DFF]",
      iconBg: "bg-[#4C8DFF]/10",
    },
    {
      label: "Maintenance",
      value: maintenance,
      icon: Wrench,
      colorClass: "text-amber-400",
      iconBg: "bg-amber-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
