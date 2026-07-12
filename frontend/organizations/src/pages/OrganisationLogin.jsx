import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, KeyRound, ArrowRight, Sun, Moon } from "lucide-react";

export default function OrganisationLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization_name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Theme toggle — same implementation/pattern as OrganisationDashboard.jsx,
  // reused here purely for UI consistency. Does not touch any business logic.
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const dark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/organization/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "organization",
        JSON.stringify(data.organization)
      );

      alert("Login Successful!");

      navigate("/organisation");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // Design tokens — mirrored 1:1 from OrganisationDashboard.jsx /
  // EmployeeCard.jsx so this page reads as part of the same application.
  // ---------------------------------------------------------------------
  const pageBg = dark ? "bg-[#0B0E1A]" : "bg-[#F3F4F8]";
  const pageBgImage = dark
    ? "radial-gradient(circle at 1.5px 1.5px, rgba(139,127,245,0.14) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.16), transparent 60%)"
    : "radial-gradient(circle at 1.5px 1.5px, rgba(76,79,206,0.08) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.10), transparent 60%)";

  const cardBg = dark ? "bg-[#12141F] border-[#232838]" : "bg-white border-[#E7E9EF]";
  const dividerColor = dark ? "border-[#232838]" : "border-[#EDEEF3]";
  const textPrimary = dark ? "text-[#F3F4F8]" : "text-[#101828]";
  const textSecondary = dark ? "text-[#9AA3B5]" : "text-[#667085]";
  const textMuted = dark ? "text-[#6B7386]" : "text-[#8A93A6]";
  const labelColor = dark ? "text-[#B7BECC]" : "text-[#344054]";
  const inputBase = dark
    ? "bg-[#191C29] border-[#2A2F41] text-[#F3F4F8] placeholder:text-[#5B627A]"
    : "bg-white border-[#DEE1E8] text-[#101828] placeholder:text-[#A0A8B8]";
  const iconColor = dark ? "text-[#5B627A]" : "text-[#A0A8B8]";

  const inputClasses = `w-full text-[14.5px] ${inputBase} rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition duration-150 focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/20`;

  return (
    <div
      className={`min-h-screen ${pageBg} flex items-center justify-center px-4 py-12`}
      style={{ backgroundImage: pageBgImage, backgroundSize: "28px 28px, auto" }}
    >
      <div className="w-full max-w-[420px]">
        {/* Theme toggle */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
              dark
                ? "border-[#232838] text-[#9AA3B5] hover:text-[#F3F4F8] hover:border-[#2E3448]"
                : "border-[#DEE1E8] text-[#667085] hover:text-[#101828] hover:border-[#C7CCDA]"
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div
          className={`${cardBg} border rounded-2xl shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(76,79,206,0.18)] overflow-hidden`}
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-[#4C4FCE] via-[#8B7FF5] to-[#17A398]" />

          <div className="px-8 pt-8 pb-7">
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4C4FCE] to-[#8B7FF5] flex items-center justify-center text-white shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)] mb-4">
                <Building2 size={19} strokeWidth={2} />
              </div>
              <div className={`text-[12px] font-medium ${textMuted} uppercase tracking-[0.06em] mb-1.5`}>
                Welcome back
              </div>
              <h1 className={`text-[24px] font-semibold ${textPrimary} tracking-[-0.015em]`}>
                Organization Login
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>
                  Organization Name
                </label>
                <div className="relative">
                  <Building2 size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                  <input
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    required
                    autoComplete="organization"
                    placeholder="Acme Foundation"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>
                  Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 px-5 py-2.5 mt-1 rounded-lg bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5] text-white text-[14.5px] font-medium shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)] transition duration-200 hover:shadow-[0_8px_20px_-4px_rgba(76,79,206,0.6)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              >
                {loading ? "Logging in…" : "Login"}
                {!loading && (
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </button>
            </form>
          </div>

          <div className={`px-8 py-5 border-t ${dividerColor} ${dark ? "bg-[#0F111A]" : "bg-[#FCFCFD]"}`}>
            <p className={`text-[13px] text-center ${textSecondary}`}>
              Need to register your organization?{" "}
              <span className="text-[#4C4FCE] font-medium cursor-pointer hover:underline" onClick={() => navigate("/organisation/register")}>
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}