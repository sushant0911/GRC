import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./ControlCategory.css";

const ControlCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    compliance: "",
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("/api/control-categories");
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", form);
      if (editId) {
        await axios.put(`/api/control-categories/${editId}`, form);
      } else {
        await axios.post("/api/control-categories", form);
      }
      setForm({ compliance: "", name: "", description: "" });
      setShowPopup(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      compliance: cat.compliance,
      name: cat.name,
      description: cat.description
    });
    setEditId(cat._id);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(`/api/control-categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div className="category-page">
          <div className="category-header">
            <h2>Control Categories</h2>
            <button
              className="add-category-btn"
              onClick={() => {
                setForm({ compliance: "", name: "", description: "" });
                setEditId(null);
                setShowPopup(true);
              }}
            >
              Add Category
            </button>
          </div>
          <div className="category-table-container">
            <table className="category-table">
              <thead>
                <tr>
                  <th>Compliance</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>{cat.compliance}</td>
                      <td>{cat.name}</td>
                      <td>{cat.description}</td>
                      <td>
                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() => handleEdit(cat)}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="icon-btn"
                          title="Delete"
                          onClick={() => handleDelete(cat._id)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-form">
                <h3>{editId ? "Edit Category" : "Add Category"}</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Compliance Type
                    <select
                      name="compliance"
                      value={form.compliance}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Compliance</option>
                      <option value="ISO">ISO</option>
                      <option value="CICRA">CICRA</option>
                      <option value="CIBIL">CIBIL</option>
                    </select>
                  </label>
                  <label>
                    Category Name
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </label>
                  <div className="popup-actions">
                    <button type="submit">{editId ? "Update" : "Add"}</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPopup(false);
                        setEditId(null);
                        setForm({ compliance: "", name: "", description: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlCategory;
