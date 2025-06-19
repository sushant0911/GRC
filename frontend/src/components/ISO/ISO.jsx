import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ISO.css"

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
  const [popupCategory, setPopupCategory] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get("/api/control-categories").then((res) => setCategories(res.data));
    axios.get("/api/compliance-iso").then((res) => setIsoCompliances(res.data));
  }, []);

  const grouped = categories.map((cat) => ({
    ...cat,
    controls: isoCompliances.filter((iso) => {
      if (typeof iso.category === "object" && iso.category !== null) {
        return iso.category._id === cat._id;
      }
      return iso.category === cat._id;
    }),
  }));

  const handleEdit = (ctrl) => {
    setEditingId(ctrl._id); 
    setNewISO({
      category: ctrl.category._id || ctrl.category,
      controlName: ctrl.controlName,
      isoControlRef: ctrl.isoControlRef,
    });
    setPopupCategory(ctrl.category._id || ctrl.category);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this control?")) {
      try {
        await axios.delete(`/api/compliance-iso/${id}`);
        const res = await axios.get("/api/compliance-iso");
        setIsoCompliances(res.data);
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
      setPopupCategory("");
      setEditingId(null);

      // Refresh list
      const res = await axios.get("/api/compliance-iso");
      setIsoCompliances(res.data);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const openPopupForCategory = (catId) => {
    setPopupCategory(catId);
    setNewISO({ ...newISO, category: catId });
    setShowPopup(true);
  };

  const toggleCollapse = (catId) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div style={{ flex: 1 }}>
      <div className="compliance-iso-container">
        <div className="compliance-iso-header">ISO Controls by Category</div>
        <button
          className="compliance-iso-add-btn"
          onClick={() => {
            setShowPopup(true);
            setPopupCategory("");
          }}
        >
          + Add ISO Compliance
        </button>

        {grouped.map((cat) => (
          <div className="compliance-iso-category" key={cat._id}>
            <div
              className="compliance-iso-category-header"
              onClick={() => toggleCollapse(cat._id)}
              aria-expanded={!collapsed[cat._id]}
            >
              <span className="category-name">{cat.name}</span>
              <span
                className="category-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="compliance-iso-create-btn"
                  type="button"
                  onClick={() => openPopupForCategory(cat._id)}
                >
                  + Create ISO Control
                </button>
              </span>
            </div>

            {!collapsed[cat._id] && (
              <div className="compliance-iso-table-wrapper">
                {cat.controls.length ? (
                  <table className="compliance-iso-table">
                    <thead>
                      <tr>
                        <th>Control Name</th>
                        <th>Reference Number</th>
                        <th>Action</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {cat.controls.map((ctrl) => (
                        <tr key={ctrl._id}>
                          <td>{ctrl.controlName}</td>
                          <td>{ctrl.isoControlRef}</td>
                          <td>
                            <button
                              onClick={() => handleEdit(ctrl)}
                              title="Edit"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                marginRight: "8px",
                              }}
                            >
                              {editIcon}
                            </button>
                            <button
                              onClick={() => handleDelete(ctrl._id)}
                              title="Delete"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              {deleteIcon}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="compliance-iso-empty">
                    No ISO controls in this category.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {showPopup && (
          <div className="compliance-iso-popup-overlay">
            <form
              className="compliance-iso-popup-form"
              onSubmit={handlePopupSubmit}
            >
              <h3>Add ISO Compliance</h3>
              <label>
                Category
                <select
                  name="category"
                  value={popupCategory || newISO.category}
                  onChange={handlePopupChange}
                  required
                  disabled={!!popupCategory}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
                ISO Reference Number
                <input
                  type="text"
                  name="isoControlRef"
                  value={newISO.isoControlRef}
                  onChange={handlePopupChange}
                  required
                />
              </label>
              <div className="compliance-iso-popup-actions">
                <button
                  type="button"
                  className="compliance-iso-popup-cancel"
                  onClick={() => {
                    setShowPopup(false);
                    setPopupCategory("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="compliance-iso-popup-save">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISO;
