import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import ChartsGrid from "./components/ChartsGrid";
import ControlsTable from "./components/ControlsTable";
import "./assets/styles.css";

const App = () => {
  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <StatsGrid />
        <ChartsGrid />
        <ControlsTable />
      </main>
    </div>
  );
};

export default App;
