// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Truck, Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organization_name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.organization_name || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/organization/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess("AUTHENTICATED. REDIRECTING...");
        localStorage.setItem("organization", JSON.stringify(response.data.organization));
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "LOGIN FAILED. INVALID CREDENTIALS.");
      } else if (err.request) {
        setError("NETWORK ERROR. SERVICE UNREACHABLE.");
      } else {
        setError("AN UNEXPECTED ERROR OCCURRED.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-6 font-mono selection:bg-zinc-800 selection:text-white">
      <div className="w-full max-w-md border border-zinc-800 bg-[#121212] p-8 uppercase tracking-wider">
        
        {/* Header & Logo */}
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="h-6 w-6 text-zinc-400" strokeWidth={1.5} />
            <h1 className="text-xl font-bold tracking-widest text-white">TransitOps</h1>
          </div>
          <p className="text-[10px] text-zinc-500 font-sans tracking-normal lowercase">
            // Smart Transport Operations Platform
          </p>
        </div>

        {/* Feedback Status Layout */}
        {error && (
          <div className="mb-6 p-4 border border-red-900 bg-red-950/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" strokeWidth={1.5} />
            <p className="text-xs font-medium text-red-400 leading-normal">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 border border-emerald-900 bg-emerald-950/20">
            <p className="text-xs font-medium text-emerald-400 text-center">{success}</p>
          </div>
        )}

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="organization_name" className="block text-xs font-semibold text-zinc-400 mb-2">
              Organization ID / Name
            </label>
            <input
              type="text"
              id="organization_name"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              className="w-full bg-[#18181b] px-4 py-3 border border-zinc-800 text-white text-sm tracking-normal focus:outline-none focus:border-zinc-400 focus:bg-[#1f1f23] transition-colors rounded-none placeholder:text-zinc-600"
              placeholder="ENTER ORG NAME"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#18181b] px-4 py-3 border border-zinc-800 text-white text-sm tracking-normal focus:outline-none focus:border-zinc-400 focus:bg-[#1f1f23] transition-colors pr-12 rounded-none placeholder:text-zinc-600"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 text-zinc-900 py-3 font-semibold text-sm hover:bg-white active:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-none flex items-center justify-center gap-2 border border-transparent"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESSING...
              </>
            ) : (
              "INITIALIZE SYSTEM SIGN-IN"
            )}
          </button>
        </form>

        {/* Utility Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center space-y-3">
          <p className="text-[11px] text-zinc-500 normal-case font-sans">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-zinc-300 hover:text-white font-medium underline underline-offset-4 uppercase tracking-wider text-[10px] ml-1"
            >
              Register Organization
            </button>
          </p>
          <p className="text-[9px] text-zinc-600 font-mono tracking-tight">
            SYS.REF // {new Date().getFullYear()} TRANSITOPS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;