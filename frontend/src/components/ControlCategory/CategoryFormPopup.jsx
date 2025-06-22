import "./ControlCategory.css";

const CategoryFormPopup = ({ form, setForm, onSubmit, onClose, isEditing }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h3>{isEditing ? "Edit Category" : "Add Category"}</h3>
        <form onSubmit={onSubmit}>
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
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{isEditing ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPopup;
