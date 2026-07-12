import { useState } from "react";

const FIELD_COUNT = 6;

export default function OrganisationRegister() {
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

      setNotice({ type: "success", message: "Organization registered successfully." });
      resetForm();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF1FB] via-[#F5F6F8] to-[#F5F6F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[560px]">
        <div className="text-[13px] text-[#8A93A6] mb-4 tracking-wide">
          Workspace <span className="mx-1.5 text-[#D0D5DD]">/</span> Organizations{" "}
          <span className="mx-1.5 text-[#D0D5DD]">/</span>
          <span className="text-[#4C4FCE] font-medium"> New</span>
        </div>

        <div className="bg-white border border-[#E3E6EA] rounded-2xl shadow-[0_1px_3px_rgba(16,24,40,0.06),0_10px_30px_-12px_rgba(76,79,206,0.18)] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4C4FCE] via-[#7C6FF0] to-[#17A398]" />

          <div className="px-8 pt-7 pb-6 border-b border-[#E3E6EA]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[22px] font-semibold text-[#101828] tracking-[-0.01em]">
                  Register your organization
                </h1>
                <p className="text-[14px] text-[#667085] mt-1.5 leading-relaxed">
                  Provide your organization's details to add it to the registry.
                </p>
              </div>
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#4C4FCE] to-[#7C6FF0] flex items-center justify-center text-white text-lg font-semibold">
                {formData.organization_name ? formData.organization_name.trim().charAt(0).toUpperCase() : "?"}
              </div>
            </div>

            <div className="mt-6">
              <div className="h-1.5 w-full bg-[#EAECF0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    complete ? "bg-[#17A398]" : "bg-gradient-to-r from-[#4C4FCE] to-[#7C6FF0]"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-[12.5px] text-[#8A93A6] tabular-nums">
                {complete ? (
                  <span className="text-[#17A398] font-medium">All fields complete</span>
                ) : (
                  `${filledCount} of ${FIELD_COUNT} fields complete`
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-8 py-7 bg-[#FAFAFE]">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[12px] font-semibold text-white bg-[#4C4FCE] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  01
                </span>
                <span className="text-[13px] font-semibold text-[#101828]">Organization details</span>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                    Organization name
                  </label>
                  <input
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    required
                    autoComplete="organization"
                    placeholder="Acme Foundation"
                    className="w-full text-[14px] text-[#101828] placeholder:text-[#98A2B3] bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/15 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                      Organization type
                    </label>
                    <select
                      name="organization_type"
                      value={formData.organization_type}
                      onChange={handleChange}
                      required
                      className="w-full text-[14px] text-[#101828] bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/15 transition appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%2398A2B3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.9rem_center] pr-9"
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
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                      Workforce size
                    </label>
                    <select
                      name="number_of_workers"
                      value={formData.number_of_workers}
                      onChange={handleChange}
                      required
                      className="w-full text-[14px] text-[#101828] bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/15 transition appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%3E%3Cpath%20d%3D%22M1%201L7%206.5L13%201%22%20stroke%3D%22%2398A2B3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.9rem_center] pr-9"
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
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">Owner name</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Jordan Blake"
                    className="w-full text-[14px] text-[#101828] placeholder:text-[#98A2B3] bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4C4FCE] focus:ring-[3px] focus:ring-[#4C4FCE]/15 transition"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-7 border-t border-[#E3E6EA] bg-[#F7FDFC]">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[12px] font-semibold text-white bg-[#17A398] rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  02
                </span>
                <span className="text-[13px] font-semibold text-[#101828]">Account access</span>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full text-[14px] text-[#101828] placeholder:text-[#98A2B3] bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#17A398] focus:ring-[3px] focus:ring-[#17A398]/15 transition"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-2">
                    Is the organization already registered?
                  </label>
                  <div className="inline-flex rounded-lg border border-[#D0D5DD] p-0.5 bg-white">
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
                            : "text-[#667085] border border-transparent"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#E3E6EA] flex items-center justify-between gap-4 bg-white">
              <div className="text-[12.5px] text-[#8A93A6] min-h-[18px]">
                {notice ? (
                  <span className={notice.type === "error" ? "text-[#D0403A] font-medium" : "text-[#17A398] font-medium"}>
                    {notice.message}
                  </span>
                ) : (
                  "You can edit these details later."
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4C4FCE] to-[#7C6FF0] text-white text-[14px] font-medium shadow-[0_4px_12px_-2px_rgba(76,79,206,0.45)] transition hover:shadow-[0_6px_16px_-2px_rgba(76,79,206,0.55)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? "Registering…" : "Register organization"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
