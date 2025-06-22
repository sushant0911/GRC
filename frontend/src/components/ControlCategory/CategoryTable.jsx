import { FaEdit, FaTrash } from "react-icons/fa";
import "./ControlCategory.css";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="category-table-container">
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button className="icon-btn" title="Edit" onClick={() => onEdit(cat)}>
                    <FaEdit size={16} />
                  </button>
                  <button className="icon-btn" title="Delete" onClick={() => onDelete(cat._id)}>
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
