import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, KeyRound, User, Users, ArrowRight, LogIn, Sun, Moon } from "lucide-react";

const FIELD_COUNT = 6;

export default function OrganisationRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization_name: "",
    organization_type: "",
    number_of_workers: "",
    owner_name: "",
    password: "",
    is_registered: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const dark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (value) => {
    setFormData((prev) => ({ ...prev, is_registered: value }));
  };

  const resetForm = () => {
    setFormData({
      organization_name: "",
      organization_type: "",
      number_of_workers: "",
      owner_name: "",
      password: "",
      is_registered: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing =
      !formData.organization_name ||
      !formData.organization_type ||
      !formData.number_of_workers ||
      !formData.owner_name ||
      !formData.password ||
      formData.is_registered === "";

    if (missing) {
      setNotice({ type: "error", message: "Complete all fields before submitting." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("http://localhost:5000/api/organization/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          is_registered: formData.is_registered === "true",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ type: "error", message: data.message || "Registration failed. Please try again." });
        return;
      }

      if (data.organization) {
        localStorage.setItem("organization", JSON.stringify(data.organization));
      }

      resetForm();
      navigate("/organisation");
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", message: "Something went wrong. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const filledCount = [
    formData.organization_name,
    formData.organization_type,
    formData.number_of_workers,
    formData.owner_name,
    formData.password,
    formData.is_registered,
  ].filter((v) => v !== "").length;

  const progress = Math.round((filledCount / FIELD_COUNT) * 100);
  const complete = filledCount === FIELD_COUNT;

  // ---------------------------------------------------------------------
  // Design tokens — mirrored 1:1 from OrganisationLogin.jsx so this page
  // reads as part of the same application.
  // ---------------------------------------------------------------------
  const pageBg = dark ? "bg-[#0B0E1A]" : "bg-[#F3F4F8]";
  const pageBgImage = dark
    ? "radial-gradient(circle at 1.5px 1.5px, rgba(139,127,245,0.14) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.16), transparent 60%)"
    : "radial-gradient(circle at 1.5px 1.5px, rgba(76,79,206,0.08) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.10), transparent 60%)";

  const cardBg = dark ? "bg-[#12141F] border-[#232838]" : "bg-white border-[#E7E9EF]";
  const sectionBg1 = dark ? "bg-[#12141F]" : "bg-[#FAFAFE]";
  const sectionBg2 = dark ? "bg-[#0F1A18]" : "bg-[#F7FDFC]";
  const footerBg = dark ? "bg-[#0F111A]" : "bg-white";
  const dividerColor = dark ? "border-[#232838]" : "border-[#E3E6EA]";
  const textPrimary = dark ? "text-[#F3F4F8]" : "text-[#101828]";
  const textSecondary = dark ? "text-[#9AA3B5]" : "text-[#667085]";
  const textMuted = dark ? "text-[#6B7386]" : "text-[#8A93A6]";
  const labelColor = dark ? "text-[#B7BECC]" : "text-[#344054]";
  const inputBase = dark
    ? "bg-[#191C29] border-[#2A2F41] text-[#F3F4F8] placeholder:text-[#5B627A]"
    : "bg-white border-[#DEE1E8] text-[#101828] placeholder:text-[#A0A8B8]";
  const iconColor = dark ? "text-[#5B627A]" : "text-[#A0A8B8]";
  const trackBg = dark ? "bg-[#232838]" : "bg-[#EAECF0]";
  const toggleWrapBg = dark ? "bg-[#191C29] border-[#2A2F41]" : "bg-white border-[#DEE1E8]";
  const toggleInactiveText = dark ? "text-[#9AA3B5]" : "text-[#667085]";

  const inputClasses = `w-full text-[14px] ${inputBase} rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition duration-150 focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/20`;
  const selectClasses = `w-full text-[14px] ${inputBase} rounded-lg pl-3.5 pr-9 py-2.5 outline-none transition duration-150 appearance-none focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/20 bg-no-repeat bg-[right_0.9rem_center]`;
  const selectArrow = dark
    ? "bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%235B627A%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')]"
    : "bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%2398A2B3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')]";

  return (
    <div
      className={`min-h-screen ${pageBg} flex items-center justify-center px-4 py-12`}
      style={{ backgroundImage: pageBgImage, backgroundSize: "28px 28px, auto" }}
    >
      <div className="w-full max-w-[560px]">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-[13px] ${textMuted} tracking-wide`}>
            Workspace <span className={`mx-1.5 ${dark ? "text-[#3A4054]" : "text-[#D0D5DD]"}`}>/</span> Organizations{" "}
            <span className={`mx-1.5 ${dark ? "text-[#3A4054]" : "text-[#D0D5DD]"}`}>/</span>
            <span className="text-[#4C4FCE] font-medium"> New</span>
          </div>

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
          className={`${cardBg} border rounded-2xl shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(76,79,206,0.18)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_8px_rgba(16,24,40,0.05),0_20px_40px_-16px_rgba(76,79,206,0.24)]`}
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-[#4C4FCE] via-[#8B7FF5] to-[#17A398]" />

          <div className={`px-8 pt-7 pb-6 border-b ${dividerColor}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`text-[12px] font-medium ${textMuted} uppercase tracking-[0.06em] mb-1.5`}>
                  Get started
                </div>
                <h1 className={`text-[22px] font-semibold ${textPrimary} tracking-[-0.01em]`}>
                  Register your organization
                </h1>
                <p className={`text-[14px] ${textSecondary} mt-1.5 leading-relaxed`}>
                  Provide your organization's details to add it to the registry.
                </p>
              </div>
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#4C4FCE] to-[#8B7FF5] flex items-center justify-center text-white text-lg font-semibold shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)]">
                {formData.organization_name ? formData.organization_name.trim().charAt(0).toUpperCase() : "?"}
              </div>
            </div>

            <div className="mt-6">
              <div className={`h-1.5 w-full ${trackBg} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    complete ? "bg-[#17A398]" : "bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={`mt-2 text-[12.5px] ${textMuted} tabular-nums`}>
                {complete ? (
                  <span className="text-[#17A398] font-medium">All fields complete</span>
                ) : (
                  `${filledCount} of ${FIELD_COUNT} fields complete`
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`px-8 py-7 ${sectionBg1}`}>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[12px] font-semibold text-white bg-[#4C4FCE] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  01
                </span>
                <span className={`text-[13px] font-semibold ${textPrimary}`}>Organization details</span>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>
                    Organization name
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>
                      Organization type
                    </label>
                    <select
                      name="organization_type"
                      value={formData.organization_type}
                      onChange={handleChange}
                      required
                      className={`${selectClasses} ${selectArrow}`}
                    >
                      <option value="">Select</option>
                      <option value="Logistics Company">Logistics Company</option>
                      <option value="Transport Company">Transport Company</option>
                      <option value="Courier Service">Courier Service</option>
                      <option value="Freight Forwarder">Freight Forwarder</option>
                      <option value="Construction Company">Construction Company</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>
                      Workforce size
                    </label>
                    <select
                      name="number_of_workers"
                      value={formData.number_of_workers}
                      onChange={handleChange}
                      required
                      className={`${selectClasses} ${selectArrow}`}
                    >
                      <option value="">Select</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>Owner name</label>
                  <div className="relative">
                    <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Jordan Blake"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-8 py-7 border-t ${dividerColor} ${sectionBg2}`}>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[12px] font-semibold text-white bg-[#17A398] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  02
                </span>
                <span className={`text-[13px] font-semibold ${textPrimary}`}>Account access</span>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>Password</label>
                  <div className="relative">
                    <KeyRound size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[13px] font-medium ${labelColor} mb-2 flex items-center gap-1.5`}>
                    <Users size={14} className={iconColor} />
                    Is the organization already registered?
                  </label>
                  <div className={`inline-flex rounded-lg border p-0.5 ${toggleWrapBg}`}>
                    {[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleToggle(opt.value)}
                        className={`px-5 py-1.5 rounded-md text-[13.5px] font-medium transition ${
                          formData.is_registered === opt.value
                            ? "bg-[#17A398] text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]"
                            : `${toggleInactiveText} border border-transparent`
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-8 py-6 border-t ${dividerColor} flex items-center justify-between gap-4 ${footerBg}`}>
              <div className="text-[12.5px] min-h-[18px]">
                {notice ? (
                  <span className={notice.type === "error" ? "text-[#E5484D] font-medium" : "text-[#17A398] font-medium"}>
                    {notice.message}
                  </span>
                ) : (
                  <span className={textMuted}>All fields are required.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5] text-white text-[14px] font-medium shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)] transition duration-200 hover:shadow-[0_8px_20px_-4px_rgba(76,79,206,0.6)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              >
                {loading ? "Registering…" : "Register organization"}
                {!loading && (
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </button>
            </div>
          </form>

          <div className={`px-8 py-5 border-t ${dividerColor} ${dark ? "bg-[#0F111A]" : "bg-[#FCFCFD]"} flex items-center justify-between gap-4`}>
            <p className={`text-[13px] ${textSecondary}`}>
              Already have an organization account?
            </p>
            <button
              type="button"
              onClick={() => navigate("/organisation/login")}
              className={`group shrink-0 flex items-center gap-1.5 text-[13.5px] font-medium px-3.5 py-1.5 rounded-lg border transition ${
                dark
                  ? "border-[#2A2F41] text-[#B7BECC] hover:text-[#F3F4F8] hover:border-[#4C4FCE]/60 hover:bg-[#4C4FCE]/10"
                  : "border-[#DEE1E8] text-[#344054] hover:text-[#4C4FCE] hover:border-[#4C4FCE]/40 hover:bg-[#4C4FCE]/5"
              }`}
            >
              <LogIn size={14} />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
