import { useState } from "react";

export default function OrganisationRegister() {
  const [formData, setFormData] = useState({
    organization_name: "",
    organization_type: "",
    number_of_workers: "",
    owner_name: "",
    is_registered: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "is_registered"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/organization/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Organization Registered Successfully!");

      setFormData({
        organization_name: "",
        organization_type: "",
        number_of_workers: "",
        owner_name: "",
        is_registered: "",
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-8">
          Organization Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Organization Name
            </label>

            <input
              type="text"
              name="organization_name"
              value={formData.organization_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Organization Type
            </label>

            <select
              name="organization_type"
              value={formData.organization_type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Type</option>
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

          <div>
            <label className="block mb-2 font-medium">
              Number of Workers
            </label>

            <select
              name="number_of_workers"
              value={formData.number_of_workers}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select</option>
              <option value="1-10">1 - 10</option>
              <option value="11-50">11 - 50</option>
              <option value="51-200">51 - 200</option>
              <option value="201-500">201 - 500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Owner Name
            </label>

            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
  <label className="block mb-2 font-medium">
    Password
  </label>

  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

          <div>
            <label className="block mb-2 font-medium">
              Is the organization registered?
            </label>

            <select
              name="is_registered"
              value={String(formData.is_registered)}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Registering..." : "Register Organization"}
          </button>

        </form>
      </div>
    </div>
  );
}