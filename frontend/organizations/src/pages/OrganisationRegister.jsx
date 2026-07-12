import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users2,
  UserRound,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (value) => {
    setFormData((prev) => ({ ...prev, is_registered: value }));
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
        body: JSON.stringify({
          ...formData,
          is_registered: formData.is_registered === "true",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ type: "error", message: data.message || "Registration failed. Please try again." });
        setLoading(false);
        return;
      }

      setNotice({ type: "success", message: "Organization registered successfully." });
      setSubmitted(true);

      setTimeout(() => {
        navigate("/organisation");
      }, 900);
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", message: "Something went wrong. Check your connection and try again." });
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

  const inputClasses =
    "w-full text-[14.5px] text-[#101828] placeholder:text-[#A0A8B8] bg-white border border-[#DEE1E8] rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition duration-150 focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/12 focus:shadow-[0_1px_2px_rgba(16,24,40,0.04)] disabled:bg-[#F9FAFB] disabled:text-[#98A2B3]";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-14"
      style={{
        backgroundColor: "#F3F4F8",
        backgroundImage:
          "radial-gradient(circle at 1.5px 1.5px, rgba(76,79,206,0.08) 1.5px, transparent 0), radial-gradient(900px 500px at 15% -10%, rgba(76,79,206,0.10), transparent 60%)",
        backgroundSize: "28px 28px, auto",
      }}
    >
      <div className="w-full max-w-[580px]">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[13px] text-[#8A93A6] tracking-wide">
            Workspace <span className="mx-1.5 text-[#CBD0DC]">/</span> Organizations{" "}
            <span className="mx-1.5 text-[#CBD0DC]">/</span>
            <span className="text-[#4C4FCE] font-medium"> New</span>
          </div>
          <div className="text-[12px] text-[#A0A8B8] font-medium tabular-nums">
            {String(filledCount).padStart(2, "0")} / {String(FIELD_COUNT).padStart(2, "0")}
          </div>
        </div>

        <div className="relative bg-white border border-[#E7E9EF] rounded-2xl shadow-[0_2px_4px_rgba(16,24,40,0.04),0_20px_40px_-16px_rgba(76,79,206,0.22)] overflow-hidden transition-shadow duration-300">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#4C4FCE] via-[#8B7FF5] to-[#17A398]" />

          {submitted && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-full bg-[#17A398]/10 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[#17A398]" />
              </div>
              <div className="text-[15px] font-semibold text-[#101828]">Organization registered</div>
              <div className="text-[13px] text-[#8A93A6]">Redirecting…</div>
            </div>
          )}

          <fieldset disabled={loading || submitted} className="border-0 p-0 m-0 min-w-0">
            <div className="px-9 pt-8 pb-7 border-b border-[#EDEEF3]">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h1 className="text-[23px] font-semibold text-[#101828] tracking-[-0.015em]">
                    Register your organization
                  </h1>
                  <p className="text-[14px] text-[#667085] mt-1.5 leading-relaxed max-w-[38ch]">
                    Provide your organization's details to add it to the registry.
                  </p>
                </div>
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4C4FCE] to-[#8B7FF5] flex items-center justify-center text-white text-xl font-semibold shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)]">
                  {formData.organization_name.trim() ? formData.organization_name.trim().charAt(0).toUpperCase() : <Building2 size={20} strokeWidth={2} />}
                </div>
              </div>

              <div className="mt-7">
                <div className="h-[7px] w-full bg-[#EEF0F4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      complete ? "bg-[#17A398]" : "bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[12.5px]">
                  {complete ? (
                    <>
                      <CheckCircle2 size={14} className="text-[#17A398]" />
                      <span className="text-[#17A398] font-medium">All fields complete</span>
                    </>
                  ) : (
                    <span className="text-[#8A93A6]">{filledCount} of {FIELD_COUNT} fields complete</span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-9 py-7">
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="text-[11.5px] font-semibold text-white bg-[#4C4FCE] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                    01
                  </span>
                  <span className="text-[13px] font-semibold text-[#101828] uppercase tracking-[0.04em]">
                    Organization details
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#EDEEF3] to-transparent" />
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                      Organization name
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B8]" />
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
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                        Organization type
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B8] pointer-events-none" />
                        <select
                          name="organization_type"
                          value={formData.organization_type}
                          onChange={handleChange}
                          required
                          className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%23A0A8B8%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.9rem_center] pr-9`}
                        >
                          <option value="">Select</option>
                          <option value="NGO">NGO</option>
                          <option value="Company">Company</option>
                          <option value="Startup">Startup</option>
                          <option value="School">School</option>
                          <option value="College">College</option>
                          <option value="Hospital">Hospital</option>
                          <option value="Trust">Trust</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                        Workforce size
                      </label>
                      <div className="relative">
                        <Users2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B8] pointer-events-none" />
                        <select
                          name="number_of_workers"
                          value={formData.number_of_workers}
                          onChange={handleChange}
                          required
                          className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%23A0A8B8%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.9rem_center] pr-9`}
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
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">Owner name</label>
                    <div className="relative">
                      <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B8]" />
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

              <div className="px-9 py-7 border-t border-[#EDEEF3]">
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="text-[11.5px] font-semibold text-white bg-[#17A398] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                    02
                  </span>
                  <span className="text-[13px] font-semibold text-[#101828] uppercase tracking-[0.04em]">
                    Account access
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#EDEEF3] to-transparent" />
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">Password</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A8B8]" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={`${inputClasses.replace("focus:border-[#4C4FCE] focus:ring-[#4C4FCE]/12", "")} focus:border-[#17A398] focus:ring-[3px] focus:ring-[#17A398]/12`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                      Is the organization already registered?
                    </label>
                    <div className="inline-flex rounded-lg border border-[#DEE1E8] p-0.5 bg-[#FAFAFC]">
                      {[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleToggle(opt.value)}
                          className={`px-5 py-1.5 rounded-md text-[13.5px] font-medium transition duration-150 ${
                            formData.is_registered === opt.value
                              ? "bg-[#17A398] text-white shadow-[0_2px_6px_-1px_rgba(23,163,152,0.5)]"
                              : "text-[#667085] border border-transparent hover:text-[#101828]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-9 py-6 border-t border-[#EDEEF3] flex items-center justify-between gap-4 bg-[#FCFCFD]">
                <div className="text-[12.5px] min-h-[18px] flex items-center gap-1.5">
                  {notice ? (
                    <>
                      {notice.type === "error" ? (
                        <AlertCircle size={14} className="text-[#D0403A]" />
                      ) : (
                        <CheckCircle2 size={14} className="text-[#17A398]" />
                      )}
                      <span className={notice.type === "error" ? "text-[#D0403A] font-medium" : "text-[#17A398] font-medium"}>
                        {notice.message}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#A0A8B8]">You can edit these details later.</span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="group shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4C4FCE] to-[#8B7FF5] text-white text-[14px] font-medium shadow-[0_6px_16px_-4px_rgba(76,79,206,0.5)] transition duration-200 hover:shadow-[0_8px_20px_-4px_rgba(76,79,206,0.6)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                >
                  {loading ? "Registering…" : submitted ? "Registered" : "Register organization"}
                  {!loading && !submitted && (
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  );
}