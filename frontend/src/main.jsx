import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ControlsPage from "./pages/ControlsPage.jsx";
import CreateControlPage from "./pages/CreateControlPage.jsx";
import ControlCategory from "./pages/ControlCategory.jsx";
import AddCompliance from "./pages/AddCompliance.jsx";
import ComplianceControlsTable from "./pages/ComplianceControlsTable.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/controls" element={<ControlsPage />} />
        <Route path="/controls/create" element={<CreateControlPage />} />
        <Route path="/controls/create/:id" element={<CreateControlPage />} />
        <Route path="/control-category" element={<ControlCategory />} />
        <Route path="/compliance/add" element={<AddCompliance />} />
        <Route path="/compliance/:name" element={<ComplianceControlsTable />} />
        <Route path="/compliance/:name/controls" element={<ComplianceControlsTable />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
