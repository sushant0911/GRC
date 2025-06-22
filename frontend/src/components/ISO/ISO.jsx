import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ISO.css";

const ISO = () => {
  const editIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#4e4e4e">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
      <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0L15.13 4.13l3.75 3.75 1.83-1.83z" />
    </svg>
  );

  const deleteIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#4e4e4e">
      <path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
      <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );

  const [categories, setCategories] = useState([]);
  const [isoCompliances, setIsoCompliances] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newISO, setNewISO] = useState({
    category: "",
    controlName: "",
    isoControlRef: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [catRes, isoRes] = await Promise.all([
      axios.get("/api/control-categories"),
      axios.get("/api/compliance-iso"),
    ]);
    setCategories(catRes.data);
    setIsoCompliances(isoRes.data);
  };

  const handleEdit = (ctrl) => {
    setEditingId(ctrl._id);
    setNewISO({
      category: ctrl.category?._id || ctrl.category,
      controlName: ctrl.controlName,
      isoControlRef: ctrl.isoControlRef,
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this control?")) {
      try {
        await axios.delete(`/api/compliance-iso/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handlePopupChange = (e) => {
    setNewISO({ ...newISO, [e.target.name]: e.target.value });
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/compliance-iso/${editingId}`, newISO);
      } else {
        await axios.post("/api/compliance-iso", newISO);
      }
      setShowPopup(false);
      setNewISO({ category: "", controlName: "", isoControlRef: "" });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="iso-container">
      <div className="iso-header-wrapper">
        <div className="iso-header">ISO Controls</div>
        <button className="iso-add-btn" onClick={() => setShowPopup(true)}>
          + Add ISO Control
        </button>
      </div>

      <div className="iso-table-wrapper">
        <table className="iso-table">
          <thead>
            <tr>
              <th>ISO Reference</th>
              <th>Control Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isoCompliances.map((ctrl) => (
              <tr key={ctrl._id}>
                <td>{ctrl.isoControlRef}</td>
                <td>{ctrl.controlName}</td>
                <td>
                  {typeof ctrl.category === "object" && ctrl.category !== null
                    ? ctrl.category.name
                    : categories.find((c) => c._id === ctrl.category)?.name ||
                      "Unknown"}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(ctrl)}
                    title="Edit"
                    className="icon-btn"
                  >
                    {editIcon}
                  </button>
                  <button
                    onClick={() => handleDelete(ctrl._id)}
                    title="Delete"
                    className="icon-btn"
                  >
                    {deleteIcon}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="iso-popup-overlay">
          <form className="iso-popup-form" onSubmit={handlePopupSubmit}>
            <h3>{editingId ? "Edit ISO Control" : "Add ISO Control"}</h3>
            <label>
              ISO Control Ref
              <input
                type="text"
                name="isoControlRef"
                value={newISO.isoControlRef}
                onChange={handlePopupChange}
                required
              />
            </label>
            <label>
              Control Name
              <input
                type="text"
                name="controlName"
                value={newISO.controlName}
                onChange={handlePopupChange}
                required
              />
            </label>

            <label>
              Category
              <select
                name="category"
                value={newISO.category}
                onChange={handlePopupChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="iso-popup-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowPopup(false);
                  setNewISO({
                    category: "",
                    controlName: "",
                    isoControlRef: "",
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
  );
};

export default ISO;
