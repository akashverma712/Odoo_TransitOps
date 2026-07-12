// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

// Replace with your actual image URL or import
const BG_IMAGE_URL = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop";

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
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.organization)
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed. Please try again.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row overflow-hidden bg-[#050505] font-sans">
      
      {/* ================= BACKGROUND LAYER ================= */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Cinematic Dark Overlay to boost readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/90 backdrop-blur-[2px]"></div>
      </div>

      {/* ================= LEFT SIDE: BRAND HERO (Hidden on Mobile, Visible on LG) ================= */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 xl:p-24 relative z-10">
        
        {/* Decorative Background Glow for Text */}
        <div className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          {/* Brand Pill */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">Secure Fleet Management</span>
          </div>

          {/* MASSIVE EDITORIAL TYPOGRAPHY */}
          <h1 className="text-8xl xl:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
            Transit<span className="text-emerald-400">Ops</span>
          </h1>

          {/* Bold Sub-messaging */}
          <div className="space-y-4">
            <p className="text-2xl text-white/80 font-light tracking-wide">
              Command your logistics, <br /> control your fleet.
            </p>
            <div className="h-px w-24 bg-emerald-400/50 mt-6"></div>
            <p className="text-sm text-white/40 max-w-md leading-relaxed tracking-wide">
              Enterprise-grade transport management platform designed for 
              efficiency, scalability, and real-time operational intelligence.
            </p>
          </div>

          {/* Animated Status Ticker */}
          <div className="mt-12 flex items-center gap-4 text-xs text-white/40 tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM ONLINE
            </span>
            <span className="text-white/20">|</span>
            <span>v3.0.1</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: GLASS FORM ANCHOR ================= */}
      {/* Using animate-in fade-in duration-1000 for the polished entrance effect */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 animate-in fade-in duration-1000">
        
        {/* Glass Form Container - Anchors the right side */}
        <div className="w-full max-w-[480px] relative">
          
          {/* Ambient Reflection / Glow behind the card */}
          <div className="absolute -inset-2 bg-emerald-500/20 rounded-[32px] blur-2xl opacity-40 -z-10"></div>

          {/* The High-End Glass Panel */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-10 xl:p-12 relative group">
            
            {/* Subtle light ray across the top */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Mobile-Only Hero (Visible only on small screens to replace left side) */}
            <div className="lg:hidden text-center mb-10">
              <h1 className="text-5xl font-black text-white tracking-tighter">
                Transit<span className="text-emerald-400">Ops</span>
              </h1>
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2">Fleet Command Center</p>
            </div>

            {/* Form Header */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white tracking-tight">Access Portal</h2>
              <p className="text-white/40 text-sm mt-1 tracking-wide">Enter your credentials to continue</p>
            </div>

            {/* Feedback Messages - Glass style */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-400/20 rounded-2xl">
                <p className="text-sm text-emerald-200 font-medium text-center">{success}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Input Group 1 */}
              <div className="space-y-2">
                <label
                  htmlFor="organization_name"
                  className="block text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase"
                >
                  Organization ID
                </label>
                <input
                  type="text"
                  id="organization_name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 transition-all text-white placeholder-white/20 text-base font-light"
                  placeholder="Enter your org code"
                  disabled={loading}
                />
              </div>

              {/* Input Group 2 */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase"
                >
                  Access Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 transition-all text-white placeholder-white/20 text-base font-light pr-12"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-bold tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Actions */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="text-sm text-white/40 hover:text-emerald-300 transition-colors font-medium flex items-center gap-2 group/reg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/reg:bg-emerald-400 transition-colors"></span>
                Register a new organization
              </button>
              <p className="text-[10px] text-white/10 font-mono tracking-wider">
                SECURE CONNECTION • AES-256
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;