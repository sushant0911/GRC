import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./ComplianceControl.css";

const ComplianceControl = ({ complianceName, apiBasePath, fields }) => {
  const [categories, setCategories] = useState([]);
  const [controls, setControls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [complianceName]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, controlsRes] = await Promise.all([
        axios.get("/api/control-categories"),
        axios.get(`${apiBasePath}/${complianceName.toLowerCase()}/controls`)
      ]);
      setCategories(catRes.data);
      setControls(controlsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (control) => {
    setEditingId(control._id);
    const updatedForm = {};
    fields.forEach((f) => {
      updatedForm[f.name] = control[f.name];
    });
    updatedForm.category = control.category?._id || control.category;
    setFormData(updatedForm);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this control?")) {
      try {
        await axios.delete(`${apiBasePath}/${complianceName.toLowerCase()}/controls/${id}`);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete control");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${apiBasePath}/${complianceName.toLowerCase()}/controls/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          `${apiBasePath}/${complianceName.toLowerCase()}/controls`,
          formData
        );
      }
      setShowPopup(false);
      setFormData({});
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="cc-container">
      <div className="cc-wrapper">
        <div className="cc-header">
          {complianceName} Controls
          {error && <div className="cc-error">{error}</div>}
        </div>
        
        <button 
          className="cc-add-btn" 
          onClick={() => {
            setFormData({});
            setEditingId(null);
            setShowPopup(true);
          }}
        >
          + Add {complianceName} Control
        </button>

        {isLoading ? (
          <div className="cc-loading">Loading controls...</div>
        ) : (
          <div className="cc-table-wrapper">
            <table className="cc-table">
              <thead>
                <tr>
                  {fields.map((f) => (
                    <th key={f.name}>{f.label}</th>
                  ))}
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {controls.length > 0 ? (
                  controls.map((control) => (
                    <tr key={control._id}>
                      {fields.map((f) => (
                        <td key={`${control._id}-${f.name}`}>
                          {control[f.name]}
                        </td>
                      ))}
                      <td>
                        {typeof control.category === "object" && control.category
                          ? control.category.name
                          : categories.find((c) => c._id === control.category)
                              ?.name || "Unknown"}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(control)}
                          className="icon-btn"
                          aria-label="Edit"
                        >
                          <FaEdit size={12} color="#4e4e4e" />
                        </button>
                        <button
                          onClick={() => handleDelete(control._id)}
                          className="icon-btn"
                          aria-label="Delete"
                        >
                          <FaTrash size={12} color="#4e4e4e" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length + 2} className="cc-no-data">
                      No controls found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showPopup && (
          <div className="cc-popup-overlay">
            <form className="cc-popup-form" onSubmit={handleSubmit}>
              <h3>
                {editingId ? "Edit" : "Add"} {complianceName} Control
              </h3>
              
              <label>
                Category
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
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
              
              {fields.map((f) => (
                <label key={f.name}>
                  {f.label}
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      value={formData[f.name] || ""}
                      onChange={handleChange}
                      required={f.required !== false}
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name] || ""}
                      onChange={handleChange}
                      required={f.required !== false}
                      pattern={f.pattern}
                      minLength={f.minLength}
                      maxLength={f.maxLength}
                    />
                  )}
                </label>
              ))}
              
              <div className="cc-popup-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowPopup(false);
                    setFormData({});
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
  );
};

export default ComplianceControl;