import { BrowserRouter, Routes, Route } from "react-router-dom";

import OrganisationRegister from "./pages/OrganisationRegister";
import OrganisationLogin from "./pages/OrganisationLogin";
import OrganisationDashboard from "./pages/OrganisationDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/organisation/register"
          element={<OrganisationRegister />}
        />
        <Route
  path="/organisation/login"
  element={<OrganisationLogin />}
/>
<Route
  path="/organisation"
  element={<OrganisationDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;