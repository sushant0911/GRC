import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import CategoryTable from "./../components/ControlCategory/CategoryTable";
import CategoryFormPopup from "./../components/ControlCategory/CategoryFormPopup";
import "./../components/ControlCategory/ControlCategory.css";

const ControlCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/api/control-categories");
    setCategories(res.data);
  };

  const handleEdit = (cat) => {
    setForm({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(`/api/control-categories/${editId}`, form);
      } else {
        await axios.post("/api/control-categories", form);
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      setShowPopup(false);
      fetchCategories();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div className="category-page">
          <div className="category-header">
            <h3>Control Categories</h3>
            <button
              className="add-category-btn"
              onClick={() => {
                setForm({ name: "", description: "" });
                setEditId(null);
                setShowPopup(true);
              }}
            >
              Add Category
            </button>
          </div>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {showPopup && (
            <CategoryFormPopup
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onClose={() => {
                setShowPopup(false);
                setEditId(null);
                setForm({ name: "", description: "" });
              }}
              isEditing={!!editId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlCategory;
