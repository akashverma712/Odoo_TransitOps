// src/components/common/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, User, Settings, LogOut, Menu, X } from "lucide-react";
import api from "../../config/axios";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/organization/logout");
      localStorage.removeItem("organization");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">TransitOps</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/vehicles" className="text-gray-600 hover:text-blue-600 transition-colors">
              Vehicles
            </Link>
            <Link to="/drivers" className="text-gray-600 hover:text-blue-600 transition-colors">
              Drivers
            </Link>
            <Link to="/trips" className="text-gray-600 hover:text-blue-600 transition-colors">
              Trips
            </Link>
            <Link to="/maintenance" className="text-gray-600 hover:text-blue-600 transition-colors">
              Maintenance
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reports
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">{user?.organization_name || "User"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/vehicles" className="text-gray-600 hover:text-blue-600 transition-colors">
                Vehicles
              </Link>
              <Link to="/drivers" className="text-gray-600 hover:text-blue-600 transition-colors">
                Drivers
              </Link>
              <Link to="/trips" className="text-gray-600 hover:text-blue-600 transition-colors">
                Trips
              </Link>
              <Link to="/maintenance" className="text-gray-600 hover:text-blue-600 transition-colors">
                Maintenance
              </Link>
              <Link to="/reports" className="text-gray-600 hover:text-blue-600 transition-colors">
                Reports
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;