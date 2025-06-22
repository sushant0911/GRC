import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit  } from "react-icons/fa";
import "./ComplianceControl.css";

const ComplianceControl = ({ title, apiBasePath, fields }) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [catRes, dataRes] = await Promise.all([
      axios.get("/api/control-categories"),
      axios.get(apiBasePath),
    ]);
    setCategories(catRes.data);
    setItems(dataRes.data);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    const updatedForm = {};
    fields.forEach((f) => {
      updatedForm[f.name] = item[f.name];
    });
    updatedForm.category = item.category?._id || item.category;
    setFormData(updatedForm);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this control?")) {
      await axios.delete(`${apiBasePath}/${id}`);
      fetchData();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${apiBasePath}/${editingId}`, formData);
    } else {
      await axios.post(apiBasePath, formData);
    }
    setShowPopup(false);
    setFormData({});
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="cc-container">
      <div className="cc-wrapper">
        <div className="cc-header">{title} Controls</div>
        <button className="cc-add-btn" onClick={() => setShowPopup(true)}>
          + Add {title} Control
        </button>

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
              {items.map((item) => (
                <tr key={item._id}>
                  {fields.map((f) => (
                    <td key={f.name}>{item[f.name]}</td>
                  ))}
                  <td>
                    {typeof item.category === "object" && item.category
                      ? item.category.name
                      : categories.find((c) => c._id === item.category)?.name ||
                        "Unknown"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className="icon-btn"
                    >
                      <FaEdit size={12} color="#4e4e4e"/>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="icon-btn"
                    >
                      <FaTrash size={12} color="#4e4e4e"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="cc-popup-overlay">
            <form className="cc-popup-form" onSubmit={handleSubmit}>
              <h3>
                {editingId ? "Edit" : "Add"} {title} Control
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
                  <input
                    type="text"
                    name={f.name}
                    value={formData[f.name] || ""}
                    onChange={handleChange}
                    required
                  />
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
