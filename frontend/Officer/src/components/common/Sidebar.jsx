// src/components/common/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  DollarSign,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/vehicles", icon: Truck, label: "Vehicles" },
    { path: "/drivers", icon: Users, label: "Drivers" },
    { path: "/trips", icon: MapPin, label: "Trips" },
    { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    { path: "/expenses", icon: DollarSign, label: "Expenses" },
    { path: "/reports", icon: FileText, label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">TransitOps</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            to="/help"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;