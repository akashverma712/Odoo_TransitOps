import { useState } from "react";
import { UserRound, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function EmployeeCard({ role, theme = "light" }) {
  const dark = theme === "dark";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (notice) setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("http://localhost:5000/api/organization/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ type: "error", message: data.message || `Could not create ${role}.` });
        return;
      }

      setNotice({ type: "success", message: `${role} created successfully.` });

      setFormData({
        full_name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", message: "Something went wrong. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const cardBg = dark ? "bg-[#12141F] border-[#232838]" : "bg-white border-[#E7E9EF]";
  const dividerColor = dark ? "border-[#232838]" : "border-[#EDEEF3]";
  const footerBg = dark ? "bg-[#0F111A]" : "bg-[#FCFCFD]";
  const labelColor = dark ? "text-[#B7BECC]" : "text-[#344054]";
  const eyebrowColor = dark ? "text-[#6B7386]" : "text-[#8A93A6]";
  const headingColor = dark ? "text-[#F3F4F8]" : "text-[#101828]";
  const inputBase = dark
    ? "bg-[#191C29] border-[#2A2F41] text-[#F3F4F8] placeholder:text-[#5B627A]"
    : "bg-white border-[#DEE1E8] text-[#101828] placeholder:text-[#A0A8B8]";
  const iconColor = dark ? "text-[#5B627A]" : "text-[#A0A8B8]";

  const inputClasses = `w-full text-[14.5px] ${inputBase} rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition duration-150 focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/20`;

  return (
    <div className={`${cardBg} border rounded-2xl shadow-[0_2px_4px_rgba(16,24,40,0.04),0_16px_32px_-16px_rgba(76,79,206,0.2)] overflow-hidden max-w-[420px] w-full`}>
      <div className="h-[3px] w-full bg-gradient-to-r from-[#4C4FCE] via-[#8B7FF5] to-[#17A398]" />

      <div className={`px-7 pt-7 pb-6 border-b ${dividerColor} flex items-center gap-3.5`}>
        <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#4C4FCE] to-[#8B7FF5] flex items-center justify-center text-white shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)]">
          <UserRound size={19} strokeWidth={2} />
        </div>
        <div>
          <div className={`text-[11.5px] font-medium ${eyebrowColor} uppercase tracking-[0.06em]`}>New member</div>
          <h2 className={`text-[19px] font-semibold ${headingColor} tracking-[-0.01em] leading-tight`}>
            {role}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-7 py-6 flex flex-col gap-5">
          <div>
            <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>Full name</label>
            <div className="relative">
              <UserRound size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Jordan Blake"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[13px] font-medium ${labelColor} mb-1.5`}>Email</label>
            <div className="relative">
              <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="jordan@company.com"
                className={inputClasses}
              />
            </div>
          </div>

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
                className={`${inputClasses.replace("focus:border-[#4C4FCE] focus:ring-[#4C4FCE]/20", "")} focus:border-[#17A398] focus:ring-[3px] focus:ring-[#17A398]/20`}
              />
            </div>
          </div>
        </div>

        <div className={`px-7 py-5 border-t ${dividerColor} ${footerBg} flex flex-col gap-3`}>
          {notice && (
            <div className="flex items-center gap-1.5 text-[12.5px]">
              {notice.type === "error" ? (
                <AlertCircle size={14} className="text-[#E5534B] shrink-0" />
              ) : (
                <CheckCircle2 size={14} className="text-[#17A398] shrink-0" />
              )}
              <span className={notice.type === "error" ? "text-[#E5534B] font-medium" : "text-[#17A398] font-medium"}>
                {notice.message}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5] text-white text-[14px] font-medium shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)] transition duration-200 hover:shadow-[0_8px_20px_-4px_rgba(76,79,206,0.6)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
          >
            {loading ? "Saving…" : `Create ${role}`}
            {!loading && (
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
