import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, MapPin, 
  Wrench, Fuel, FileBarChart, Settings, 
  LogOut, ChevronLeft, ChevronRight, 
  Bell, User, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vehicles', icon: Truck, label: 'Vehicles' },
    { path: '/drivers', icon: Users, label: 'Drivers' },
    { path: '/trips', icon: MapPin, label: 'Trips' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/fuel', icon: Fuel, label: 'Fuel & Expenses' },
    { path: '/reports', icon: FileBarChart, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const roleBasedMenu = () => {
    // Filter menu based on user role
    if (user?.role === 'Driver') {
      return menuItems.filter(item => 
        ['Dashboard', 'Trips', 'Fuel & Expenses'].includes(item.label)
      );
    }
    if (user?.role === 'Safety Officer') {
      return menuItems.filter(item => 
        ['Dashboard', 'Drivers', 'Reports'].includes(item.label)
      );
    }
    if (user?.role === 'Financial Analyst') {
      return menuItems.filter(item => 
        ['Dashboard', 'Fuel & Expenses', 'Reports'].includes(item.label)
      );
    }
    return menuItems;
  };

  const filteredMenu = roleBasedMenu();

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Truck className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg">TransitOps</span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-400"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Profile */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0) || 'A'}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-slate-400 text-xs truncate">{user?.role || 'Fleet Manager'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <>
              <button className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white">
                <Sun className="w-5 h-5" />
              </button>
            </>
          )}
          <button 
            onClick={logout}
            className={`flex items-center gap-2 text-red-400 hover:text-red-300 transition p-2 rounded-lg hover:bg-red-500/10 ${
              collapsed ? 'justify-center flex-1' : 'flex-1'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;