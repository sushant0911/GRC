import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import ControlsHeader from "../components/Controls/ControlsHeader";
import ControlsTable from "../components/Controls/ControlsTable";
import "./../components/Controls/Controls.css"

const ControlsPage = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchControls = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/controls");
        setControls(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setControls([]);
        console.error(err.response ? err.response.data : err.message);
      }
      setLoading(false);
    };
    fetchControls();
  }, [location.key]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/controls/${id}`);
      navigate("/controls");
    } catch (error) {
      console.error("Failed to delete control:", error);
      alert("Delete failed. Please try again.");
    }
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-content">
        <ControlsHeader onCreate={() => navigate("/controls/create")} />
        <ControlsTable controls={controls} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ControlsPage;
