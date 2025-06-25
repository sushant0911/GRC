import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import "./AddCompliance.css";

const AddCompliance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    controls: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    console.log(formData);
    try {
      const response = await axios.post("/api/compliances", {
        name: formData.name,
        displayName: formData.displayName,
      });
      if (response.status === 201) {
        navigate(`/compliance/${formData.name.toLowerCase()}/controls`);
      }
    } catch (error) {
      console.error("Error creating compliance:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create compliance. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="compliance-page-container">
      <Sidebar />

      <div className="content-container">
        <div className="compliance-form-container">
          <h1 className="page-title">Create New Compliance Standard</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="compliance-form">
            <div className="form-section">
              <h4 className="section-title">Basic Information</h4>

              <div className="form-group">
                <label htmlFor="name">Compliance Code</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  pattern="[A-Z0-9]{2,20}"
                  title="2-20 uppercase letters or numbers"
                  className="form-input"
                  placeholder="Enter the Compliance"
                />
                <small className="form-hint">
                  *Must be 2-20 uppercase letters or numbers
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter the Display Name"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn"
                handleSubmit
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Creating...
                  </>
                ) : (
                  "Continue to Add Controls"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompliance;
