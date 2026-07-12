import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";

export default function OrganisationDashboard() {
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/organization/me",
        {
          credentials: "include",
        }
      );

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
      await fetch(
        "http://localhost:5000/api/organization/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("organization");

      navigate("/organisation/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-8 py-5 flex justify-between items-center shadow">

        <h1 className="text-3xl font-bold">
          Organization Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Organization Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">

          <h2 className="text-4xl font-bold mb-8">
            Welcome {organization.organization_name} 👋
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">

            <div>
              <span className="font-semibold">Owner Name:</span>
              <p>{organization.owner_name}</p>
            </div>

            <div>
              <span className="font-semibold">Organization Type:</span>
              <p>{organization.organization_type}</p>
            </div>

            <div>
              <span className="font-semibold">Workers:</span>
              <p>{organization.number_of_workers}</p>
            </div>

            <div>
              <span className="font-semibold">Registered:</span>
              <p>
                {organization.is_registered ? "Yes" : "No"}
              </p>
            </div>

          </div>

        </div>

        {/* Employee Section */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold mb-2">
            Register Organization Employees
          </h2>

          <p className="text-gray-600 mb-8">
            Create login credentials for each department role.
          </p>

        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <EmployeeCard role="Fleet Manager" />

          <EmployeeCard role="Dispatcher" />

          <EmployeeCard role="Safety Officer" />

          <EmployeeCard role="Financial Analyst" />

        </div>

      </div>

    </div>
  );
}