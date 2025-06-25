import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ComplianceControlsTable.css";
import Sidebar from "../components/Sidebar/Sidebar";

const ComplianceControlsTable = () => {
  const { name } = useParams();
  const [controls, setControls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newControl, setNewControl] = useState({
    controlRef: "",
    controlName: "",
    description: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
      console.log("Data loaded:", { compliance, controls, categories });
    };
    loadData();
  }, [name]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [complianceRes, controlsRes, categoriesRes] = await Promise.all([
        axios.get(`/api/compliances/${name}`),
        axios.get(`/api/compliances/${name}/controls`),
        axios.get("/api/control-categories"),
      ]);

      setCompliance(complianceRes.data);
      setControls(controlsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (control) => {
    console.log()
    setEditingId(control._id);
    setNewControl({
      controlRef: control.controlRef,
      controlName: control.controlName,
      description: control.description,
      category: control.category?._id || control.category || "",
    });
    console.log(newControl);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this control?")) {
      try {
        await axios.delete(`/api/compliances/${name}/controls/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handlePopupChange = (e) => {
    setNewControl({ ...newControl, [e.target.name]: e.target.value });
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Only send the fields that can be updated
        await axios.put(`/api/compliances/${name}/controls/${editingId}`, {
          controlRef: newControl.controlRef,
          controlName: newControl.controlName,
          description: newControl.description,
          category: newControl.category,
        });
      } else {
        const controlWithId = {
          ...newControl,
          _id: uuidv4(),
        };
        await axios.post(`/api/compliances/${name}/controls`, controlWithId);
      }
      // Reset form and refresh data
      setShowPopup(false);
      setNewControl({
        controlRef: "",
        controlName: "",
        description: "",
        category: "",
      });
      setEditingId(null);
      await fetchData(); // Wait for data refresh
    } catch (err) {
      console.error(
        "Error submitting form:",
        err.response?.data || err.message
      );
      // Consider adding user feedback here
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!compliance) return <div className="not-found">Compliance not found</div>;

  return (
    <div className="compliance-controls-page">
      <Sidebar />
      <div className="main-content">
        <div className="compliance-controls-container">
          <div className="controls-header-wrapper">
            <div className="controls-header">
              <h3>{compliance.displayName} Controls</h3>
            </div>
            <button
              className="controls-add-btn"
              onClick={() => setShowPopup(true)}
            >
              + Add Control
            </button>
          </div>

          <div className="controls-table-wrapper">
            <table className="controls-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Control Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr key={control._id}>
                    <td>{control.controlRef}</td>
                    <td>{control.controlName}</td>
                    <td className="description-cell">
                      {control.description || "-"}
                    </td>
                    <td>
                      {typeof control.category === "object" &&
                      control.category !== null
                        ? control.category.name
                        : categories.find((c) => c._id === control.category)
                            ?.name || "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(control)}
                        title="Edit"
                        className="icon-btn"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#4e4e4e"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                          <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0L15.13 4.13l3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(control._id)}
                        title="Delete"
                        className="icon-btn"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#4e4e4e"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
                          <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {controls.length === 0 && (
              <div className="no-controls">
                No controls found for this compliance standard
              </div>
            )}
          </div>

          {showPopup && (
            <div className="controls-popup-overlay">
              <form
                className="controls-popup-form"
                onSubmit={handlePopupSubmit}
              >
                <h3>{editingId ? "Edit Control" : "Add New Control"}</h3>

                <label>
                  Reference*
                  <input
                    type="text"
                    name="controlRef"
                    value={newControl.controlRef}
                    onChange={handlePopupChange}
                    required
                  />
                </label>

                <label>
                  Control Name*
                  <input
                    type="text"
                    name="controlName"
                    value={newControl.controlName}
                    onChange={handlePopupChange}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    name="description"
                    value={newControl.description}
                    onChange={handlePopupChange}
                    rows={4}
                  />
                </label>

                <label>
                  Category
                  <select
                    name="category"
                    value={newControl.category}
                    onChange={handlePopupChange}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="controls-popup-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowPopup(false);
                      setNewControl({
                        controlRef: "",
                        controlName: "",
                        description: "",
                        category: "",
                      });
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceControlsTable;
