import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import {
  Building2,
  UserRound,
  Users2,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

export default function OrganisationDashboard() {
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const dark = theme === "dark";

  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchOrganization = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/organization/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        navigate("/organisation/login");
        return;
      }

      setOrganization(data.organization);
    } catch (error) {
      console.error(error);
      navigate("/organisation/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/organization/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("organization");
      navigate("/organisation/login");
    } catch (error) {
      console.error(error);
    }
  };

  const pageBg = dark ? "bg-[#0B0E1A]" : "bg-[#F3F4F8]";
  const pageBgImage = dark
    ? "radial-gradient(circle at 1.5px 1.5px, rgba(139,127,245,0.14) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.16), transparent 60%)"
    : "radial-gradient(circle at 1.5px 1.5px, rgba(76,79,206,0.08) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.10), transparent 60%)";

  const cardBg = dark ? "bg-[#12141F] border-[#232838]" : "bg-white border-[#E7E9EF]";
  const dividerColor = dark ? "border-[#232838]" : "border-[#EDEEF3]";
  const navBg = dark ? "bg-[#0B0E1A]/85 border-[#1C2030]" : "bg-white/85 border-[#E7E9EF]";
  const textPrimary = dark ? "text-[#F3F4F8]" : "text-[#101828]";
  const textSecondary = dark ? "text-[#9AA3B5]" : "text-[#667085]";
  const textMuted = dark ? "text-[#6B7386]" : "text-[#8A93A6]";
  const tileBg = dark ? "bg-[#161927] border-[#232838]" : "bg-[#FAFAFC] border-[#EDEEF3]";

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${pageBg}`}>
        <Loader2 size={26} className="animate-spin text-[#4C4FCE]" />
        <div className={`text-[14px] font-medium ${textSecondary}`}>Loading dashboard…</div>
      </div>
    );
  }

  const stats = [
    { label: "Owner", value: organization.owner_name, icon: UserRound },
    { label: "Organization type", value: organization.organization_type, icon: Building2 },
    { label: "Workforce size", value: organization.number_of_workers, icon: Users2 },
    {
      label: "Registered",
      value: organization.is_registered ? "Yes" : "No",
      icon: ShieldCheck,
      accent: organization.is_registered ? "#17A398" : "#98A2B3",
    },
  ];

  return (
    <div
      className={`min-h-screen ${pageBg}`}
      style={{ backgroundImage: pageBgImage, backgroundSize: "28px 28px, auto" }}
    >
      <nav className={`sticky top-0 z-20 backdrop-blur border-b ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4C4FCE] to-[#8B7FF5] flex items-center justify-center text-white shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)]">
              <Building2 size={17} strokeWidth={2} />
            </div>
            <div>
              <div className={`text-[15px] font-semibold ${textPrimary} leading-tight`}>
                Organization Dashboard
              </div>
              <div className={`text-[12px] ${textMuted} leading-tight`}>
                {organization.organization_name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
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

            <button
              onClick={handleLogout}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-[13.5px] font-medium transition ${
                dark
                  ? "border-[#3A2430] text-[#E5534B] hover:bg-[#E5534B]/10"
                  : "border-[#F3D4D2] text-[#D0403A] hover:bg-[#FBEAE6]"
              }`}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`${cardBg} border rounded-2xl shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(76,79,206,0.18)] overflow-hidden mb-10`}>
          <div className="h-[3px] w-full bg-gradient-to-r from-[#4C4FCE] via-[#8B7FF5] to-[#17A398]" />

          <div className="px-8 py-7">
            <div className={`text-[12px] font-medium ${textMuted} uppercase tracking-[0.06em] mb-1.5`}>
              Welcome back
            </div>
            <h1 className={`text-[26px] font-semibold ${textPrimary} tracking-[-0.015em] mb-7`}>
              {organization.organization_name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className={`${tileBg} border rounded-xl px-4 py-4`}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${accent || "#4C4FCE"}1A`, color: accent || "#4C4FCE" }}
                  >
                    <Icon size={15} />
                  </div>
                  <div className={`text-[12px] ${textMuted} mb-1`}>{label}</div>
                  <div className={`text-[15px] font-semibold ${textPrimary} truncate`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-7">
          <h2 className={`text-[21px] font-semibold ${textPrimary} tracking-[-0.01em] mb-1.5`}>
            Register organization employees
          </h2>
          <p className={`text-[14px] ${textSecondary}`}>
            Create login credentials for each department role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmployeeCard role="Fleet Manager" theme={theme} />
          <EmployeeCard role="Dispatcher" theme={theme} />
          <EmployeeCard role="Safety Officer" theme={theme} />
          <EmployeeCard role="Financial Analyst" theme={theme} />
        </div>
      </div>
    </div>
  );
}